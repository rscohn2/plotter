var express = require('express');
var router = express.Router();

var plotter = require('../plotter/plotter-ctrl');


/* stop the plotter */
function stop(req, res) {
    console.log('stop the plotter');
    plotter.stop();
    res.send('ok');
}

router.get('/stop', stop);

/* run the plotter */
function run(req, res) {
    console.log('run the plotter');
    plotter.run();
    res.send('ok');
}

router.get('/run', run);

/* home the plotter */
function home(req, res) {
    console.log('home the plotter');
    plotter.homeAll();
    res.send('ok');
}

router.get('/home', home);

/* sweep the plotter */
function sweep(req, res) {
    console.log('sweep the plotter');
    plotter.sweepAll();
    res.send('ok');
}

router.get('/sweep', sweep);

/*
function runProgram(req, res) {
    console.log('body: ' + req.body);
    console.log('running program:\n' + JSON.stringify(req.body));
    plotter.execute(req.body.program);
    res.send('ok');
}
router.post('/runProgram', runProgram);
*/
plotter.setup();

module.exports = router;
