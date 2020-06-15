import Swal from "sweetalert2";

const tareas = document.querySelector('.listado-pendientes');
import Axios from "axios";
import {actualizarAvance} from "../funciones/avance";



if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tareaId;

            //REQUEST HACIA /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            Axios.patch(url, {idTarea})
                .then(function (respuesta) {

                    console.log(respuesta);
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        if (e.target.classList.contains('fa-trash')) {
            const tareaHtml = e.target.parentElement.parentElement,
                idTarea = tareaHtml.dataset.tareaId;

            Swal.fire({
                title: 'Esta seguro?',
                text: "Esta accion no podra ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar!'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    //enviar el delete por medio de axios
                    Axios.delete(url, {params: {idTarea}})
                        .then(function (respuesta) {
                            if (respuesta.status === 200){
                                //eliminar el nodo
                                tareaHtml.parentElement.removeChild(tareaHtml);

                                //alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                );

                                actualizarAvance();
                            }
                        })

                }
            })
        }
    });
}

export default tareas
