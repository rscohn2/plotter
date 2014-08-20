var express = require('express');
var router = express.Router();

function home(req, res) {
    console.log('home the plotter');
    res.send('ok');
}

/* home the plotter */
router.get('/home', home);

module.exports = router;
