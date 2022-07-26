import { db } from './firebase.js'
import {tareascreadasContainer, tareasprocesoContainer, tareasfinalizadasContainer} from './sortablefunctions.js'

const form = document.querySelector("#add-tarea-form");
const botonUpdateModal = document.getElementById("botonupdatemodal");
const botonUpdateTraslado = document.getElementById("botonUpdateTraslado")

//Función para actualizar el campo oculto del html para el traslado
const enviarIdTraslado = (idTraslado) => document.getElementById('campo-id-traslado').value = idTraslado

//Función para actualizar los campos
function readDBbyId(iddoc) {
  let docRef = db.collection("tareasDb").doc(iddoc);
  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      document.getElementById("tituloupdate").value = doc.data().titulo
      document.getElementById("tareaupdate").value = doc.data().tarea
      document.getElementById("campo-id-modal").value = iddoc
    } else {
      alert("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

//Función de confirmación y eliminación de la tarea
const deleteTask = (iddoc) => {
  Swal.fire({
    title: 'Esta seguro que desea eliminar esta tarea?',
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: `No eliminar`,
  }).then((result) => {   
    if (result.isConfirmed) {
      db.collection("tareasDb").doc(iddoc).delete();
      Swal.fire('Tarea eliminada!', '', 'success')
    }
  })
}

//Función para detectar clicks en el DOM y saber que objeto es, con el fin de
//Eliminar, Actualizar o hacer un traldalo de container por el ID
document.addEventListener('click', function (e) {
  if (e.target.name == "edit" || e.target.name == "delete" || e.target.name == "traslado") {
    let id = e.target.getAttribute("data-id")
    if(e.target.name == "edit"){
      readDBbyId(id)
    }
    if(e.target.name == "delete"){
      deleteTask(id)
    }
    if(e.target.name == "traslado"){
      console.log("SIII" +id)
      enviarIdTraslado(id)
    }
  }
});

//Botón del traslado en móviles
botonUpdateTraslado.addEventListener('click', () => {
  const valorIdTraslado = document.getElementById('campo-id-traslado').value
  const valorSelect = document.getElementById('selectTraslado').value
  let valorSelectFinal = ""
  if (valorSelect == "PORHACER") valorSelectFinal = "creada"
  if (valorSelect == "ENPROCESO") valorSelectFinal = "proceso"
  if (valorSelect == "FINALIZADA") valorSelectFinal = "finalizada"
  db.collection("tareasDb").doc(valorIdTraslado).update({ estado: valorSelectFinal });
  $('#trasladoMobileModal').modal('hide');
})

//Cuando creamos la tarea
form.addEventListener("submit", e => {
  e.preventDefault();
  const fecha = new Date().toUTCString()
  if (form.titulo.value == "" || form.tarea.value == "") {
    alert("Error: Los campos no deben estar vacios")
  } else {
    db.collection("tareasDb").add({ titulo: form.titulo.value, tarea: form.tarea.value, estado: "creada", fecha: fecha });
    form.titulo.value = "";
    form.tarea.value = "";
    $('#exampleModal').modal('hide');
  }
});

//Botón que activa la actualización de la tarea
botonUpdateModal.addEventListener('click', () => {
  let iddoc = document.getElementById("campo-id-modal")
  let tareafinal = document.getElementById("tareaupdate")
  let titulofinal = document.getElementById("tituloupdate")
  if (titulofinal.value == "" || tareafinal.value == "") {
    alert("NO PUEDE DEJAR LOS CAMPOS VACIOS")
  } else {
    db.collection("tareasDb").doc(iddoc.value).update({ titulo: titulofinal.value, tarea: tareafinal.value });
    $('#updateModal').modal('hide');
    iddoc.value = ""
    tareafinal.value = ""
    titulofinal.value = ""
  }
})

//Función que renderiza los elementos con la base de datos de firebase
const renderTareas = (doc) => {
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

//Función que obtiene los datos en tiempo real.
const getRealtimeData = async () => {
  try {
    const datos = await db.collection("tareasDb").orderBy("titulo").onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          renderTareas(change.doc);
        } else if (change.type === "removed") {
          const element = document.getElementById(change.doc.id);
          element.remove();         
        } else if (change.type === "modified") {
          const element = document.getElementById(change.doc.id);
          element.remove();
          renderTareas(change.doc);
        }
      });
    });
  } catch (err) {
    alert("Error: " + err)
  }
}

getRealtimeData();