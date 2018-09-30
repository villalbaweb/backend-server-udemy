var jwt = require('jsonwebtoken');

var JWTSecret = require('../config/config').SEED;    // secret para validar JWT


//==========================================================
//              Verificar JWT
// Proper middleware that can be used in every request handler as required
//==========================================================

exports.verificaToken = function (req, res, next) {
    var token = req.query.token;

    jwt.verify( token, JWTSecret, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'JWT invalid token',
                errors: err
            });
        }


        req.requestFrom = decoded.usuario;  // adding the user that originated the request (decoded from JWT ;-) )
        next(); // allow the current request to pass trough

        // var decodedUser = decoded.usuario;
        // res.status(200).json({
        //     ok: true,
        //     decodedUser: decodedUser
        // });
    });
}




