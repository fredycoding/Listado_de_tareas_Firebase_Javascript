import {tareascreadasContainer, tareasprocesoContainer, tareasfinalizadasContainer} from './sortablefunctions.js'

//Función que renderiza los elementos con la base de datos de firebase
export const renderTareas = (doc) => {
    const fechaformat = moment(doc.data().fecha).format('lll'); //https://momentjs.com/
  
    let tarjetaHtml = `<div id="${doc.id}" class="card card-body mt-2 border-primary">
  <div class="row">
    <div class="col">
    <h3 class="h5 titulocard" id="titulocard-${doc.id}">${doc.data().titulo}</h3>
    </div>
    <div class="col div-boton-compartir">
    <button class="btn boton-compartir float-end" data-bs-toggle="modal"
    data-bs-target="#trasladoMobileModal" data-id="${doc.id}" name="traslado"><i class="icofont-external-link"></i></button>
    </div>
  </div> 
  <p class="tareacard" id="tareacard-${doc.id}">${doc.data().tarea}</p> 
  <span class"fecha float-end">${fechaformat}</span> 
  <div>
  <button class="btn btn-danger btn-delete" data-id="${doc.id}" name="delete">
  <i class="icofont-trash"></i> Delete</button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}" data-bs-toggle="modal" name="edit"
  data-bs-target="#updateModal">
  <i class="icofont-ui-edit"></i> Edit
  </button>
  </div>
  </div>`;
  
    if (doc.data().estado == "creada") {
      tareascreadasContainer.innerHTML += tarjetaHtml
    }
  
    if (doc.data().estado == "proceso") {
      tareasprocesoContainer.innerHTML += tarjetaHtml
    }
  
    if (doc.data().estado == "finalizada") {
      tareasfinalizadasContainer.innerHTML += tarjetaHtml
    }
  }