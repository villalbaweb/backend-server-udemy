var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var JWTSecret = require('../config/config').SEED;    // secret para validar JWT


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
//              Verificar JWT
// This goes here to block every request that follows this point
//==========================================================
app.use('/', (req, res, next) => {

    var token = req.query.token;

    jwt.verify( token, JWTSecret, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'JWT invalid token',
                errors: err
            });
        }

        next(); // allow the current request to pass trough
    });

});

//==========================================================
//              Acrualizar usuario
//==========================================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (error, usuario) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if(!usuario) {
            return res.status(400)
            .json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: { mensaje: `El usuario id: ${id} no existe` }
            });
        } 

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
    
            return res.status(200)
            .json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });

});

//==========================================================
//              Guardar nuevo usuario
//==========================================================
app.post('/', (req, res) => {

    // retrieving request's body using body-parser
    var body = req.body;

    var usuario = new Usuario( {
        nombre: body.nombre,
        email: body.email,
        password: body.password ? bcrypt.hashSync(body.password, 10) : null,
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {
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
            usuario: usuarioGuardado
        });
    });
});

//==========================================================
//              Eliminar usuario
//==========================================================
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    //var body = req.body;

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error eliminar usuario',
                errors: error
            });
        }

        if(!usuarioBorrado){
            return res.status(400)
            .json({
                ok: false,
                mensaje: 'Error eliminar usuario',
                errors: { mensaje: `El usuario id: ${id} no existe` }
            });
        }

        return res.status(200)
            .json({
                ok: true,
                usuarioEliminado: usuarioBorrado
            });

    });   
});

module.exports = app;