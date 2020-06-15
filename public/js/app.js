import proyectos from './modulos/proyectos';
import tareas from "./modulos/tareas";
import {actualizarAvance} from "./funciones/avance";


//carga inicial de pagina
document.addEventListener('DOMContentLoaded', () => {
   actualizarAvance();
});

