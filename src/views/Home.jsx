import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import Task from "../components/Task";

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await todoApi.getTodos();
      setTasks(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    try {
      await todoApi.addTask(newTask.trim());
      setNewTask("");
      await loadTasks();
    } catch (e) { console.error(e); }
  };

  const handleToggle = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_done: !t.is_done } : t));
    try {
      await todoApi.updateTask(id, { label: task.label, is_done: !task.is_done });
    } catch (e) { await loadTasks(); }
  };

  const handleDelete = async (id) => {
    try {
      await todoApi.deleteTask(id);
      await loadTasks();
    } catch (e) { console.error(e); }
  };

  const handleClearAll = async () => {
    try {
      await todoApi.deleteAll();
      setTasks([]);
      await loadTasks();
    } catch (e) { console.error(e); }
  };

  const pending = tasks.filter(t => !t.is_done).length;
  const progress = tasks.length > 0
    ? Math.round(((tasks.length - pending) / tasks.length) * 100)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <span style={{ fontSize: "52px", display: "block", animation: "float 3s ease-in-out infinite" }}>🐰</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem",
          color: "var(--text)", letterSpacing: "-1px", marginTop: "8px", lineHeight: "1.1" }}>
          My <span style={{ color: "var(--purple)" }}>List</span>
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
          Tareas de Lina Reina
        </p>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: "420px", background: "#fff", borderRadius: "24px",
        boxShadow: "0 4px 32px rgba(147,110,212,0.10)", padding: "24px",
        border: "1.5px solid #EDE8FA" }}>

        {/* Barra de progreso */}
        {tasks.length > 0 && (
          <div style={{ height: "4px", background: "#EDE8FA", borderRadius: "99px",
            marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`,
              background: "linear-gradient(90deg, var(--purple-light), var(--purple))",
              borderRadius: "99px", transition: "width 0.4s cubic-bezier(.4,0,.2,1)" }} />
          </div>
        )}

        {/* Input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            style={{ flex: 1, border: "1.5px solid #EDE8FA", borderRadius: "14px",
              padding: "12px 16px", fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
              color: "var(--text)", background: "var(--purple-pale)", outline: "none" }}
          />
          <button onClick={handleAdd}
            style={{ background: "var(--purple)", border: "none", borderRadius: "14px",
              width: "46px", height: "46px", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)", fontSize: "14px" }}>
              <span style={{ display: "block", fontSize: "38px", marginBottom: "8px",
                animation: "float 3s ease-in-out infinite" }}>🥕</span>
              ¡Sin tareas! Agrega una arriba.
            </div>
          ) : (
            tasks.map(task => (
              <Task key={task.id} task={task}
                onDelete={() => handleDelete(task.id)}
                onToggle={() => handleToggle(task.id)} />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: "16px", paddingTop: "16px", borderTop: "1.5px solid #EDE8FA" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
            {pending === 0 && tasks.length === 0
              ? "Todo listo 🎉"
              : pending === 0
                ? <><strong style={{ color: "var(--purple)" }}>¡Todo listo!</strong> 🎉</>
                : <><strong style={{ color: "var(--purple)" }}>{pending}</strong> pendiente{pending !== 1 ? "s" : ""}</>
            }
          </p>
          <button onClick={handleClearAll}
            style={{ background: "none", border: "1.5px solid #FFDDE8", borderRadius: "10px",
              padding: "6px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              color: "var(--pink)", cursor: "pointer", fontWeight: 500 }}>
            Limpiar todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;