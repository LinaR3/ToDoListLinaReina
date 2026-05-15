import React, { useState, useRef } from "react";
import { useTasks } from "../hooks/useTasks";
import Task from "../components/Task";

const FILTERS = ["Todas", "Pendientes", "Completadas"];

const CatIcon = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <polygon points="7,15 7,7 12,12"
            stroke="#FAFAF8" strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="27,15 27,7 22,12"
            stroke="#FAFAF8" strokeWidth="1.4" strokeLinejoin="round" />
        <rect x="7" y="14" width="20" height="13" rx="6"
            stroke="#FAFAF8" strokeWidth="1.4" />
        <circle cx="13" cy="20" r="1.3" fill="#FAFAF8" />
        <circle cx="21" cy="20" r="1.3" fill="#FAFAF8" />
        <path d="M14.5 24 Q17 26 19.5 24"
            stroke="#FAFAF8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const Home = () => {
    const {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        reorderTasks,
        clearAll,
    } = useTasks();

    const [newTask, setNewTask] = useState("");
    const [activeFilter, setActiveFilter] = useState("Todas");
    const dragId = useRef(null);
    const dragOverId = useRef(null);

    // ─── Filtrado ─────────────────────────────────────────
    const filteredTasks = tasks.filter(t => {
        if (activeFilter === "Pendientes") return !t.is_done;
        if (activeFilter === "Completadas") return t.is_done;
        return true;
    });

    // ─── Stats ────────────────────────────────────────────
    const total = tasks.length;
    const done = tasks.filter(t => t.is_done).length;
    const pending = total - done;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    // ─── Agregar ──────────────────────────────────────────
    const handleAdd = async () => {
        if (!newTask.trim()) return;
        await addTask(newTask.trim());
        setNewTask("");
    };

    // ─── Drag & Drop ─────────────────────────────────────
    const handleDragStart = (id) => { dragId.current = id; };
    const handleDragOver = (id) => { dragOverId.current = id; };
    const handleDrop = () => {
        if (dragId.current === dragOverId.current) return;
        const reordered = [...tasks];
        const fromIndex = reordered.findIndex(t => t.id === dragId.current);
        const toIndex = reordered.findIndex(t => t.id === dragOverId.current);
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        reorderTasks(reordered);
    };
    const handleDragEnd = () => {
        dragId.current = null;
        dragOverId.current = null;
    };

    // ─── Tab title ────────────────────────────────────────
    document.title = pending > 0 ? `(${pending}) Tasks` : "Tasks";

    return (
        <div className="todo-card">

            {/* Header */}
            <div className="todo-header d-flex align-items-center gap-3">
                <div className="todo-cat-icon">
                    <CatIcon />
                </div>
                <div>
                    <h1 className="todo-title">Tasks</h1>
                    <p className="todo-subtitle">Lista de tareas de tu mascota</p>
                </div>
            </div>

            {/* Error */}
            {error && <div className="todo-error">{error}</div>}

            {/* Input */}
            <div className="d-flex gap-2 mb-3">
                <input
                    className="form-control todo-input"
                    type="text"
                    placeholder="Agregar tarea..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAdd()}
                />
                <button
                    className="btn-todo-add"
                    onClick={handleAdd}
                    aria-label="Agregar tarea"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>

            {/* Filtros */}
            <div className="todo-filters d-flex gap-2">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        className={`btn-filter ${activeFilter === f ? "active" : ""}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Progress bar */}
            {total > 0 && (
                <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="todo-progress-track">
                        <div className="todo-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="todo-progress-pct">{pct}%</span>
                </div>
            )}

            {/* Lista */}
            <div className="todo-tasks-bg">
                <div className="d-flex flex-column gap-2">
                    {loading ? (
                        <>
                            <div className="skeleton" />
                            <div className="skeleton" />
                            <div className="skeleton" />
                        </>
                    ) : filteredTasks.length === 0 ? (
                        <div className="todo-empty">
                            <span className="todo-empty-ascii">~(=^.^=)~</span>
                            {activeFilter === "Todas"
                                ? "Sin tareas por ahora."
                                : `No hay tareas ${activeFilter.toLowerCase()}.`}
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <Task
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onEdit={editTask}
                                onDelete={deleteTask}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="todo-footer d-flex justify-content-between align-items-center">
                <p className="todo-count">
                    {pending === 0 && total === 0
                        ? "Sin tareas"
                        : pending === 0
                            ? <><strong>{done}</strong> completadas 🎉</>
                            : <><strong>{pending}</strong> pendiente{pending !== 1 ? "s" : ""}</>
                    }
                </p>
                <button className="btn-todo-clear" onClick={clearAll}>
                    Limpiar todo
                </button>
            </div>

        </div>
    );
};

export default Home;