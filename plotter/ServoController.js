// Depending on your servo make, the pulse width min and max may vary, you 
// want these to be as small/large as possible without hitting the hard stop
// for max range. You'll have to tweak them as necessary to match the servos you
// have!
var SERVOMIN = 600; // this is the 'minimum' pulse length in Microseconds
var SERVOMAX = 2300; // this is the 'maximum' pulse length in Microseconds
//var SERVO_FRAMERATE = 20; //we want a frame rate of 20ms
var PWMFREQ = 60;

console.log("SERVO CONTROLLER");
// called this way, it uses the default address 0x40
var PWMClass = require('./PWMDriver_PCA9685.js');


function checkServoBounds(position, silent) {
  var origPosition = position;
  if(position > SERVOMAX) {
    position = SERVOMAX;
  } else if (position < SERVOMIN) {
    position = SERVOMIN;
  }
  
  if(origPosition !== position && !silent) {
    console.log('WARNING: position of \''+origPosition+'\' exceeds the min/max and has been set to \''+position+'\'');
  }
  
  return position;
}

var ServoController = function(i2cPath,config) {
  this.servoRegistry = [];
  this._servoPerformance = [];
  this._isperforming = false;
  this._servoCount = config.length*16;
  
  this.pwm = new PWMClass(i2cPath,config);
  this.pwm.begin();
  this.pwm.setPWMFreq(PWMFREQ);
}

// SET - set the pulse width in Microseconds
ServoController.prototype.set = function(channel,position) {

  position = checkServoBounds(position);

  //updates at 60hz aka every 1000/60 ms
  var msPeriod = 1000 / PWMFREQ;
  var tickSize = msPeriod/4096; //4096 = 12bitd of pwm 

  //var pwmTicks = Math.ceil(position/1000/tickSize);
  var pwmTicks = Math.round(position/1000/tickSize);

  //set the pwm and update registry
  this.pwm.setPWM(channel, 0, pwmTicks);
  this.servoRegistry[channel] = position;
  //console.log('Channel: '+channel+'    Position: '+position); 
}

ServoController.prototype.setAll = function(position) {
  for(var i=0; i<this._servoCount; i++) {
    this.set(i,position);
  }
}

ServoController.prototype._perform = function() {
  var pendingActions = false;
  var tickLength = 8;

  for(i in this._servoPerformance)
  {
    var currentAnimation  = this._servoPerformance[i];
    var distance = this.servoRegistry[currentAnimation.channel]-currentAnimation.destination;
    var currentTime = new Date().getTime();
    var timeLeft = (currentAnimation.startTime+currentAnimation.speed - currentTime)/tickLength;
    if(timeLeft > 0) {
      this.set(currentAnimation.channel,this.servoRegistry[currentAnimation.channel]-Math.round(distance/timeLeft));
      pendingActions = true;
    }
    else {
      //this.set(currentAnimation.channel, currentAnimation.destination);
      if(typeof currentAnimation.callback == 'function' && !currentAnimation.didCallback) {
         currentAnimation.didCallback = true;
        setTimeout(currentAnimation.callback,tickLength);
        //pendingActions = true;
      }
      else{
       currentAnimation.didCallback = true;
      }
     
      
      //delete servoPerformance[i];
    }
    
    //console.log('distance left: '+distance);//+' timeLeft: '+ currentAnimation.startTime+currentAnimation.speed - currentTime);
  }
  var self = this;
  if(pendingActions) {
    
    setTimeout(function(){self._perform();},tickLength);
  }
  else
  {
    console.log('Blanking ServoPerformance');
    this._servoPerformance = [];
    this._isperforming = false;
  }
  
}

//MOVE - Move the servo taking the specified amount of time to reach the destination
ServoController.prototype.move = function(channel,position,speed,callback) {
  var self = this;
  var startTime = new Date().getTime();
  var ServoMove = {channel:channel,destination:position,speed:speed,startTime:startTime,callback:callback,didCallback:false }
  //console.log(ServoMove);
  this._servoPerformance.push(ServoMove);
  if(!this._isperforming)
  {
    console.log("CALLING PERFORM");
     self._perform();
  }

}

ServoController.prototype.getPosition = function(channel){
 return this.servoRegistry[channel];
}
module.exports = ServoController;