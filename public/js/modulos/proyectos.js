import Swal from "sweetalert2";
import Axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');


if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        console.log(e.target.dataset);
        const urlProyecto = e.target.dataset.proyectoUrlBase;


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

                //enviar peticion a axios de eliminar proyecto
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                Axios.delete(url, {params: {urlProyecto}})
                    .then(function (respuesta) {

                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                        );
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        })
                    })
            }
        })
    });

}

export default btnEliminar;
