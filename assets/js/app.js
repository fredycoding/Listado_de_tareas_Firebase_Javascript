import { db } from './firebase.js'
const ListadeTareas = document.querySelector("#ListadeTareas");
const form = document.querySelector("#add-tarea-form");
const tareascreadasContainer = document.getElementById("tareas-creadas");
const tareasprocesoContainer = document.getElementById("tareas-proceso");
const tareasfinalizadasContainer = document.getElementById("tareas-finalizadas");
const botonUpdateModal = document.getElementById("botonupdatemodal");
const botonUpdateTraslado = document.getElementById("botonUpdateTraslado")
const contenedorPrincipal = document.querySelectorAll(".tareas-container")

/**** FUNCIÓNES del DRAG o arrastre ***/
// https://github.com/SortableJS/Sortable

new Sortable(tareascreadasContainer, {
  group: 'tareas',
  animation: 150,
  onStart: (evento) => {
    console.log("Id: " + evento.item.id)
    console.log("Desde: " + evento.from.id)
  },
  onEnd: (evento) => {
    if (evento.from.id != evento.to.id) updateDbFirebase(evento.item.id, evento.to.id)
  }
});

new Sortable(tareasprocesoContainer, {
  group: 'tareas',
  animation: 150,
  onEnd: (evento) => {
    if (evento.from.id != evento.to.id) updateDbFirebase(evento.item.id, evento.to.id)
  }
});

new Sortable(tareasfinalizadasContainer, {
  group: 'tareas',
  animation: 150,
  onEnd: (evento) => {
    if (evento.from.id != evento.to.id) updateDbFirebase(evento.item.id, evento.to.id)
  }
});

const enviarIdTraslado = (idTraslado) => document.getElementById('campo-id-traslado').value = idTraslado

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

//Función para detectar clicks en el DOM y saber que objeto es
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


const updateDbFirebase = (iddoc, divestado) => {
  if (divestado == "tareas-proceso") {
    db.collection("tareasDb").doc(iddoc).update({ estado: "proceso" });
  }
  if (divestado == "tareas-finalizadas") {
    db.collection("tareasDb").doc(iddoc).update({ estado: "finalizada" });
  }
  if (divestado == "tareas-creadas") {
    db.collection("tareasDb").doc(iddoc).update({ estado: "creada" });
  }
  console.log("!Tarea actualizada")
}


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