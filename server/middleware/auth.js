const jwt = require('jsonwebtoken');
//
// Verificar token

let verificaToken = (req, res, next) => {

    // leer token del header
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        // decoded es el payload que contiene el objeto usuario
        req.usuario = decoded.usuario;

        next();
    });


};


let verificaAdmin = (req, res, next) => {

    let usuario = req.usuario;
    let isAdmin = usuario.role === 'ADMIN_ROLE';

    if (!isAdmin) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        });
    }

    next();

};


module.exports = {
    verificaToken,
    verificaAdmin
}