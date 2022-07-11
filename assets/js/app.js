const ListadeTareas = document.querySelector("#ListadeTareas");
const form = document.querySelector("#add-tarea-form");
const tareascreadasContainer = document.getElementById("tareas-creadas");
const tareasprocesoContainer = document.getElementById("tareas-proceso");
const tareasfinalizadasContainer = document.getElementById("tareas-finalizadas");


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

//tareascreadasContainer.innerHTML = "";

// Renderiza las tareasa de acuerdo a su estado
function renderTareas(doc) {

// Pasa las tareas con el estado de "creada" a este container
if (doc.data().estado == "creada"){
  tareascreadasContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5 titulocard">${doc.data().titulo}</h3>
  <p>${doc.data().tarea}</p>
<div>
  <button class="btn btn-danger btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}">
    🖉 Edit
  </button>
</div>
</div>`;

}

// Pasa las tareas con el estado de "proceso" a este container
if (doc.data().estado == "proceso"){
  tareasprocesoContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5 titulocard">${doc.data().titulo}</h3>
  <p>${doc.data().tarea}</p>
<div>
  <button class="btn btn-danger btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}">
    🖉 Edit
  </button>
</div>
</div>`;

}

// Pasa las tareas con el estado de "finalizada" a este container
if (doc.data().estado == "finalizada"){
  tareasfinalizadasContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5 titulocard">${doc.data().titulo}</h3>
  <p class="tareacard">${doc.data().tarea}</p>
<div>
  <button class="btn btn-danger btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-primary btn-edit" data-id="${doc.id}">
    🖉 Edit
  </button>
</div>
</div>`;
}  
}

//Eliminamos cuando presionamos el botón eliminar
function eliminar(iddoc){ 
  db.collection("tareasDb").doc(iddoc).delete();
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
  db.collection("tareasDb").add({ titulo: form.titulo.value, tarea: form.tarea.value, estado:"creada" });
  form.titulo.value = "";
  form.tarea.value = "";
});

// Realtime listener de Firebase
function getRealtimeData() {

  db.collection("tareasDb").orderBy("titulo").onSnapshot(snapshot => {

      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {          
          renderTareas(change.doc);
        } else if (change.type === "removed") {
          console.log("Elemento eliminado " + change.doc.id)
          const element = document.getElementById(change.doc.id); //Traigo el elemento eliminado
          element.remove(); // Elimina el div por el id          
        }
      });
    });
}
getRealtimeData();
