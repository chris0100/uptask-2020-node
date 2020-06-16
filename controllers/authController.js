const passport = require('passport');

//Auntenticar al usuario e iniciar sesion
exports.iniciarSesionPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});


//Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
  //Si el usuario esta autenticado, adelante
  if (req.isAuthenticated()){
      return next();
  }

  //Si no esta autenticado, redirigir al formulario de inicio de sesion
  return res.redirect('/iniciar-sesion');
};



//FUNCION PARA CERRAR SESION
exports.cerrarSesion = (req,res) => {
    console.log(req.session.passport.user.email);  //asi puede verse el usario que esta logueado actualmente.
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //redirecciona al cerrar sesion
    })
};

