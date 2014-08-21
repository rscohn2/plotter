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

var PWM = {};
PWM.PCA9685_SUBADR1 = 0x2;
PWM.PCA9685_SUBADR2 = 0x3;
PWM.PCA9685_SUBADR3 = 0x4;

PWM.PCA9685_MODE1 = 0x0;
PWM.PCA9685_PRESCALE = 0xFE;

PWM.LED0_ON_L = 0x6;
PWM.LED0_ON_H = 0x7;
PWM.LED0_OFF_L = 0x8;
PWM.LED0_OFF_H = 0x9;

PWM.ALLLED_ON_L = 0xFA;
PWM.ALLLED_ON_H = 0xFB;
PWM.ALLLED_OFF_L = 0xFC;
PWM.ALLLED_OFF_H = 0xFD;

PWM.DEFAULT_ADDRESS = 0x40;

PWM.CHANNEL_COUNT = 16;

module.exports = PWM;