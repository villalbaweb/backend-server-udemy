var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Usuario = require('../models/usuario');

//==========================================================
//              Obtener lista de usuarios
//==========================================================
app.get('/', (req, res, next) => {

    var skip = +req.query.skip || 0;
    var take = +req.query.take || 0;
    
    Usuario.find({ }, 'nombre email img role')
    .skip(skip)
    .limit(take)
    .exec((err, usuarios) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        Usuario.count({}, (err, count) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error contando usuarios',
                    errors: err
                });
            }
            
            res.status(200)
            .json({
                ok: true,
                totalRecords: count,
                usuarios: usuarios
            });

        });

    });
});


//==========================================================
//              Acrualizar usuario
//==========================================================
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {

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
                usuario: usuarioGuardado,
                requestSource: req.requestFrom
            });
        });

    });

});

//==========================================================
//              Guardar nuevo usuario
//==========================================================
app.post('/', mdAuthentication.verificaToken ,(req, res) => {

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
            usuario: usuarioGuardado,
            requestSource: req.requestFrom
        });
    });
});

//==========================================================
//              Eliminar usuario
//==========================================================
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {
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
                usuarioEliminado: usuarioBorrado,
                requestSource: req.requestFrom
            });

    });   
});

module.exports = app;