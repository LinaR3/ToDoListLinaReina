import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import Task from "../components/Task";
import { customStyles } from "../styles/jsStyles"; // Opcional: puedes mover los estilos a otro archivo js

const Home = () => {
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const loadTasks = async () => {
        const data = await todoApi.getTodos();
        setTasks(data);
    };

    useEffect(() => { loadTasks(); }, []);

    const handleAddTask = async () => {
        if (newTask.trim()) {
            await todoApi.addTask(newTask);
            setNewTask("");
            loadTasks();
        }
    };

    const handleDelete = async (id) => {
        await todoApi.deleteTask(id);
        loadTasks();
    };

    const handleClearAll = async () => {
        await todoApi.deleteAll();
        setTasks([]);
    };

    const pendingCount = tasks.filter(t => !t.is_done).length;

    return (
        <div className="text-center" style={{ paddingTop: '50px', backgroundColor: '#FCF8FF', minHeight: '100vh' }}>
            <div className="col-lg-4 col-md-6 col-sm-8 mx-auto" style={customStyles.appContainer}>
                <h1 style={customStyles.title}>My 🐰 List 🥕</h1>
                
                <input 
                    className="form-control p-3 mb-3"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    placeholder="¿Qué necesita el conejito?"
                />

                {tasks.length > 0 ? (
                    tasks.map(t => <Task key={t.id} task={t} onDelete={() => handleDelete(t.id)} />)
                ) : (
                    <p>¡No hay tareas! ✨</p>
                )}

                <div className="mt-3 d-flex justify-content-between" style={customStyles.counterFooter}>
                    <span>{pendingCount} pendiente(s)</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleClearAll}>Limpiar Todo</button>
                </div>
            </div>
        </div>
    );
};

export default Home;