import { Storage } from './storage.js';

// --- State Management ---
let state = {
    tasks: Storage.getTasks()
};

// --- Decorative Icons Pool ---
const ICONS = ['🌸', '✨', '🎀', '🩰', '🧸', '🍰', '🌷', '🧠', '⭐', '🎈'];

// --- DOM Cache ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

/**
 * Generates a consistent, semi-random icon based on task text
 * or explicitly purely random upon creation.
 */
const getRandomIcon = () => ICONS[Math.floor(Math.random() * ICONS.length)];

/**
 * Creates the DOM elements for a single todo item
 * @param {Object} task 
 * @returns {HTMLElement}
 */
const createTaskDOMElement = (task) => {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Left container for Toggle action
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'todo-item-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'todo-icon';
    // Persist icon if it doesn't exist, otherwise use a placeholder
    iconSpan.textContent = task.icon || getRandomIcon();
    task.icon = iconSpan.textContent; // Attach back to structure

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = task.text;

    contentWrapper.appendChild(iconSpan);
    contentWrapper.appendChild(textSpan);

    // Right Action Button (Delete)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);

    li.appendChild(contentWrapper);
    li.appendChild(deleteBtn);

    return li;
};

/**
 * Renders the full task UI from current state
 */
const render = () => {
    todoList.innerHTML = '';
    state.tasks.forEach(task => {
        const itemElement = createTaskDOMElement(task);
        todoList.appendChild(itemElement);
    });
};

/**
 * Dispatches mutations and syncs with Storage
 * @param {Array} nextTasksState 
 */
const updateState = (nextTasksState) => {
    state.tasks = nextTasksState;
    Storage.saveTasks(state.tasks);
    render();
};

// --- Action Handlers ---

const handleAddTask = (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const newTask = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        text,
        completed: false,
        icon: getRandomIcon() // Pre-assign so re-renders keep the icon consistent
    };

    updateState([...state.tasks, newTask]);
    
    // UI Cleanup & Focus preservation
    todoForm.reset();
    todoInput.focus();
};

const handleListClick = (e) => {
    const itemEl = e.target.closest('.todo-item');
    if (!itemEl) return;
    
    const taskId = itemEl.dataset.id;

    // Case 1: Clicked delete button
    if (e.target.classList.contains('delete-btn')) {
        const updated = state.tasks.filter(t => t.id !== taskId);
        updateState(updated);
        return;
    }

    // Case 2: Clicked on body to toggle completion status
    if (e.target.closest('.todo-item-content')) {
        const updated = state.tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, completed: !t.completed };
            }
            return t;
        });
        updateState(updated);
    }
};

// --- Initializing Event Listeners ---
const init = () => {
    todoForm.addEventListener('submit', handleAddTask);
    todoList.addEventListener('click', handleListClick);

    // Initial paint and element focus
    render();
    todoInput.focus();
};

// Fire up the app
document.addEventListener('DOMContentLoaded', init);