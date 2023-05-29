const formulario = document.querySelector("#formulario");
const listaTarea = document.querySelector("#lista-tareas");
const template = document.querySelector("#template").content;
const fragment = document.createDocumentFragment();
const input = document.querySelector("#input");
let tareas = {};

//"DOMContentLoaded" sirve para que los elementos agregados se muestren al inicio
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("tareas")) {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }
  pintarTareas();
});

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  setTarea(event);
});

listaTarea.addEventListener("click", (event) => {
  btnAccion(event);
});

const setTarea = () => {
  const tarea = {
    id: Date.now(),
    texto: input.value,
    estado: false,
  };

  tareas[tarea.id] = tarea;
  formulario.reset();
  input.focus();

  pintarTareas();
};

const pintarTareas = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  if (Object.values(tareas).length === 0) {
    listaTarea.innerHTML = `
    <div class="alert alert-danger text-center">No hay tareas Pendientes!!👍</div>`;
    return;
  }

  listaTarea.innerHTML = "";
  //Recordatorio que sirve para recorrer objetos
  Object.values(tareas).forEach((tarea) => {
    const clone = template.cloneNode(true);
    clone.querySelector("p").textContent = tarea.texto;
    //sirve para enviar id a los botones de la imagen
    if (tarea.estado) {
      clone
        .querySelector(".alert")
        .classList.replace("alert-warning", "alert-primary");
      clone
        .querySelectorAll(".fa-solid")[0]
        .classList.replace("fa-circle-check", "fa-rotate-left");
      clone.querySelector("p").style.textDecoration = "line-through";
    }
    clone.querySelectorAll(".fa-solid")[0].dataset.id = tarea.id;
    clone.querySelectorAll(".fa-solid")[1].dataset.id = tarea.id;
    fragment.appendChild(clone);
  });
  listaTarea.appendChild(fragment);
};

const btnAccion = (event) => {
  if (event.target.classList.contains("fa-circle-check")) {
    tareas[event.target.dataset.id].estado = true;
    pintarTareas();
  }

  if (event.target.classList.contains("fa-circle-minus")) {
    delete tareas[event.target.dataset.id];
    pintarTareas();
  }

  if (event.target.classList.contains("fa-rotate-left")) {
    tareas[event.target.dataset.id].estado = false;
    pintarTareas();
  }

  //evita que otros elementos se activen
  event.stopPropagation();
};
