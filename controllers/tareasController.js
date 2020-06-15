const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

//AÑADE UNA NUEVA TAREA VINCULADA A UN PROYECTO
exports.agregarTarea = async (req, res, next) => {

    //obtener el proyecto por la url
    const proyecto = await Proyectos.findOne({
        where : {
            url : req.params.url
        }
    });

    //leer el valor del input
    const {tarea} = req.body;  //toma lo que tiene el input del request.

    //estado = 0 incompleto y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en la base de datos
    const resultado = await Tareas.create({
        tarea,
        estado,
        proyectoId
    });

    if (!resultado){
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
};




//CAMBIA EL ESTADO DE LA TAREA
exports.cambiarEstadoTarea = async (req, res) => {
    const idTarea = req.params.id;
    const tarea = await Tareas.findOne(
        {
            where: {
                id : idTarea
            }
        }
    );

    //cambia estado
    let estado = 0;
    if (tarea.estado === estado){
        estado = 1;
    }

    tarea.estado = estado;
    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Actualizado correctamente');
};



//ELIMINAR TAREA
exports.eliminarTarea = async (req,res) => {
    const {idTarea} = req.query;
    const resultado = await Tareas.destroy(
        {
            where:{
                id : idTarea
            }
        }
    );

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente')
};
