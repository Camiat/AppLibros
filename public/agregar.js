const formAgregar = document.querySelector('#form-agregar');

formAgregar.onsubmit = ()  => {
  const titulo = document.querySelector('#titulo')
  const imagen = document.querySelector('#imagen')
  const autorUno = document.querySelector('#autor-uno')
  const autorDos = document.querySelector('#autor-dos')
  const autorTres = document.querySelector('#autor-tres')
  const editorial = document.querySelector('#editorial')
  const descripcion = document.querySelector('#descripcion')

  // GET, POST, PUT, DELETE
  fetch(`/agregar?titulo=${titulo.value}&imagen=${imagen.value}&autorUno=${autorUno.value}&autorDos=${autorDos.value}&autorTres=${autorTres.value}&editorial=${editorial.value}&descripcion=${descripcion.value}`,{method:'POST'})
    .then(() => {
      window.location.href = '/'
    });

}
