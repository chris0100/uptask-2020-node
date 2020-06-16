const express = require('express');
const router = express.Router();

//importar express validator
const {body} = require('express-validator/check');

//importacion de controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authControler = require('../controllers/authController');


module.exports = function(){

    //GET PARA HOME
    router.get('/',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        proyectosController.proyectosHome);

    //GET PARA MOSTRAR FORMULARIO DE PROYECTO
    router.get('/nuevo-proyecto',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        proyectosController.formularioProyecto);

    //POST PARA ENVIAR DATOS DE FORMULARIO DE PROYECTO
    router.post('/nuevo-proyecto',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyectoPost);


    //se usa el comodin :url. LISTAR EL PROYECTO
    router.get('/proyectos/:url',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        proyectosController.proyectoPorUrl);


    //Muestra el formulario para editar el nombre del proyecto
    router.get('/proyecto/editar/:id',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        proyectosController.formularioEditarProyecto);

    //POST - envia los datos de nombre de proyecto editados
    router.post('/nuevo-proyecto/:id',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.editarProyectoPost);


    //Eliminar proyecto
    router.delete('/proyectos/:url',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        proyectosController.eliminarProyecto);


    //////////////////////////////////////////////////
    ///TAREAS
    //////////////////////////////////////////////////

    //POST para crear una tarea
    router.post('/proyectos/:url',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        tareasController.agregarTarea);

    //Actualizar estado de tarea
    router.patch('/tareas/:id',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        tareasController.cambiarEstadoTarea);

    //Eliminar tarea
    router.delete('/tareas/:id',
        authControler.usuarioAutenticado,  //revisa que este autenticado
        tareasController.eliminarTarea);





    /////////////////////////////////////////////////////
    //CUENTAS
    ////////////////////////////////////////////////////

    //crear cuenta GET
    router.get('/crear-cuenta', usuariosController.crearUsuario);

    //crear cuenta POST
    router.post('/crear-cuenta', usuariosController.crearUsuarioPost);


    //iniciar sesion GET
    router.get('/iniciar-sesion', usuariosController.iniciarSesion);

    //iniciar sesion POST
    router.post('/iniciar-sesion', authControler.iniciarSesionPost);

    //cerrar sesion GET
    router.get('/cerrar-sesion', authControler.cerrarSesion);


    //restablecer contraseña GET
    router.get('/reestablecer', usuariosController.formReestablecerPassword);






    return router;
};



















