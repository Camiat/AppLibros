const formEditar = document.querySelector('.form-editar');

formEditar.onsubmit = (e) => {
    e.preventDefault();
    const titulo = document.querySelector('#titulo');
    const editorial = document.querySelector('#editorial');
    const descripcion =document.querySelector ('#descripcion');

    fetch(`/editar?titulo=${titulo.value}&editorial=${editorial.value}&descripcion=${descripcion.value}&id=${formEditar.id}`, {method:'PUT'})
    .then(() => {
        window.location.href = '/'
    });
}
