var express = require('express');
var app = express();

var Usuario = require('../models/usuario');

//==========================================================
//              Obtener lista de usuarios
//==========================================================
app.get('/', (req, res, next) => {
    
    Usuario.find({ }, 'nombre email img role')
    .exec((err, usuarios) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        res.status(200)
        .json({
            ok: true,
            usuarios: usuarios
        });
    });
});

//==========================================================
//              Guardar nuevo usuario
//==========================================================
app.post('/', (req, res) => {

    // retrieving request's body using body-parser
    var body = req.body;

    var ususario = new Usuario( {
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });
    ususario.save((err, usuarioGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(200)
        .json({
            ok: true,
            ususario: usuarioGuardado
        });
    });
});

module.exports = app;