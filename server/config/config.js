//
// Puerto
//
process.env.PORT = process.env.PORT || 3000;

//
// Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//
// Base de datos
//
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //mongodb+srv://admin:admin.pass@cluster0.xvp2d.mongodb.net/cafe
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;