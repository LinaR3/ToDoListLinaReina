import React, { useState } from "react";

// Estilos específicos para la tarea 
const taskStyles = {
    taskItemBase: {
        backgroundColor: '#FCF8FF',
        border: 'none',
        borderRadius: '10px',
        marginBottom: '5px',
        borderLeft: '8px solid #C3B1E1',
        transition: 'all 0.3s',
        cursor: 'pointer',
        alignItems: 'center',
        display: 'flex',
    },
    taskItemCompleted: {
        backgroundColor: '#EAEAEA',
        textDecoration: 'line-through',
        opacity: 0.6,
        borderLeft: '8px solid #FF91AE',
    },
    taskText: {
        color: '#4A4D8F',
        marginBottom: '0',
        flexGrow: 1,
        padding: '1rem',
        textAlign: 'left'
    },
    deleteIcon: {
        color: '#FF91AE',
        cursor: 'pointer',
        fontSize: '1.2em',
        paddingRight: '15px',
        transition: 'transform 0.2s',
    },
};

const Task = ({ task, onDelete, onToggle }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Definir el estilo dinámico basado en el estado
    const itemStyle = task.is_done 
        ? { ...taskStyles.taskItemBase, ...taskStyles.taskItemCompleted }
        : isHovered
            ? { ...taskStyles.taskItemBase, borderLeftColor: '#FF91AE', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' }
            : taskStyles.taskItemBase;

    return (
        <div
            className="form-control mt-2 p-0"
            style={itemStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Texto de la tarea */}
            <p
                className="fs-5 fw-light"
                style={taskStyles.taskText}
                onClick={onToggle}
            >
                {task.label}
            </p>

            {/* Icono de eliminar - se muestra según el hover */}
            {isHovered && (
                <i
                    className="fa-solid fa-xmark"
                    style={taskStyles.deleteIcon}
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que al borrar se marque como completada
                        onDelete();
                    }}
                ></i>
            )}
        </div>
    );
};

export default Task;