const express = require('express');
const Usuario = require('../models/usuario');

const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaAdmin } = require('../middleware/auth');

app.get('/usuario/:id', verificaToken, (req, res) => {
    res.json('get usuario LOCAL');
});



app.get('/usuario', verificaToken, (req, res) => {
    let conditions = { estado: true }
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find(conditions, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // para obtener el total de usuarios
            // de condicion del 'count' debe ser la misma que la del 'find'
            Usuario.count(conditions, (err, total) => {
                res.json({
                    ok: true,
                    usuarios,
                    total
                });
            })


        })
});

app.post('/usuario', [verificaToken, verificaAdmin], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id;
    // la función pick devuelve un objeto con los campos que se le indiquen en el array
    let body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id;

    /*
    // borrado físico de la BBDD
    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: {}
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    */

    // borrado lógico de la BBDD
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});


module.exports = app;