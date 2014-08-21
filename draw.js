function mapPos(servo, n) {
    var span = servo.max - servo.min;
    var offset = n * span;
    if (home == 'max') {
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
    servo.set(servo.channel, n);
}

function setPos(servo, n) {
    servo.set(servo.channel, mapPos(servo, n));
}
    
function moveto(command) {
    console.log('moveto: ' + command.x + ' ' + command.y);
    setPos(leftRight, command.x);
    setPos(inOut, command.y);
}

function executeCommand(command) {
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