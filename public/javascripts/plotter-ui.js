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