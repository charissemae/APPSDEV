/**
 * LocalStorage Utility Module
 */
const STORAGE_KEY = 'todo_app_tasks';

export const Storage = {
    /**
     * Fetch arrays of tasks from localStorage
     * @returns {Array} List of task objects
     */
    getTasks() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return [];
        }
    },

    /**
     * Save arrays of tasks into localStorage
     * @param {Array} tasks - Array of task objects
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving to localStorage", error);
        }
    }
};