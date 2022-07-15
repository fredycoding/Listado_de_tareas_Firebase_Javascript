# Listado de Tareas con Firebase y Javascript To Do

```
Para correr el proyecto solo abra index.html en live server
```
#### Uso de la librería SortableJS
Se hace uso para el evento de Drag and Drop de las tarjetas de tareas.
Mas info de la librería en : https://sortablejs.github.io/Sortable/
##### CDN 
```
<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
```
Ejemplo:
```
const tareascreadasContainer = document.getElementById("tareas-creadas");
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
```


#### Escritorio
![image](https://user-images.githubusercontent.com/16197568/178822695-eb3988ce-08cb-4a0c-9193-d6eb6d7bc78d.png)

#### Mobile
![image](https://user-images.githubusercontent.com/16197568/178824065-92df1a5e-b85a-498c-b209-3d1897afa539.png)

## Author

<blockquote>
Fredy A. Diaz B.

</blockquote>

========Thank You !!!=========
