const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


//PAGINA DE INICIO
exports.proyectosHome = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};



//PAGINA PARA CREAR NUEVO PROYECTO
exports.formularioProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};



//ENVIA FORMULARIO PARA CREAR NUEVO PROYECTO - POST
exports.nuevoProyectoPost = async (req, res) => {

    const proyectos = await Proyectos.findAll();

    //validar que se tengan datos en el input
    const {nombre} = req.body;
    console.log(req.body);
    console.log('impresion del nombre crear' + req.body.nombre);

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'})
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }

    // Si no hay errores
    else {
        await Proyectos.create({nombre});
        console.log('realiza CREAR');
        res.redirect('/');
    }
};





//PARA ABRIR EL PROYECTO CON UNA RUTA ESPECIFICA CREADA
exports.proyectoPorUrl = async (req, res, next) => {

    //se usan como dos promesas ya que usar dos await no es conveniente por las esperas
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });


    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        include: [
            { model: Proyectos }
        ]
    });



    //si la consulta no devuelve nada al objeto, se muestra error para cargar pagina
    if (!proyecto) return next();

    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
};





//PARA EDITAR EL FORMULARIO
exports.formularioEditar = async (req, res) => {
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //RENDER A LA VISTA
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
};



//ENVIA FORMULARIO PARA CREAR NUEVO PROYECTO - POST
exports.editarProyectoPost = async (req, res) => {

    const proyectos = await Proyectos.findAll();

    //validar que se tengan datos en el input
    const {nombre} = req.body;
    console.log(req.body);
    console.log('impresion del nombre' + req.body.nombre);

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'})
    }

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }

    // Si no hay errores
    else {
        await Proyectos.update(
            {nombre: nombre},
            {where: {id: req.params.id}}
        );
        console.log('realizar update');
        res.redirect('/');
    }

};



//ELIMINAR EL PROYECTO
exports.eliminarProyecto = async (req, res, next) => {
    const {urlProyecto} = req.query;
    console.log('Esta es la url: ' + urlProyecto);

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });

    //si en ese momento llega a ocurrir un error de conexion
    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
};




