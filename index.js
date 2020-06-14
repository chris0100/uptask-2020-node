const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

//incluye helpers
const helpers = require('./helpers');

//Crear la conexion a la base de datos
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');

//sincronizar la bd para insertar datos
db.sync()
    .then( () => console.log('conectado a la BD'))
    .catch(error => console.log(error));

// crear una aplicacion de express
const app = express();

//Donde cargar los archivos estaticos css - imgs
app.use(express.static(__dirname + '/public'));

//Habilitar Body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//habilitar pug
app.set('view engine', 'pug');

//añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//pasar varDom al middleware para que con next se ejecute el siguiente.
app.use((req, res, next) => {
    res.locals.year = 2020;
    res.locals.vardump = helpers.vardump;
    next();
});

//uso de rutas desde la raiz
app.use('/', routes());

//prepara el puerto de conexion
app.listen(3000);





