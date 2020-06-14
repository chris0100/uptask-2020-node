const express = require('express');
const router = express.Router();

//importar express validator
const {body} = require('express-validator/check');

//importacion de controlador
const proyectosController = require('../controllers/proyectosController');


module.exports = function(){

    //GET PARA HOME
    router.get('/', proyectosController.proyectosHome);

    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);

    //se usa el comodin :url. LISTAR EL PROYECTO
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id', proyectosController.formularioEditar);

    //POST
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);




    return router;
};


