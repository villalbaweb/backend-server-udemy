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


//==========================================================
//              Guardar nuevo medico
//==========================================================
app.post('/', mdAuthentication.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuarioId,
        hospital: body.hospitalId
    });

    medico.save((error, medicoGuardado) => {

        if(error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: error
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoGuardado,
            requestRource: req.requestFrom
        });
    });
});


//==========================================================
//              Eliminar hospital
//==========================================================
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
        if(error) {
            return res.status(500),json({

                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: error
            });
        }

        if(!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: { mensaje: `El medico id: ${id} no existe`}
            });
        }

        return res.status(200).json({
            ok: true,
            medicoEliminado: medicoBorrado,
            requestSource: req.requestFrom
        });
    });
});


module.exports = app;