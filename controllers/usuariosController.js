const Usuarios = require('../models/Usuarios');


//MOSTRAR FORMULARIO CREAR USUARIO - GET
exports.crearUsuario = (req,res) => {
    res.render('crearUsuario', {
        nombrePagina : 'Crear cuenta en Uptask'
    })
};


//CREAR USUARIO POST
exports.crearUsuarioPost = async (req, res) => {
    //leer los datos
    const {email, password} = req.body;

    try{
        await Usuarios.create({email,password});
        res.redirect('/iniciar-sesion')
    }
    catch (error) {
        req.flash('error',error.errors.map(error => error.message));  //se generan los errores para flash message

        res.render('crearUsuario',{
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password,
        })
    }
};



//FORMULARIO INICIAR SESION
exports.iniciarSesion = (req, res) =>{
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion',
        error
    })
};




