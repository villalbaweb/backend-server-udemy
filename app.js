// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();

// Importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');

// COnexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if(err) throw err;

    console.log('DB server port 27017: \x1b[32m%s\x1b[0m','online')
});

// Rutas
app.use('/', appRoutes);
app.use('/user', userRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m','online');
});