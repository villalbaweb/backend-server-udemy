var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
        default: 'USER_ROLE'
    }    
});

module.exports = mongoose.model('Usuario', usuarioSchema);