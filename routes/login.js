var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var JWTSecret = require('../config/config').SEED;    // secret para validar JWT

var app = express();

var Usuario = require('../models/usuario');


// gOOGLE
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;
 
// ===================================================
// Autenticación de google
// ===================================================
app.post('/google', (req, res) => {
    var token = req.body.token || '';
 
    const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET);
    const ticket = client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
    });
 
    ticket.then(data => {
        res.status(200).json({
            ok: true,
            ticket: data.payload,
            userid: data.payload.sub
        });
    }).catch(err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }
    });
});


//==========================================================
//              Autenticacion Normal
//==========================================================
app.post('/', (req, res) => {

    // retrieving request's body using body-parser
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        // funcion para compoarar un string entrante contra un string que ya esta encryptado por el hash
        if (!bcrypt.compareSync (body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            }); 
        }

        // usuario existe y entro password correcto, generar JWT
        usuarioDB.password = ':-)';
        var token = jwt.sign(
            { 
                usuario: usuarioDB 
            }, 
            JWTSecret, 
            { 
                expiresIn: 14400 
            }
        ); //expira en 4 horas


        res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB,
            id: usuarioDB.id
        });

    });

});

module.exports = app;