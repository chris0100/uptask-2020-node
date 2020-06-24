const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash'); //para el mensaje a enviar
const session = require('express-session');  //expiracion de la sesion
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//IMPORTAR LAS VARIABLES PARA DEPLOY
require('dotenv').config({path: 'variables.env'});


//incluye helpers
const helpers = require('./helpers');

//Crear la conexion a la base de datos
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//sincronizar la bd para insertar datos
db.sync()
    .then( () => console.log('conectado a la BD'))
    .catch(error => console.log(error));



////////////////////////////////////////////////////
// crear una aplicacion de express
////////////////////////////////////////////////////
const app = express();


//Cargar los archivos estaticos css - img de la carpeta public
app.use(express.static('public'));

//habilitar pug para plantillas
app.set('view engine', 'pug');

//Habilitar Body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));



//añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash Messages
app.use(flash());

app.use(cookieParser());

// sesiones nos permite navegar entre distintas paginas sin necesidad de autenticas
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//pasar varDom al middleware para que con next se ejecute el siguiente.
app.use((req, res, next) => {
    res.locals.usuario = {...req.user} || null;
    res.locals.year = 2020;
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});

//uso de rutas desde la raiz
app.use('/', routes());

//Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

//prepara el puerto de conexion
app.listen(port,() => {
    console.log('el servidor esta funcionando');
});

//llamada del correo
require('./handlers/email');






