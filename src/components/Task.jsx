import React, { useState } from "react";

const Task = ({ task, onDelete, onToggle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        background: task.is_done ? "#F0EDF8" : "var(--purple-pale)",
        border: `1.5px solid ${hovered ? "var(--purple-light)" : "#EDE8FA"}`,
        borderRadius: "14px", padding: "12px 14px",
        transition: "all 0.2s", animation: "slideIn 0.25s ease",
        opacity: task.is_done ? 0.7 : 1,
        boxShadow: hovered ? "0 2px 12px rgba(147,110,212,0.10)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox circular */}
      <div
        onClick={onToggle}
        style={{
          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${task.is_done ? "var(--purple)" : "var(--purple-light)"}`,
          background: task.is_done ? "var(--purple)" : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        {task.is_done && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Texto */}
      <span
        onClick={onToggle}
        style={{
          flex: 1, fontSize: "15px", cursor: "pointer", lineHeight: "1.4",
          color: task.is_done ? "var(--purple-light)" : "var(--text)",
          textDecoration: task.is_done ? "line-through" : "none",
          transition: "color 0.2s", wordBreak: "break-word",
        }}
      >
        {task.label}
      </span>

      {/* Botón borrar */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        style={{
          width: "30px", height: "30px", border: "none", background: "none",
          cursor: "pointer", borderRadius: "8px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.2s, background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,145,174,0.15)"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#FF91AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default Task;