const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('Usuarios', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede estar vacio'
            }
        }
    }

}, {
    hooks: {   //corre un poco antes de insertarse en la base de datos
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Metodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

Usuarios.hasMany(Proyectos); //Un usuario tiene muchos proyectos

module.exports = Usuarios;
