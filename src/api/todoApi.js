const BASE_URL = "https://playground.4geeks.com/todo";
const USER_NAME = "lina_reina"; 

export const todoApi = {
    // Obtener tareas
    getTodos: async () => {
        const resp = await fetch(`${BASE_URL}/users/${USER_NAME}`);
        if (resp.status === 404) return await todoApi.createUser();
        const data = await resp.json();
        return data.todos;
    },
    // Crear usuario si no existe
    createUser: async () => {
        await fetch(`${BASE_URL}/users/${USER_NAME}`, { method: "POST" });
        return [];
    },
    // Agregar tarea
    addTask: async (label) => {
        const resp = await fetch(`${BASE_URL}/todos/${USER_NAME}`, {
            method: "POST",
            body: JSON.stringify({ label, is_done: false }),
            headers: { "Content-Type": "application/json" }
        });
        return await resp.json();
    },
    // Eliminar una tarea
    deleteTask: async (id) => {
        await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
    },
    // Limpiar todo (Borrar usuario y recrearlo)
    deleteAll: async () => {
        await fetch(`${BASE_URL}/users/${USER_NAME}`, { method: "DELETE" });
        return await todoApi.createUser();
    }
};