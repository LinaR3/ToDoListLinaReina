const BASE_URL = import.meta.env.VITE_API_URL;
const USER_NAME = import.meta.env.VITE_USER_NAME;

export const todoApi = {
    getTodos: async () => {
        const resp = await fetch(`${BASE_URL}/users/${USER_NAME}`);
        if (resp.status === 404) return await todoApi.createUser();
        const data = await resp.json();
        return data.todos;
    },

    createUser: async () => {
        await fetch(`${BASE_URL}/users/${USER_NAME}`, { method: "POST" });
        return [];
    },

    addTask: async (label) => {
        const resp = await fetch(`${BASE_URL}/todos/${USER_NAME}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label, is_done: false }),
        });
        return await resp.json();
    },

    updateTask: async (id, body) => {
        const resp = await fetch(`${BASE_URL}/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return await resp.json();
    },

    deleteTask: async (id) => {
        await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
    },

    deleteAll: async () => {
        await fetch(`${BASE_URL}/users/${USER_NAME}`, { method: "DELETE" });
        return await todoApi.createUser();
    },
};