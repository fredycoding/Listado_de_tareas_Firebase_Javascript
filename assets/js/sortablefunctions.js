import { db } from './firebase.js'
export const tareascreadasContainer = document.getElementById("tareas-creadas");
export const tareasprocesoContainer = document.getElementById("tareas-proceso");
export const tareasfinalizadasContainer = document.getElementById("tareas-finalizadas");

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
  