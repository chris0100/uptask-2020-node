const Proyectos = require('../models/Proyectos');



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
        res.redirect('/');
    }

};





//PARA ABRIR EL PROYECTO CON UNA RUTA ESPECIFICA CREADA
exports.proyectoPorUrl = async (req, res, next) => {
    //se usan como dos promesas ya que usar dos await no es conveniente por las esperas
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url
        }});

    const[proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //si la consulta no devuelve nada al objeto, se muestra error para cargar pagina
    if (!proyecto) return next();

    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos
    })
};




//PARA EDITAR EL FORMULARIO
exports.formularioEditar = async (req, res) => {
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id
    }});

    const[proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

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
        res.redirect('/');
    }

};




