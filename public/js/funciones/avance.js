import Swal from "sweetalert2";

export const actualizarAvance = () => {
    //seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if (tareas.length > 0){
        //seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');


        //calcular el avance
        console.log(tareasCompletas.length +  '/'+ tareas.length);
        let porcentaje = Math.round((tareasCompletas.length / tareas.length) * 100);

        if (porcentaje >= 0 && porcentaje <= 100){
            const barraPorcentaje = document.querySelector('#porcentaje');
            barraPorcentaje.style.width = porcentaje+'%';

            if (porcentaje === 100){
                //alerta
                Swal.fire(
                    'Has completado el proyecto',
                    'Se han terminado tus tareas',
                    'success'
                );
            }
        }
    }
    else{
        document.querySelector('#porcentaje').style.width = 0+'%';
    }
};
