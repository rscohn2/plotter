var servos = require('./servos').servos;
var plotter = require('./plotter-ctrl');
var async = require('async');

var draw = {};

function mapPos(servo, n) {
    var span = servo.max - servo.min;
    var offset = n * span;
    if (servo.home == 'max') {
        return servo.max - offset;
    } else {
        return servo.min + offset;
    }
}

function log(mess) {
    console.log(mess);
}

function servoSet(servo, n, cb) {
    log(' set servo ' + servo.channel + ' to ' + n);
    plotter.servo.move(servo.channel, n, 3000, cb);
    //if (cb) cb();
}

function setPos(servo, n, cb) {
    servoSet(servo, mapPos(servo, n), cb);
}
    
function moveto(command, cb) {
    console.log('moveto: ' + command.x + ' ' + command.y);
    setPos(servos.leftRight, command.x);
    setPos(servos.inOut, command.y, cb);
}

function executeCommand(command, cb) {
    if (command.x)
        command.x = parseInt(command.x);
    if (command.y)
        command.y = parseInt(command.y);
        
    console.log('Executing: ' + JSON.stringify(command));
    switch(command.action) {
        case 'moveto':
            moveto(command, cb);
            break;
        default:
            console.log('Unkown action: ' + command.action);
            break;
    }
}

function executeProgram(program, cb) {
    async.mapSeries(program, executeCommand, cb);
    //program.forEach(executeCommand);
}
draw.executeProgram = executeProgram;

module.exports = draw;

/*
 * Testing
 */
//executeProgram([{action: 'moveto', x: 0, y: 0}, {action: 'moveto', x: 1, y: 1}]);
