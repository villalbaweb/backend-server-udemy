var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs'); 

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// default options
app.use(fileUpload());


app.put('/:tipo/:userId', (req, res, next) => {

    var tipo = req.params.tipo;
    var userId = req.params.userId;

    // tipos de coleccion validos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
        .json({
            ok: false,
            mensaje: 'Tipo de archivo no valido',
            error: { message: 'Debe seleccionar una coleccion valida: hospitales, medicos, usuarios'}
        });
    }

    // check if there is a file attached in the request
    if(!req.files) {
        return res.status(400)
        .json({
            ok: false,
            mensaje: 'No selecciono nada',
            error: { message: 'Debe seleccionar una imagen'}
        });
    }

    // obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // just this extensions are valid
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400)
        .json({
            ok: false,
            mensaje: 'Extension no valida',
            error: { message: 'Debe seleccionar un archivo con extension png, jpg, gif, jpeg'}
        });
    }

    // Nombre de archivo unico
    var nombreArchivoUnico = `${userId}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover archivo a un path especifico
    var path = `./uploads/${tipo}/${nombreArchivoUnico}`;

    archivo.mv(path, err => {
        if(err) {
            return res.status(400)
            .json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });
        }

        // actualizar DB
        subirPorTipo(tipo, userId, nombreArchivoUnico, res)
    })
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if(tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
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

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe elimina archivo anterior
            if(fs.existsSync(pathViejo, (error) => {}) && usuario.img !== '') {
                fs.unlink(pathViejo, (error) => {});
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }
                
                usuarioActualizado.password = ';-)';
                return res.status(200)
                .json({
                    ok: true,
                    mensaje: 'Usuario ' + id + ' actualizado.',
                    usuario: usuarioActualizado
                });

            });
        });
    }

    if(tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }
    
            if(!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: { mensaje: `El medico id: ${id} no existe`}
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // si existe elimina archivo anterior
            if(fs.existsSync(pathViejo, (error) => {}) && medico.img !== '') {
                fs.unlink(pathViejo, (error) => {});
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    });
                }

                return res.status(200)
                .json({
                    ok: true,
                    mensaje: 'Medico ' + id + ' actualizado.',
                    medico: medicoActualizado
                });
            });
        });
    }

    if(tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            
            if(!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: { mensaje: `El hospital id: ${id} no existe`}
                });
            }
            
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe elimina archivo anterior
            if(fs.existsSync(pathViejo, (error) => {}) && hospital.img !== '') {
                fs.unlink(pathViejo, (error) => {});
            }
            
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                }
                
                return res.status(200)
                .json({
                    ok: true,
                    mensaje: 'Hospital ' + id + ' actualizado.',
                    hospital: hospitalActualizado
                });
            }); 
        });
    }
}

module.exports = app;