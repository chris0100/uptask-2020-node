const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tarea: Sequelize.STRING(100),
    estado : Sequelize.INTEGER
});
Tareas.belongsTo(Proyectos); //una tarea pertenece a un proyecto
//proyecto has many (tareas)  -> un proyecto tiene muchas tareas


module.exports = Tareas;
