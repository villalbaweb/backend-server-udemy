var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    res.status(200).json({
        ok: true,
        message: 'Login response'
    });
});

module.exports = app;