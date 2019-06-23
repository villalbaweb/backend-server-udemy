var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Hospital = require('../models/hospital');

//==========================================================
//              Obtener lista de hospitales
//==========================================================
app.get('/', (req, res, next) => {

    var skip = +req.query.skip || 0;
    var take = +req.query.take || 0;

    Hospital.find( { }, 'nombre img usuario')
    .skip(skip)
    .limit(take)
    .populate('usuario', 'nombre email')
    .exec((error, hospitales) => {

        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: error
            });
        }

        Hospital.count({}, (err, count) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error contando hospitales',
                    errors: err
                });
            }
            
            res.status(200)
            .json({
                ok: true,
                totalRecords: count,
                hospitales: hospitales
            });

        });

    });
});

//==========================================================
//              Obtener hospital por id
//==========================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Hospital.findById(id)
    .populate('usuario', 'nombre img email')
    .exec((error, hospital) => {

        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando hospital',
                errors: error
            });
        }

        if(!hospital) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Hospital con id ' + id + ' no existe',
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospital
        });

    });
});


//==========================================================
//              Acrualizar hospital
//==========================================================
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (error, hospital) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: error
            });
        }

        if(!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: { mensaje: `El hospital id: ${id} no existe`}
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.image;
        hospital.usuario = req.requestFrom._id;

        hospital.save((error, hospitalActualizado) => {
            if(error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }

            return res.status(200).json({
                ok: true,
                hospital: hospitalActualizado,
                requestSource: req.requestFrom
            });
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
        usuario: req.requestFrom._id
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
            hospital: hospitalGuardado,
            requestSource: req.requestFrom
        });
    });
});


//==========================================================
//              Eliminar hospital
//==========================================================
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: error
            });
        }

        if(!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: { mensaje: `El hospital id: ${id} no existe`}
            });
        }

        return res.status(200).json({
            ok: true,
            hospitalEliminado: hospitalBorrado,
            requestSource: req.requestFrom
        });

    });
});

module.exports = app;