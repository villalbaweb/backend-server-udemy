var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Hospital = require('../models/hospital');

//==========================================================
//              Obtener lista de hospitales
//==========================================================
app.get('/', (req, res, next) => {

    Hospital.find( { }, 'nombre img usuario')
    .exec((error, hospitales) => {

        if(error) {
            res.status(500),json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: error
            });
        }

        res.status(200)
        .json({
            ok: true,
            hospitales: hospitales
        });
    });
});

module.exports = app;