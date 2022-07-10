const ListadeTareas = document.querySelector("#ListadeTareas");
const form = document.querySelector("#add-tarea-form");
const tareascreadasContainer = document.getElementById("tareas-creadas");

/* Funciones de Drag and Drop */
// Inicia el Drag
function onDragStart(event) {   
  event.dataTransfer.setData('text/plain', event.target.id);
  event.currentTarget.style.backgroundColor = 'yellow';
}
function onDragOver(event) {
  event.preventDefault();
}

//Inicia el Drop
function onDrop(event) {
  const id = event.dataTransfer.getData('text'); // id del elemento que se transfiere                      
  const draggableElement = document.getElementById(id); // Se obtiene el html del elemento que se transfiere
  console.log(draggableElement)
  const dropzone = event.target; // Div donde se transfiere el elemento                
  dropzone.appendChild(draggableElement); // Se suma el elemento a la zona de transferencia
  event.dataTransfer.clearData();

}

tareascreadasContainer.innerHTML = "";

function renderTareas(doc) {
  


  tareascreadasContainer.innerHTML += `<div id="${doc.id}" class="card card-body mt-2 border-primary" draggable="true" ondragstart="onDragStart(event);">
  <h3 class="h5">${doc.data().titulo}</h3>
  <p>${doc.data().tarea}</p>
<div>
  <button class="btn btn-primary btn-delete" id="botondelete-${doc.id}" onclick="eliminar('${doc.id}')">
    🗑 Delete
  </button>
  <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
    🖉 Edit
  </button>
</div>
</div>`;



 /*
  let botoneliminar = document.createElement("button");
  botoneliminar.textContent = "X";
  tareascreadasContainer.appendChild(botoneliminar)
//  li.appendChild(botoneliminar);

  //ListadeTareas.appendChild(

  // Deleting Data
  botoneliminar.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("id");
    db.collection("tareasDb").doc(id).delete();
  });
  */
  
}

function eliminar(idboton){ 
  db.collection("tareasDb").doc(idboton).delete();
}

// Getting Data
function getData() {
  document.querySelector("#loader").style.display = "block";

  db.collection("tareasDb").orderBy("titulo").get().then(snapshot => {
      console.log(snapshot.docs);
      document.querySelector("#loader").style.display = "none";
      snapshot.docs.forEach(doc => renderTareas(doc));
    });
}

// getData();

form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("tareasDb").add({ titulo: form.titulo.value, tarea: form.tarea.value });
  form.titulo.value = "";
  form.tarea.value = "";
});

// Realtime listener
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
