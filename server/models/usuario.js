const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
};

let Schema = mongoose.Schema;

let usuario = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        require: [true, 'El password es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// sobreescribir el método que devuelve el JSON del usuario para no retornar el password
usuario.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuario.plugin(uniqueValidator, {
    message: "{PATH} debe de ser único"
})

module.exports = mongoose.model('Usuario', usuario);