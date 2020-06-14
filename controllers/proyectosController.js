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
exports.nuevoProyecto = async (req, res) => {

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
        const proyecto = await Proyectos.create({nombre});
        res.redirect('/');
    }

};


//PARA ABRIR EL PROYECTO CON UNA RUTA ESPECIFICA CREADA
exports.proyectoPorUrl = async (req, res, next) => {
    const proyectos = await Proyectos.findAll();
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

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
    const proyectos = await Proyectos.findAll();

    //RENDER A LA VISTA
    res.render('editarProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos
    });
};




