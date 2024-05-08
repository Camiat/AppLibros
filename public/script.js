
const formBusqueda = document.querySelector('#form-busqueda')

formBusqueda.onsubmit = (event) => {
    event.preventDefault(); // Evita que se pierdan los datos / Previene que la pagina se recargue cuando se envia el formulario.

    const busqueda = document.querySelector('#busqueda')
    const input = document.querySelector('#input')

    // fetch(`/buscar?tipo=${busqueda.value}&busqueda=${input.value}`).then(res => {
    // }).catch(err => console.log(err));

    window.location.href = `/buscar?tipo=${busqueda.value}&busqueda=${input.value}`;
}


const botones = document.querySelectorAll('.borrar-libro')

for (let boton of botones) {
    boton.onclick = () => {
        // alert(boton.id);   
        fetch(`/borrar?id=${boton.id}`, {
            method: 'DELETE'
        })
            .then(res => {
                location.href = '/';
            })
    }
}



function agregarFavorito(id, titulo, imagen, autores, editorial, descripcion) {
    fetch(`/agregar-favorito`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, titulo, imagen, autores: autores.split(','), editorial, descripcion })
    }).then(res => {
        location.reload();
    });
}


// Funcion quitar fav
// const quitarFavoritos = document.querySelector('#quitar-favorito')
    
function quitarFavoritos(id)  {
    fetch(`/quitar-favorito?id=${id}`, {
        method: 'DELETE'
    }).then(res => {
        location.reload();
    });
}

const forms = document.querySelectorAll('.form-resena');

for (let form of forms) {
    form.onsubmit = (e) => {
       e.preventDefault();
       const calificacion = form.querySelector('#calificacion');
       const comentario = form.querySelector('#comentario');
    
       fetch(`/agregar-resena?id=${form.id}&comentario=${comentario.value}&calificacion=${calificacion.value}`,{method: 'POST'})
           .then(() => {
               location.reload(); 
           });
    }
}

