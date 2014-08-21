/* Ported to Node.js  - Original header below */
/*************************************************** 
  This is a library for our Adafruit 16-channel PWM & Servo driver

  Pick one up today in the adafruit shop!
  ------> http://www.adafruit.com/products/815

  These displays use I2C to communicate, 2 pins are required to  
  interface. For Arduino UNOs, thats SCL -> Analog 5, SDA -> Analog 4

  Adafruit invests time and resources providing this open source code, 
  please support Adafruit and open-source hardware by purchasing 
  products from Adafruit!

  Written by Limor Fried/Ladyada for Adafruit Industries.  
  BSD license, all text above must be included in any redistribution
 ****************************************************/
var i2c = require('i2c');
var PWM = require('./PWMDriver_PCA9685_h.js');

//Format of addr array
//[{address:0x40,prescaleCorrection:1.0864},{address:0x41,prescaleCorrection:1.0864}]

var PWMServoDriver = function(i2c_device_path, addr)
{
  
  if(Array.isArray(addr)){
    this.PWMChipRegistry = addr; 
  }
  else
  {
    var tmpi2caddr = (addr == undefined)?PWM.DEFAULT_ADDRESS:addr;
    this.PWMChipRegistry = [{address:tmpi2caddr}];
  }
  
  var wire = new i2c(this.PWMChipRegistry[0].address, {device: i2c_device_path, debug: false});

  //Write 8bits
  function read8(i2cDeviceAddress, addr) { //uint8_t addr
    wire.setAddress(i2cDeviceAddress);
    wire.writeByte(addr, function(err) {});

    wire.setAddress(i2cDeviceAddress);
    var dataIn = wire.readByte(function(err, res) {  });
    return dataIn;
  }

  //Read 8bits
  function write8(i2cDeviceAddress, addr, d) { //uint8_t addr, uint8_t d

    wire.setAddress(i2cDeviceAddress);
    wire.writeBytes(addr, [d], function(err) {});
  }


  PWMServoDriver.prototype.begin = function() {
   this.reset(); //WIRE.begin();
  }

   PWMServoDriver.prototype.stop = function() { //void
     for(var i in this.PWMChipRegistry)
      write8(this.PWMChipRegistry[i].address,cmd, 0x1);
  }

   PWMServoDriver.prototype.stop = function() { //void
     for(var i in this.PWMChipRegistry)
      write8(this.PWMChipRegistry[i].address,PWM.ALLLED_OFF_H, 0x1);
  }

  PWMServoDriver.prototype.reset = function() { //void
    for(var i in this.PWMChipRegistry)
      write8(this.PWMChipRegistry[i].address, PWM.PCA9685_MODE1, 0x0);
  }

  PWMServoDriver.prototype.setPWMFreq = function(freq) { //float freq
    //console.log("Attempting to set freq ");
    //console.log(freq);

    for(var i in this.PWMChipRegistry) {

      var prescaleCorrection = this.PWMChipRegistry[i].prescaleCorrection?this.PWMChipRegistry[i].prescaleCorrection:1;

      var prescaleval = 25000000;

      prescaleval = prescaleval*prescaleCorrection;
      prescaleval /= 4096;
      prescaleval /= freq;
      prescaleval -= 1;
      console.log("Estimated pre-scale: "); console.log(prescaleval);
      prescale = Math.floor(prescaleval + 0.5);
      console.log("Final pre-scale: "); console.log(prescale);  

      var oldmode = read8(this.PWMChipRegistry[i].address, PWM.PCA9685_MODE1);
      var newmode = (oldmode&0x7F) | 0x10; // sleep
      write8(this.PWMChipRegistry[i].address, PWM.PCA9685_MODE1, newmode); // go to sleep
      write8(this.PWMChipRegistry[i].address, PWM.PCA9685_PRESCALE, prescale); // set the prescaler
      write8(this.PWMChipRegistry[i].address, PWM.PCA9685_MODE1, oldmode);
     
      var sleep = require('sleep'); sleep.usleep(5000); //delay(5);
      write8(this.PWMChipRegistry[i].address, PWM.PCA9685_MODE1, oldmode | 0xa1);  //  This sets the MODE1 register to turn on auto increment.
    }
  }

/*
This function sets the start (on) and end (off) of the high segment of the PWM pulse on a specific channel.  You specify the 'tick' value between 0..4095 when the signal will turn on, and when it will turn of.  Channel indicates which of the 16 PWM outputs should be updated with the new values. 
*/
  PWMServoDriver.prototype.setPWM = function(num, on, off) { //uint8_t num, uint16_t on, uint16_t off
    var chipIndex = num/PWM.CHANNEL_COUNT>>0

    if(chipIndex > this.PWMChipRegistry.length-1) {
      throw('Invalid channel number: '+num);
      return;
    }
    var channelOffset = chipIndex*PWM.CHANNEL_COUNT;
    var chipAddress = this.PWMChipRegistry[chipIndex].address;

    var data = [PWM.LED0_ON_L+4*(num-channelOffset),on,on>>8,off,off>>8];
    wire.setAddress(chipAddress);
    wire.writeBytes(data.shift(),data);
  }

}



module.exports = PWMServoDriver;