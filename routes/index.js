const express = require('express');
const router = express.Router();

//importar express validator
const {body} = require('express-validator/check');

//importacion de controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');


module.exports = function(){

    //GET PARA HOME
    router.get('/', proyectosController.proyectosHome);

    //GET PARA MOSTRAR FORMULARIO DE PROYECTO
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);

    //POST PARA ENVIAR DATOS DE FORMULARIO DE PROYECTO
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyectoPost);


    //se usa el comodin :url. LISTAR EL PROYECTO
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);


    //Muestra el formulario para editar el nombre del proyecto
    router.get('/proyecto/editar/:id', proyectosController.formularioEditarProyecto);

    //POST - envia los datos de nombre de proyecto editados
    router.post('/nuevo-proyecto/:id',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.editarProyectoPost);


    //Eliminar proyecto
    router.delete('/proyectos/:url', proyectosController.eliminarProyecto);


    //////////////////////////////////////////////////
    ///TAREAS
    //////////////////////////////////////////////////

    //POST para crear una tarea
    router.post('/proyectos/:url', tareasController.agregarTarea);

    //Actualizar estado de tarea
    router.patch('/tareas/:id', tareasController.cambiarEstadoTarea);

    //Eliminar tarea
    router.delete('/tareas/:id', tareasController.eliminarTarea);

    return router;
};



















