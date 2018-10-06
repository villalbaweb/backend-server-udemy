var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Medico = require('../models/medico');

//==========================================================
//              Obtener lista de medicos
//==========================================================
app.get('/', (req, res) => {
    Medico.find( { }, 'nombre img usuario hospital')
    .exec((error, medicos) => {
        if(error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medicos',
                errors: error
            });
        }

        return res.status(200)
        .json({
            ok: true,
            medicos: medicos
        })
    });
});

module.exports = app;