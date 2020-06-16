const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

/////////////////////////////////////////////
//MOSTRAR FORMULARIO CREAR USUARIO - GET
////////////////////////////////////////////
exports.crearUsuario = (req,res) => {
    res.render('crearUsuario', {
        nombrePagina : 'Crear cuenta en Uptask'
    })
};



////////////////////////////////////////////
//CREAR USUARIO POST
////////////////////////////////////////////
exports.crearUsuarioPost = async (req, res) => {
    //leer los datos
    const {email, password} = req.body;

    try{
        await Usuarios.create({email,password});
        //Crear URL de confirmar
        const confirmUrl = `http://${req.headers.host}/confirm/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email
        };

        //Enviar email de confirmacion
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Revisa tu bandeja de entrada para confirmar tu cuenta');
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




////////////////////////////////////////////
//FORMULARIO INICIAR SESION
////////////////////////////////////////////
exports.iniciarSesion = (req, res) =>{
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion',
        error
    })
};



////////////////////////////////////////////
//FORMULARIO REESTABLECER PASSWORD
////////////////////////////////////////////
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
};


////////////////////////////////////////////
//CONFIRMAR CUENTA POR EMAIL PARA CAMBIAR ESTADO
////////////////////////////////////////////
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email:req.params.email
        }
    });

    //si no existe el usuario para el correo a confirmar
    if (!usuario){
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
};
