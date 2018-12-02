var express = require('express');
var fileUpload = require('express-fileupload'); 

var app = express();

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

        return res.status(200)
        .json({
            ok: true,
            mensaje: 'Request OK',
            extension: nombreArchivoUnico
        });
    })
});

module.exports = app;