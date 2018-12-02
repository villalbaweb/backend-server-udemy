// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busqiedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');

// COnexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if(err) throw err;

    console.log('DB server port 27017: \x1b[32m%s\x1b[0m','online')
});

// Rutas
app.use('/', appRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busqiedaRoutes);
app.use('/upload', uploadRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m','online');
});