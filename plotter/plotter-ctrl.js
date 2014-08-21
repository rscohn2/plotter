var ServoClass = require('./ServoController.js');
var Gpio = require('onoff').Gpio; 
var i2cEnable = new Gpio(29, 'out'); 
i2cEnable.writeSync(0)
//var EdisonSupport = require('./Edison.js'); //Edison support I just hacked in quickly.... drity but it works :)
var servo = null;

console.log('servo app');
//EdisonSupport.enable_i2c6(setup);

var plotter = {};

var run = true;

var servos = {upDown: 
                     {
                         channel: 0,
                         min: 1000,
                         max: 1800,
                         home: 'max'
                     },
                     inOut: 
                     {
                         channel: 1,
                         min: 1100,
                         max: 1900,
                         home: 'min'
                     },
                     leftRight: 
                     {
                         channel: 2,
                         min: 1000,
                         max: 1900,
                         home: 'min'
                     }};
var upDown = servos['upDown'];
var inOut = servos['inOut'];
var leftRight = servos['leftRight'];
                     

function sweep(servoName) {
    var s = servos[servoName];
    console.log(servoName + ': ' + s.min);
    servo.set(s.channel, s.min);
    setTimeout(function()
               {
                   console.log(servoName + ': ' + s.max);
                   servo.set(s.channel, s.max);
                   setTimeout(function() 
                              {
                                  sweep(servoName);
                              }, 2000);
                }, 1000);
}

function sweepAll() {
    if (!run)
        return;
    homeAll();
    setTimeout(function() {
        awayAll();
        setTimeout(sweepAll, 2000);
    }, 1000);
}

plotter.sweepAll = sweepAll;
               
//SETUP - run after i2c is enabled
function setup() {
  
    //specify the i2c bus to use
    var i2cBus = '/dev/i2c-0';  
  
    // this is an array of objects containging pwm chip address and prescale correction
    // I used a logic analyzer to adjust the prescale until the period was 60 Hertz
    // Example: If you pass in  [{address:0x40},{address:0x41}] two pwm chips will be used for a total of 32 addressable servos
    var pwmChipConfig = [{address:0x40,prescaleCorrection:1.0864}]; 
    servo = new ServoClass(i2cBus, pwmChipConfig);
  
}

function homePos(servo) {
    return servo[servo.home];
}

function awayPos(servo) {
    var away = 'min';
    if (servo.home == 'min')
        away = 'max';
    return servo[away];
}
        
function homeAll() {
    console.log('in homeAll');
    // down
    servo.set(upDown.channel, homePos(upDown));
    // left
    servo.set(leftRight.channel, homePos(leftRight));
    //out
    servo.set(inOut.channel, homePos(inOut));
    console.log('homeall done');
}
plotter.homeAll = homeAll;

function awayAll() {
    // down
    servo.set(upDown.channel, awayPos(upDown));
    // left
    servo.set(leftRight.channel, awayPos(leftRight));
    //out
    servo.set(inOut.channel, awayPos(inOut));
}

module.exports = plotter;

function setStop() {
    run = false;
}
plotter.stop = setStop;

function setRun() {
    run = true;
}
plotter.run = setRun;

setup();
/*
setup();
//sweep('upDown');
//sweep('leftRight');
//homeServos();
//awayServos();
sweepAll();
*/




