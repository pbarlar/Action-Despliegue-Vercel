/**
 * @fileoverview Pruebas unitarias para la lógica de la To-Do List (js/script.js) usando Jest.
 */

// Importamos la función que queremos probar.
// En un entorno real, solo importarías las funciones, pero aquí es un módulo global.
// Para Jest, debemos tratar el código como si estuviera en un archivo separado.
// Aquí asumimos que la función `addTask` y las referencias del DOM están disponibles 
// globalmente después de cargar el script, tal como lo hace el navegador.

// Importamos el código JS a probar (asumiendo que Jest puede accederlo desde la raíz).
// Nota: Jest usa require() para CommonJS, que es compatible con la mayoría de las configuraciones.
require('../js/script.js'); 

// =========================================================================
// SIMULACIÓN DE DOM (JSDOM)
// =========================================================================

// Estructura básica del DOM necesaria para que script.js funcione.
const HTML_STRUCTURE = `
    <form id="todo-form">
        <input type="text" id="task-input" required>
        <button type="submit">Agregar</button>
    </form>
    <ul id="task-list"></ul>
`;

// Declaramos variables que serán asignadas antes de cada prueba.
let taskList;
let input;
let form;
let addTask; // Asumimos que la función addTask existe globalmente después del require.

/**
 * Configuración que se ejecuta antes de CADA prueba.
 * 1. Simula el DOM necesario.
 * 2. Recarga las referencias a los elementos del DOM.
 */
beforeEach(() => {
    // 1. Establecer la estructura HTML simulada en el cuerpo del documento.
    document.body.innerHTML = HTML_STRUCTURE;

    // 2. Recargar referencias a los elementos después de manipular el DOM simulado.
    taskList = document.getElementById('task-list');
    input = document.getElementById('task-input');
    form = document.getElementById('todo-form');
    
    // Si la función addTask no es accesible directamente, podrías tener que exportarla 
    // en script.js y luego importarla. Para este proyecto simple, asumimos que 
    // está disponible globalmente a través del require, o la redefinimos si es necesario.
    
    // Para asegurar que tenemos acceso a la función principal (addTask)
    // la cual está definida globalmente en script.js:
    if (typeof global.addTask === 'function') {
        addTask = global.addTask;
    } else {
        // Esto es una medida de seguridad si Jest no expone globalmente.
        // En proyectos más grandes, se usarían módulos ES6 (export/import).
        console.error("La función addTask no está disponible globalmente para las pruebas.");
        // Aquí asumiríamos que el código está bien importado y la función es accesible.
        addTask = window.addTask; // Usar el objeto window/global que Jest simula.
    }
});

// =========================================================================
// BLOQUE DE PRUEBAS JEST
// =========================================================================

describe('Funcionalidad Básica de To-Do List (addTask)', () => {
    
    test('Debe añadir un nuevo elemento <li> a la lista', () => {
        const initialCount = taskList.children.length;
        const taskText = "Hacer la compra";
        
        addTask(taskText); // Act

        // Assert: Verifica que el contador aumentó y el texto es correcto.
        expect(taskList.children.length).toBe(initialCount + 1);
        expect(taskList.children[0].textContent).toContain(taskText);
    });

    test('El nuevo elemento debe contener un botón de "Eliminar"', () => {
        addTask("Tarea con botón");

        const newTask = taskList.children[0];
        
        // Assert: Busca el botón y verifica su texto.
        expect(newTask.querySelector('button')).not.toBeNull();
        expect(newTask.querySelector('button').textContent).toBe('Eliminar');
    });

    test('Debe eliminar la tarea de la lista al hacer clic en "Eliminar"', () => {
        addTask("Tarea a eliminar");
        const initialCount = taskList.children.length;
        const deleteButton = taskList.children[0].querySelector('button');

        // Simular el evento click en el botón (Act)
        deleteButton.click(); 

        // Assert: Verifica que la lista está vacía.
        expect(taskList.children.length).toBe(initialCount - 1);
    });

    test('Debe alternar la clase "completed" al hacer clic en el <li>', () => {
        addTask("Tarea de prueba");
        const taskItem = taskList.children[0];

        // Clic 1: Marcar como completada (Act)
        taskItem.click(); 
        expect(taskItem.classList.contains('completed')).toBe(true);

        // Clic 2: Desmarcar (Act)
        taskItem.click(); 
        expect(taskItem.classList.contains('completed')).toBe(false);
    });

});

describe('Manejo del Formulario (Evento submit)', () => {

    test('Debe llamar a addTask y limpiar el input al enviar el formulario', () => {
        // Espía la función addTask para verificar si fue llamada.
        // Nota: Esto asume que addTask es accesible globalmente o que la redefinimos.
        // Si no se puede espiar, se prueba el efecto directo (el elemento en el DOM).
        
        const taskText = "Ir al gimnasio";
        input.value = taskText;

        // Simular el evento submit del formulario
        form.dispatchEvent(new Event('submit'));

        // Assert 1: Se agregó al DOM
        expect(taskList.children.length).toBe(1);
        expect(taskList.children[0].textContent).toContain(taskText);

        // Assert 2: El input se limpió
        expect(input.value).toBe("");
    });
    
    test('No debe añadir una tarea si el input está vacío', () => {
        input.value = "   "; // Solo espacios
        const initialCount = taskList.children.length;

        // Simular el evento submit
        form.dispatchEvent(new Event('submit'));

        // Assert: La lista de tareas no debe haber cambiado.
        expect(taskList.children.length).toBe(initialCount);
    });
});