var express = require('express');
var fileUpload = require('express-fileupload'); 

var app = express();

// default options
app.use(fileUpload());


app.put('/', (req, res, next) => {

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


    res.status(200)
    .json({
        ok: true,
        mensaje: 'Request OK',
        extension: extensionArchivo
    });
});

module.exports = app;