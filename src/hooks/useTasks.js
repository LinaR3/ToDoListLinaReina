import { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTasks = async () => {
        try {
            setError(null);
            const data = await todoApi.getTodos();
            setTasks(data);
        } catch (e) {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTasks(); }, []);

    const addTask = async (label) => {
        try {
            await todoApi.addTask(label);
            await loadTasks();
        } catch (e) {
            setError("Error al agregar la tarea.");
        }
    };

    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, is_done: !t.is_done } : t
        ));
        try {
            await todoApi.updateTask(id, { label: task.label, is_done: !task.is_done });
        } catch (e) {
            await loadTasks();
        }
    };

    const editTask = async (id, newLabel) => {
        const task = tasks.find(t => t.id === id);
        if (!task || !newLabel.trim()) return;
        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, label: newLabel.trim() } : t
        ));
        try {
            await todoApi.updateTask(id, { label: newLabel.trim(), is_done: task.is_done });
        } catch (e) {
            await loadTasks();
        }
    };

    const deleteTask = async (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        try {
            await todoApi.deleteTask(id);
        } catch (e) {
            await loadTasks();
        }
    };

    const reorderTasks = (newOrder) => {
        setTasks(newOrder);
    };

    const clearAll = async () => {
        try {
            await todoApi.deleteAll();
            setTasks([]);
        } catch (e) {
            setError("Error al limpiar las tareas.");
        }
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        reorderTasks,
        clearAll,
    };
};