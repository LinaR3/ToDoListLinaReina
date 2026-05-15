import React, { useState, useRef } from "react";

const Task = ({ task, onDelete, onToggle, onEdit, onDragStart, onDragOver, onDrop, onDragEnd }) => {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.label);
    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef(null);

    // ─── Edición inline ──────────────────────────────────
    const handleDoubleClick = () => {
        if (task.is_done) return;
        setEditing(true);
        setEditValue(task.label);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleEditConfirm = () => {
        if (editValue.trim() && editValue.trim() !== task.label) {
            onEdit(task.id, editValue.trim());
        }
        setEditing(false);
    };

    const handleEditKeyDown = (e) => {
        if (e.key === "Enter") handleEditConfirm();
        if (e.key === "Escape") {
            setEditValue(task.label);
            setEditing(false);
        }
    };

    // ─── Drag & Drop ─────────────────────────────────────
    const handleDragStart = (e) => {
        setIsDragging(true);
        onDragStart(task.id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver(task.id);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(task.id);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setIsDragOver(false);
        onDragEnd();
    };

    const itemClasses = [
        "task-item",
        "d-flex align-items-center gap-2",
        task.is_done ? "done" : "",
        isDragging ? "dragging" : "",
        isDragOver ? "drag-over" : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className={itemClasses}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
        >
            {/* Drag handle */}
            <span className="task-drag-handle" aria-hidden="true">
                <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
                    <circle cx="4" cy="3" r="1.5"/>
                    <circle cx="8" cy="3" r="1.5"/>
                    <circle cx="4" cy="8" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="4" cy="13" r="1.5"/>
                    <circle cx="8" cy="13" r="1.5"/>
                </svg>
            </span>

            {/* Checkbox */}
            <div className="task-check" onClick={() => onToggle(task.id)}>
                {task.is_done && (
                    <svg width="11" height="11" viewBox="0 0 24 24"
                        fill="none" stroke="#FAFAF8"
                        strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>

            {/* Label o input de edición */}
            {editing ? (
                <input
                    ref={inputRef}
                    className="task-edit-input"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={handleEditConfirm}
                    onKeyDown={handleEditKeyDown}
                />
            ) : (
                <span
                    className="task-label"
                    onDoubleClick={handleDoubleClick}
                    onClick={() => onToggle(task.id)}
                    title={task.is_done ? "" : "Doble click para editar"}
                >
                    {task.label}
                </span>
            )}

            {/* Botón eliminar */}
            <button
                className="task-delete-btn"
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                aria-label="Eliminar tarea"
            >
                <svg width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
};

export default Task;