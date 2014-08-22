var servos = require('./servos').servos;
var plotter = require('./plotter-ctrl');

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

function servoSet(servo, n) {
    log(' set servo ' + servo.channel + ' to ' + n);
    plotter.servo.move(servo.channel, n, 3000);
}

function setPos(servo, n) {
    servoSet(servo, mapPos(servo, n));
}
    
function moveto(command) {
    console.log('moveto: ' + command.x + ' ' + command.y);
    setPos(servos.leftRight, command.x);
    setPos(servos.inOut, command.y);
}

function executeCommand(command) {
    if (command.x)
        command.x = parseInt(command.x);
    if (command.y)
        command.y = parseInt(command.y);
        
    console.log('Executing: ' + JSON.stringify(command));
    switch(command.action) {
        case 'moveto':
            moveto(command);
            break;
        default:
            console.log('Unkown action: ' + command.action);
            break;
    }
}

function executeProgram(program) {
    program.forEach(executeCommand);
}
draw.executeProgram = executeProgram;

module.exports = draw;

/*
 * Testing
 */
//executeProgram([{action: 'moveto', x: 0, y: 0}, {action: 'moveto', x: 1, y: 1}]);
