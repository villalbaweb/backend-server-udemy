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

//==========================================================
//              Guardar nuevo hospital
//==========================================================
app.post('/', mdAuthentication.verificaToken , (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuarioId
    });

    hospital.save((error, hospitalGuardado) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: error
            });
        }

        res.status(200)
        .json({
            ok: true,
            hospital: hospital,
            requestSource: req.requestFrom
        })
    });
});


module.exports = app;