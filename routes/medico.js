var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Medico = require('../models/medico');

//==========================================================
//              Obtener lista de medicos
//==========================================================
app.get('/', (req, res) => {

    var skip = +req.query.skip || 0;
    var take = +req.query.take || 0;

    Medico.find( { }, 'nombre img usuario hospital')
    .skip(skip)
    .limit(take)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((error, medicos) => {
        if(error) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medicos',
                errors: error
            });
        }

        Medico.count({}, (err, count) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error contando medicos',
                    errors: err
                });
            }
            
            res.status(200)
            .json({
                ok: true,
                totalRecords: count,
                medicos: medicos
            });

        });

    });
});


//==========================================================
//              Acrualizar hospital
//==========================================================
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (error, medico) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: error
            });
        }

        if(!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: { mensaje: `El medico id: ${id} no existe`}
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.requestFrom._id;
        medico.hospital = body.hospital;

        medico.save((error, medicoActualizado) => {
            if(error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }

            return res.status(200).json({
                ok: true,
                medico: medicoActualizado,
                requestRource: req.requestFrom
            });
        });
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
        usuario: req.requestFrom._id,
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