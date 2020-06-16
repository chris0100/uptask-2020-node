const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


//PAGINA DE INICIO
exports.proyectosHome = async (req, res) => {
    //console.log(res.locals.usuario);

    const UsuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ //muestra todos los proyectos del id seleccionado
        where: {
            UsuarioId
        }
    });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};







//PAGINA PARA CREAR NUEVO PROYECTO
exports.formularioProyecto = async (req, res) => {
    const UsuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ //muestra todos los proyectos del id seleccionado
        where: {
            UsuarioId
        }
    });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};








//ENVIA FORMULARIO PARA CREAR NUEVO PROYECTO - POST
exports.nuevoProyectoPost = async (req, res) => {
    const UsuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ //muestra todos los proyectos del id seleccionado
        where: {
            UsuarioId
        }
    });

    //validar que se tengan datos en el input
    const nombre = req.body.nombre;   //o tambien const{nombre} = req.body

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
        const UsuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, UsuarioId}); //guarda en la base de datos
        console.log('realiza CREAR EN LA BD');
        res.redirect('/');
    }
};







//PARA ABRIR EL PROYECTO CON UNA RUTA URL ASIGNADA EN SU CREACION
exports.proyectoPorUrl = async (req, res, next) => {

    //se usan como dos promesas ya que usar dos await no es conveniente por las esperas
    const UsuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ //muestra todos los proyectos del id seleccionado
        where: {
            UsuarioId
        }
    });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url  //revisa en el request, el parametro de url
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            {model: Proyectos}
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







//PARA EDITAR EL PROYECTO A TRAVES DE UN FORMULARIO
exports.formularioEditarProyecto = async (req, res) => {
    const UsuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ //muestra todos los proyectos del id seleccionado
        where: {
            UsuarioId
        }
    });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id //toma la ruta enviada desde el link para editar
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

    const UsuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ //muestra todos los proyectos del id seleccionado
        where: {
            UsuarioId
        }
    });

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
            {
                where: {
                    id : req.params.id  //toma el parametro id de la ruta desde el form para hacer submit
                }
            }
        );
        console.log('realizar update');
        res.redirect('/');
    }
};






//ELIMINAR EL PROYECTO
exports.eliminarProyecto = async (req, res, next) => {
    const {urlProyecto} = req.query; //por req.params.url tambien generaba el link necesario

    console.log(req.query);
    console.log('Esta es la url: ' + urlProyecto);
    console.log('este es por params: ' + req.params.url);

    const resultado = await Proyectos.destroy({   //eliminar proyecto de la base de datos
        where: {
            url: urlProyecto
        }
    });

    //si en ese momento llega a ocurrir un error de conexion
    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
};




