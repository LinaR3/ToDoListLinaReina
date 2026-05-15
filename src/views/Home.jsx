import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import Task from "../components/Task";

const styles = {
  card: {
    background: "#FAFAF8",
    borderRadius: "20px",
    border: "1.5px solid #DEDAD2",
    padding: "28px 24px",
  },
  catIcon: {
    width: "48px",
    height: "48px",
    background: "#2C2C2A",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontFamily: "'Varela Round', sans-serif",
    fontSize: "1.6rem",
    color: "#2C2C2A",
    lineHeight: 1,
    margin: 0,
  },
  subtitle: {
    fontSize: "12px",
    color: "#888780",
    marginTop: "4px",
    marginBottom: 0,
  },
  header: {
    paddingBottom: "20px",
    marginBottom: "24px",
    borderBottom: "1.5px solid #E2DED6",
  },
  input: {
    border: "1.5px solid #DEDAD2",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#2C2C2A",
    background: "#fff",
    outline: "none",
  },
  btnAdd: {
    background: "#2C2C2A",
    border: "none",
    borderRadius: "10px",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  tasksBg: {
    backgroundColor: "#F0EDE6",
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(180,178,169,0.18) 6px, rgba(180,178,169,0.18) 7px)",
    borderRadius: "12px",
    border: "1.5px solid #DEDAD2",
    padding: "10px",
    minHeight: "80px",
  },
  empty: {
    textAlign: "center",
    padding: "20px 0",
    color: "#B4B2A9",
    fontSize: "13px",
  },
  emptyAscii: {
    display: "block",
    marginBottom: "6px",
    fontSize: "15px",
    letterSpacing: "2px",
    fontFamily: "'Varela Round', sans-serif",
    color: "#C8C4BC",
  },
  footer: {
    paddingTop: "14px",
    borderTop: "1.5px solid #E2DED6",
  },
  count: {
    fontSize: "12px",
    color: "#888780",
    margin: 0,
  },
  countStrong: {
    color: "#2C2C2A",
    fontFamily: "'Varela Round', sans-serif",
    fontSize: "13px",
  },
  btnClear: {
    background: "none",
    border: "1.5px solid #DEDAD2",
    borderRadius: "8px",
    padding: "5px 12px",
    fontSize: "11px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#888780",
    cursor: "pointer",
    transition: "all 0.18s",
  },
};

const CatIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <polygon
      points="7,15 7,7 12,12"
      stroke="#FAFAF8" strokeWidth="1.4" strokeLinejoin="round"
    />
    <polygon
      points="27,15 27,7 22,12"
      stroke="#FAFAF8" strokeWidth="1.4" strokeLinejoin="round"
    />
    <rect
      x="7" y="14" width="20" height="13" rx="6"
      stroke="#FAFAF8" strokeWidth="1.4"
    />
    <circle cx="13" cy="20" r="1.3" fill="#FAFAF8" />
    <circle cx="21" cy="20" r="1.3" fill="#FAFAF8" />
    <path
      d="M14.5 24 Q17 26 19.5 24"
      stroke="#FAFAF8" strokeWidth="1.2" strokeLinecap="round"
    />
  </svg>
);

const Home = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await todoApi.getTodos();
      setTasks(data);
    } catch (e) {
      console.error("Error cargando tareas:", e);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    try {
      await todoApi.addTask(newTask.trim());
      setNewTask("");
      await loadTasks();
    } catch (e) {
      console.error("Error al añadir:", e);
    }
  };

  const handleToggle = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, is_done: !t.is_done } : t
    ));
    try {
      await todoApi.updateTask(id, { label: task.label, is_done: !task.is_done });
    } catch (e) {
      await loadTasks();
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoApi.deleteTask(id);
      await loadTasks();
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
  };

  const handleClearAll = async () => {
    try {
      await todoApi.deleteAll();
      setTasks([]);
    } catch (e) {
      console.error("Error al limpiar:", e);
    }
  };

  const total = tasks.length;
  const done = tasks.filter(t => t.is_done).length;
  const pending = total - done;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="w-100" style={{ maxWidth: "420px" }}>
      <div style={styles.card}>

        {/* Header */}
        <div className="d-flex align-items-center gap-3" style={styles.header}>
          <div style={styles.catIcon}>
            <CatIcon />
          </div>
          <div>
            <h1 style={styles.title}>SomeTasks</h1>
            <p style={styles.subtitle}>Lista de tareas de tu mascota</p>
          </div>
        </div>

        {/* Input */}
        <div className="d-flex gap-2 mb-3">
          <input
            className="form-control"
            style={styles.input}
            type="text"
            placeholder="Agregar tarea..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <button
            style={styles.btnAdd}
            onClick={handleAdd}
            aria-label="Agregar tarea"
            onMouseEnter={e => e.currentTarget.style.background = "#444441"}
            onMouseLeave={e => e.currentTarget.style.background = "#2C2C2A"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#FAFAF8" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Barra de progreso Bootstrap */}
        {total > 0 && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="progress flex-grow-1" style={{ height: "3px", backgroundColor: "#DEDAD2", borderRadius: "99px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${pct}%`,
                  background: "#2C2C2A",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <span style={{ fontSize: "11px", color: "#888780", fontFamily: "'Varela Round', sans-serif", minWidth: "28px", textAlign: "right" }}>
              {pct}%
            </span>
          </div>
        )}

        <div style={{ ...styles.tasksBg, marginBottom: "14px" }}>
          <div className="d-flex flex-column gap-2">
            {tasks.length === 0 ? (
              <div style={styles.empty}>
                <span style={styles.emptyAscii}>~(=^.^=)~</span>
                Sin tareas por ahora.
              </div>
            ) : (
              tasks.map(task => (
                <Task
                  key={task.id}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                  onToggle={() => handleToggle(task.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center" style={styles.footer}>
          <p style={styles.count}>
            {pending === 0 && total === 0
              ? "Todo al día"
              : pending === 0
                ? <><strong style={styles.countStrong}>{done}</strong> completadas</>
                : <><strong style={styles.countStrong}>{pending}</strong> pendiente{pending !== 1 ? "s" : ""}</>
            }
          </p>
          <button
            style={styles.btnClear}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#B4B2A9"; e.currentTarget.style.color = "#444441"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#DEDAD2"; e.currentTarget.style.color = "#888780"; }}
            onClick={handleClearAll}
          >
            Limpiar todo
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;