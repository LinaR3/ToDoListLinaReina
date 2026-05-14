const BASE_URL = "https://playground.4geeks.com/todo";
const USER_NAME = "lina_reina";

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
      body: JSON.stringify({ label, is_done: false }),
      headers: { "Content-Type": "application/json" }
    });
    return await resp.json();
  },
  // Toggle is_done
  updateTask: async (id, body) => {
    const resp = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    return await resp.json();
  },
  deleteTask: async (id) => {
    await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
  },
  deleteAll: async () => {
    await fetch(`${BASE_URL}/users/${USER_NAME}`, { method: "DELETE" });
    return await todoApi.createUser();
  }
};