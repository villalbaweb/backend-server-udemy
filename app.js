// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();

// COnexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if(err) throw err;

    console.log('DB server port 27017: \x1b[32m%s\x1b[0m','online')
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200)
    .json({
        ok: true,
        mensaje: 'Request OK'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m','online');
});