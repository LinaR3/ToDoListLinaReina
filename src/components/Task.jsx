import React, { useState } from "react";

const Task = ({ task, onDelete, onToggle }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="d-flex align-items-center gap-2"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: task.is_done ? "#F3F1ED" : "#FAFAF8",
                border: `1.5px solid ${hovered && !task.is_done ? "#B4B2A9" : "#DEDAD2"}`,
                borderRadius: "8px",
                padding: "11px 12px",
                transition: "border-color 0.18s",
            }}
        >
            {/* Checkbox */}
            <div
                onClick={onToggle}
                style={{
                    width: "20px", height: "20px",
                    borderRadius: "5px",
                    border: `1.5px solid ${task.is_done ? "#2C2C2A" : "#C8C4BC"}`,
                    background: task.is_done ? "#2C2C2A" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, transition: "all 0.18s",
                }}
            >
                {task.is_done && (
                    <svg width="11" height="11" viewBox="0 0 24 24"
                        fill="none" stroke="#FAFAF8"
                        strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>

            {/* Label */}
            <span
                onClick={onToggle}
                style={{
                    flex: 1, fontSize: "14px",
                    color: task.is_done ? "#B4B2A9" : "#2C2C2A",
                    textDecoration: task.is_done ? "line-through" : "none",
                    lineHeight: "1.4", wordBreak: "break-word",
                    cursor: "pointer", userSelect: "none",
                    transition: "color 0.18s",
                }}
            >
                {task.label}
            </span>

            {/* Botón eliminar */}
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                onMouseEnter={e => e.currentTarget.style.background = "#E8E5DF"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                style={{
                    width: "28px", height: "28px",
                    border: "none", background: "none",
                    cursor: "pointer", borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.15s, background 0.15s",
                    flexShrink: 0,
                }}
                aria-label="Eliminar tarea"
            >
                <svg width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="#888780"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
};

export default Task;