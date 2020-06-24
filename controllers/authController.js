const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


//////////////////////////////////////////
//Auntenticar al usuario e iniciar sesion
//////////////////////////////////////////
exports.iniciarSesionPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});


//////////////////////////////////////////
//Funcion para revisar si el usuario esta logueado o no
//////////////////////////////////////////
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }

    //Si no esta autenticado, redirigir al formulario de inicio de sesion
    return res.redirect('/iniciar-sesion');
};


//////////////////////////////////////////
//FUNCION PARA CERRAR SESION
//////////////////////////////////////////
exports.cerrarSesion = (req, res) => {
    console.log(req.session.passport.user.id);  //asi puede verse el usario que esta logueado actualmente.
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //redirecciona al cerrar sesion
    })
};


//////////////////////////////////////////
//GENERA UN TOKEN SI EL USUARIO ES VALIDO
//////////////////////////////////////////
exports.enviarToken = async (req, res) => {
    //verifica que el email existe
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    });

    //si no hay usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    //si el usuario si existe
    else {
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracionToken = Date.now() + 3600000;

        await usuario.save();

        //url de reseteo
        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

        //Enviar el correo
        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo: 'reestablecer-password'
        });

        //redirige a la pagina de inicio
        req.flash('correcto', 'Revisa tu bandeja de correo');
        res.redirect('/iniciar-sesion');
    }
};

//////////////////////////////////////////
//REVISA EL TOKEN EN LA RUTA Y RENDERIZA
// RESET PASSWORD PARA INGRESAR LA NUEVA CONTRASEÑA
//////////////////////////////////////////
exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne(
        {
            where: {
                token: req.params.token
            }
        }
    );

    //sino encuentra al usuario
    if (!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    //si lo encuentra lo envia al formulario
    res.render('resetPassword',{
        nombrePagina : 'Reestablecer Contraseña'
    })
};



//////////////////////////////////////////
//cambia el password olvidado por el nuevo ingresado
//////////////////////////////////////////
exports.actualizarPassword = async (req, res) => {
    //verifica el token valido y la fecha de expiracion
     const usuario = await Usuarios.findOne({
         where: {
             token: req.params.token,
             expiracionToken: {
                 [Op.gte] : Date.now()
             }
         }
     });

     //verifica si el usuario existe
    if (!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer')
    }

    //reinicia token y expiracion
    usuario.token = null;
    usuario.expiracionToken = null;

    //hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //se guarda
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion')







};













