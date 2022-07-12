const ListadeTareas = document.querySelector("#ListadeTareas");
const form = document.querySelector("#add-tarea-form");
const tareascreadasContainer = document.getElementById("tareas-creadas");
const tareasprocesoContainer = document.getElementById("tareas-proceso");
const tareasfinalizadasContainer = document.getElementById("tareas-finalizadas");
const botonUpdateModal = document.getElementById("botonupdatemodal");
const botoncreartarea = document.getElementById("btn-crear-tarea");


/* Funciones de Drag and Drop */
// Inicia el Drag
function onDragStart(event) {   
  event.dataTransfer.setData('text/plain', event.target.id);
  //event.currentTarget.style.backgroundColor = 'yellow';
}


function onDragOver(event) {
  event.preventDefault();
}

//Inicia el Drop
function onDrop(event) {
  const id = event.dataTransfer.getData('text'); // id del elemento que se transfiere                      
  const draggableElement = document.getElementById(id); // Se obtiene el html del elemento que se transfiere 
  const dropzone = event.target; // Div donde se transfiere el elemento    
  update(id, dropzone.id)
           
  dropzone.appendChild(draggableElement); // Se suma el elemento a la zona de transferencia
  event.dataTransfer.clearData();

}



// Renderiza las tareasa de acuerdo a su estado
function renderTareas(doc) {

// Pasa las tareas con el estado de "creada" a este container
if (doc.data().estado == "creada"){
  tareascreadasContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5 titulocard" id="titulocard-${doc.id}">${doc.data().titulo}</h3>
  <p class="tareacard" id="tareacard-${doc.id}">${doc.data().tarea}</p>
<div>
  <button class="btn btn-danger btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}" onclick="readone('${doc.id}')" data-bs-toggle="modal"
  data-bs-target="#updateModal">
    🖉 Edit
  </button>
</div>
</div>`;

}

// Pasa las tareas con el estado de "proceso" a este container
if (doc.data().estado == "proceso"){
  tareasprocesoContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5 titulocard" id="titulocard-${doc.id}">${doc.data().titulo}</h3>
  <p class="tareacard" id="tareacard-${doc.id}">${doc.data().tarea}</p>
<div>
  <button class="btn btn-danger btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}" onclick="readone('${doc.id}')" data-bs-toggle="modal"
  data-bs-target="#updateModal">
    🖉 Edit
  </button>
</div>
</div>`;

}

// Pasa las tareas con el estado de "finalizada" a este container
if (doc.data().estado == "finalizada"){
  tareasfinalizadasContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5 titulocard" id="titulocard-${doc.id}">${doc.data().titulo}</h3>
  <p class="tareacard" id="tareacard-${doc.id}">${doc.data().tarea}</p>
<div>
  <button class="btn btn-danger btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}" onclick="readone('${doc.id}')" data-bs-toggle="modal"
  data-bs-target="#updateModal">
    🖉 Edit
  </button>
</div>
</div>`;
}  
}

//Eliminamos cuando presionamos el botón eliminar, enviamos un sweet alert
//para confirmar el cambio
function eliminar(iddoc){ 
  Swal.fire({
    title: 'Esta seguro que desea eliminar esta tarea?',
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: `No eliminar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      db.collection("tareasDb").doc(iddoc).delete();
      Swal.fire('Tarea eliminada!', '', 'success')
    } 
  })  
} // Fin eliminar

// Actualizamos la información cuando cambiamos de zona el div
function update(iddoc, divestado){
  //alert(iddoc + " " + divestado)
  if (divestado == "tareas-proceso"){
    db.collection("tareasDb").doc(iddoc).update({estado: "proceso"});
  }
  if (divestado == "tareas-finalizadas"){
    db.collection("tareasDb").doc(iddoc).update({estado: "finalizada"});
  }  
  if (divestado == "tareas-creadas"){
    db.collection("tareasDb").doc(iddoc).update({estado: "creada"});
  }  

} // Fin update



// Cuando creamos un nuevo registro;
form.addEventListener("submit", e => {
  e.preventDefault();

  if(form.titulo.value == "" || form.tarea.value == ""){
    alert("Error: Los campos no deben estar vacios")

  }else{
    db.collection("tareasDb").add({ titulo: form.titulo.value, tarea: form.tarea.value, estado:"creada" });
    form.titulo.value = "";
    form.tarea.value = "";
    $('#exampleModal').modal('hide');
  } 
});

// Lee un documento por id y se activa cuendo presionó el botón Edit
function readone(iddoc){
  var docRef = db.collection("tareasDb").doc(iddoc);

  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          document.getElementById("tituloupdate").value = doc.data().titulo
          document.getElementById("tareaupdate").value = doc.data().tarea
          document.getElementById("campo-id-modal").value = iddoc
      } else {
          // doc.data() will be undefined in this case
          alert("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

//BOTÓN UPDATE - Modal
botonUpdateModal.addEventListener('click', ()=>{  
    let iddoc = document.getElementById("campo-id-modal")
    let tareafinal = document.getElementById("tareaupdate")
    let titulofinal = document.getElementById("tituloupdate")
    db.collection("tareasDb").doc(iddoc.value).update({titulo: titulofinal.value, tarea: tareafinal.value});
   
   $('#updateModal').modal('hide');  // Escondo el modal del update

    //Limpiamos campos del form del modal
    iddoc.value = ""
    tareafinal.value = ""
    titulofinal.value = ""

})


// Realtime listener de Firebase
async function getRealtimeData() {

  try{
    const datos = await db.collection("tareasDb").orderBy("titulo").onSnapshot(snapshot => {

      let changes = snapshot.docChanges();
      changes.forEach(change => {
        //console.log("Nuevos cambios: " + change.type)
        if (change.type === "added") { // Cuando hay nuevos registros         
          renderTareas(change.doc);
        } else if (change.type === "removed") { // Cuando hay eliminación
          //console.log("Elemento eliminado " + change.doc.id)
          const element = document.getElementById(change.doc.id); //Traigo el elemento eliminado
          element.remove(); // Elimina el div por el id     
               
        } else if(change.type === "modified"){ // Cuando hay cambios de actualización
          const element = document.getElementById(change.doc.id); //Traigo el elemento actualizado
          element.remove(); // Elimina el div por el id     
          renderTareas(change.doc);
       
        }
      });
    });

  } catch(err){
    alert("Error: " + err)
  }

 
}

getRealtimeData();


