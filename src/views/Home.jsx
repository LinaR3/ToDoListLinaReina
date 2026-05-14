import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import Task from "../components/Task";

const customStyles = {
    appContainer: {
        backgroundColor: '#FFC9E3',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
        border: '4px solid #C3B1E1',
    },
    title: {
        color: '#936ED4',
        textShadow: '2px 2px #FF91AE',
        fontFamily: 'Modak, cursive',
        fontSize: '4rem',
    },
    counterFooter: {
        backgroundColor: '#FCF8FF',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        fontSize: '14px',
        color: '#936ED4',
        padding: '10px 15px',
        border: '1px solid #C3B1E1',
        fontWeight: 'bold',
    },
};

const Home = () => {
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);

    // Función para refrescar la lista desde el servidor
    const loadTasks = async () => {
        try {
            const data = await todoApi.getTodos();
            setTasks(data);
        } catch (error) {
            console.error("Error cargando tareas:", error);
        }
    };

    // Cargar al inicio
    useEffect(() => {
        loadTasks();
    }, []);

    const handleAddTask = async () => {
        if (newTask.trim() !== "") {
            try {
                await todoApi.addTask(newTask.trim());
                setNewTask("");
                await loadTasks(); // Sincronizar con el servidor
            } catch (error) {
                console.error("Error al añadir:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoApi.deleteTask(id);
            await loadTasks(); // Sincronizar con el servidor
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleClearAll = async () => {
        try {
            await todoApi.deleteAll();
            setTasks([]); // Limpiar localmente mientras se recrea el usuario
            await loadTasks();
        } catch (error) {
            console.error("Error al limpiar todo:", error);
        }
    };

    const pendingCount = tasks.filter(t => !t.is_done).length;

    return (
        <div className="text-center" style={{ paddingTop: '50px', backgroundColor: '#FCF8FF', minHeight: '100vh' }}>
            <div className="col-lg-4 col-md-6 col-sm-8 mx-auto" style={customStyles.appContainer}>
                <h1 className="text-center mt-3 mb-4" style={customStyles.title}>
                    My 🐰 List 🥕
                </h1>

                <div className="d-flex mb-3">
                    <input
                        type="text"
                        className="form-control p-3"
                        placeholder="¿Qué necesita el conejito?"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    />
                </div>

                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <Task 
                            key={task.id} 
                            task={task} 
                            onDelete={() => handleDelete(task.id)} 
                        />
                    ))
                ) : (
                    <div className="form-control mt-2 p-3 text-body-tertiary" style={{ backgroundColor: '#FCF8FF', border: '1px dashed #C3B1E1', borderRadius: '15px' }}>
                        <p className="text-center m-0">¡No hay tareas! Tu 🐰 está muy feliz. ✨</p>
                    </div>
                )}

                <div className="mt-3 d-flex justify-content-between align-items-center" style={customStyles.counterFooter}>
                    <p className="m-0">
                        {pendingCount === 0 ? "¡Todo listo! 🎉" : `${pendingCount} pendiente(s)`}
                    </p>
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={handleClearAll}
                        style={{ borderRadius: '10px', fontSize: '12px' }}
                    >
                        Limpiar Todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;