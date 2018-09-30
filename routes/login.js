var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    // retrieving request's body using body-parser
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        // funcion para compoarar un string entrante contra un string que ya esta encryptado por el hash
        if (!bcrypt.compareSync (body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            }); 
        }

        // usuario existe y entro password correcto, generar JWT 
        
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB.id
        });

    });

});

module.exports = app;