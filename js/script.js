/**
 * @fileoverview Lógica principal para la aplicación de Lista de Tareas (To-Do List).
 * Maneja la adición, eliminación y marcado de tareas como completadas.
 * @author Tu Nombre (Opcional)
 * @version 1.0.0
 */

// 1. Obtener referencias a los elementos clave del DOM
// Estos elementos son necesarios para interactuar con la interfaz de usuario.

/** @type {HTMLFormElement} */
const form = document.getElementById('todo-form');

/** @type {HTMLInputElement} */
const input = document.getElementById('task-input');

/** @type {HTMLUListElement} */
const taskList = document.getElementById('task-list');

// 2. Escuchar el evento de envío del formulario
// Cuando el usuario hace clic en 'Agregar' o presiona Enter.
form.addEventListener('submit', function(/** @type {Event} */ event) {
    // Previene el comportamiento por defecto del formulario (recargar la página).
    event.preventDefault(); 

    // Obtiene el texto del input y elimina espacios en blanco al inicio/final.
    const taskText = input.value.trim(); 

    // Verifica que el texto no esté vacío.
    if (taskText !== "") {
        // Llama a la función principal para agregar la tarea.
        addTask(taskText); 
        
        // Limpia el campo de entrada después de agregar la tarea.
        input.value = ""; 
    }
});

// 3. Función principal para añadir una tarea
/**
 * Crea un nuevo elemento de tarea (<li>), le añade funcionalidad y lo inserta en el DOM.
 * @param {string} text - El texto o descripción de la tarea a añadir.
 * @returns {void}
 */
function addTask(text) {
    // 3.1. Crear el elemento <li> para la nueva tarea
    /** @type {HTMLLIElement} */
    const listItem = document.createElement('li');
    listItem.textContent = text;

    // 3.2. Crear el botón de eliminar
    /** @type {HTMLButtonElement} */
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    
    // 3.3. Añadir el evento para eliminar la tarea
    deleteButton.addEventListener('click', function() {
        // Elimina el elemento <li> (la tarea completa) de su padre (la <ul>).
        taskList.removeChild(listItem);
    });

    // 3.4. Añadir el evento para marcar como completada
    // Se activa cuando el usuario hace clic en el cuerpo del elemento <li>.
    listItem.addEventListener('click', function() {
        // Usa `classList.toggle` para añadir o quitar la clase 'completed'.
        // Esta clase es la que aplica el estilo de tachado y cambio de fondo en CSS.
        listItem.classList.toggle('completed');
    });

    // 3.5. Estructurar el elemento: <li> contiene el texto y el botón.
    listItem.appendChild(deleteButton);

    // 3.6. Insertar la nueva tarea en la lista principal (<ul>).
    taskList.appendChild(listItem);
}