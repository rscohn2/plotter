var home = function() {
    console.log('home');
    $.get('plotter/home');
}

var sweep = function() {
    console.log('sweep');
    $.get('plotter/sweep');
}

var stop = function() {
    console.log('stop');
    $.get('plotter/stop');
}

var run = function() {
    console.log('run');
    $.get('plotter/run');
}

var runProgram = function() {
    var programText = $('#program').val();
    var programJSON = {program: JSON.parse(programText)};
    console.log('program: ' + JSON.stringify(programJSON, null, 4));
    $.ajax({
        url: 'plotter/runProgram',
        type: 'POST',
        dataType: 'json',
        data: programJSON
    });
}