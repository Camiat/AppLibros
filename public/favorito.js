function quitar (id) {
    fetch(`/quitar-favorito?id=${id}`,{method:'DELETE'})
        .then (res => {
            location.reload();
        })
}
