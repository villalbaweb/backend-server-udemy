var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var usuariosValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


var usuarioSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nomnbre es necesario'] 
    },
    email: { 
        type: String, 
        unique: true, 
        required: [true, 'El correo es necesario']
    },
    password: { 
        type: String, 
        required: [true, 'Contraseña obligatoria']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: usuariosValidos
    },
    google: { 
        type: Boolean, 
        default: false
    }    
});

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);