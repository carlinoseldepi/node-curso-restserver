require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

//cloud => mongodb+srv://admin:admin.pass@cluster0.xvp2d.mongodb.net/cafe
//local => mongodb://localhost:27017/cafe
mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, userCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Conectado a Mongo');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuachando en el puerto 3000`);
});