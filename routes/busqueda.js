var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//==========================================================
//              Busqueda por coleccion
//==========================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;

    var regexBusqueda = new RegExp(busqueda, 'i');

    var busquedaEspecifica;
    switch(tabla) {
        case 'hospitales':
            busquedaEspecifica = busquedaHospitales(regexBusqueda);
            break;
        case 'medicos':
            busquedaEspecifica = busquedaMedicos(regexBusqueda);
            break;
        case 'usuarios':
            busquedaEspecifica = busquedaUsuarios(regexBusqueda);
            break;
        default:
            return res.status(400)
            .json({
                ok: false,
                mensaje: 'Las colecciones disponibles son : usuarios, medicos y hospitales',
                error: { message: 'Tipo de coleccion no valido'}
            });
    };
    
    busquedaEspecifica
    .then( resultado => {
        res.status(200)
        .json({
            ok: true,
            [tabla]: resultado
        });
    });
});

//==========================================================
//              Busqueda General
//==========================================================
app.get('/todo/:busqueda', (req, res, next) => {
    
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    
    Promise.all([ 
        busquedaHospitales(regex), 
        busquedaMedicos(regex),
        busquedaUsuarios(regex)
    ])
    .then( respuestas => {
        res.status(200)
        .json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});

function busquedaHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital
        .find({nombre: regex})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if(err){
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function busquedaMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico
        .find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if(err){
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function busquedaUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario
        .find({}, 'nombre email role')
        .or([{'nombre': regex}, {'email': regex}])
        .exec((err, usuario)=> {
            if(err){
                reject('Error al cargar medicos', err);
            } else {
                resolve(usuario);
            }
        });
    });
}

module.exports = app;