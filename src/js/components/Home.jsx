import React, { useState, useEffect } from "react";

//Estilos de fondo
const customStyles = {
	appContainer: {
		backgroundColor: '#FFC9E3',
		padding: '30px',
		borderRadius: '20px',
		boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
		border: '4px solid #C3B1E1',
	},
	title: {
		color: '#936ED4', // Morado oscuro
		textShadow: '2px 2px #FF91AE',
		fontFamily: 'Modak, cursive',
		fontSize: '5rem',
	},
	inputField: {
		borderRadius: '15px',
		borderColor: '#C3B1E1',
		transition: 'all 0.3s',
	},
	// Estilo base de la tarea
	taskItemBase: {
		backgroundColor: '#FCF8FF',
		border: 'none',
		borderRadius: '10px',
		marginBottom: '5px',
		borderLeft: '8px solid #C3B1E1',
		transition: 'all 0.3s',
		cursor: 'pointer',
		alignItems: 'center',
	},
	// Estilo de la tarea completada
	taskItemCompleted: {
		backgroundColor: '#EAEAEA',
		textDecoration: 'line-through',
		opacity: 0.6,
		borderLeft: '8px solid #FF91AE',
	},
	taskText: {
		color: '#4A4D8F',
		marginBottom: '0',
	},
	deleteIcon: {
		color: '#FF91AE',
		cursor: 'pointer',
		fontSize: '1.2em',
		transition: 'transform 0.2s',
	},
	counterFooter: {
		backgroundColor: '#FCF8FF',
		borderTop: 'none',
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

	// 1. Cargar tareas al montar el componente
	useEffect(() => {
		const savedTasks = localStorage.getItem("bunnyTasks");
		if (savedTasks) {
			setTasks(JSON.parse(savedTasks));
		}
	}, []);

	// 2. Guardar tareas cada vez que cambia lo que es 'Task'
	useEffect(() => {
		localStorage.setItem("bunnyTasks", JSON.stringify(tasks));
	}, [tasks]);


	const handleAddTask = () => {
		if (newTask.trim() !== "") {
			const newId = Date.now();
			setTasks([...tasks, { id: newId, label: newTask.trim(), isCompleted: false }]);
			setNewTask("");
		}
	};

	const handleDeleteTask = (taskId) => {
		setTasks(tasks.filter(task => task.id !== taskId));
	};

	const handleToggleComplete = (taskId) => {
		setTasks(
			tasks.map(task =>
				task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
			)
		);
	};

	const Task = ({ task }) => {
		const [isHovered, setIsHovered] = useState(false);

		//Si la tarea esta lista o el mouse esta encima
		const itemStyle = task.isCompleted
			? { ...customStyles.taskItemBase, ...customStyles.taskItemCompleted }
			: isHovered
				? { ...customStyles.taskItemBase, borderLeftColor: '#FF91AE', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' }
				: customStyles.taskItemBase;

		return (
			<div
				className="d-flex form-control mt-2 p-0"
				style={itemStyle}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Texto de la tarea, al hacer click cambia el estado */}
				<p
					className="p-3 col-11 fs-5 fw-light text-start"
					style={customStyles.taskText}
					onClick={() => handleToggleComplete(task.id)}
				>
					{task.label}
				</p>

				{/* Icono de eliminar, solo aparece al pasar el ratón */}
				{isHovered &&
					<i
						className="col-1 fa-solid fa-xmark"
						style={customStyles.deleteIcon}
						onClick={(e) => {
							e.stopPropagation(); // Evita que se active el toggle al hacer clic en eliminar
							handleDeleteTask(task.id);
						}}
					>
					</i>
				}
			</div>
		);
	}

	const pendingCount = tasks.filter(t => !t.isCompleted).length;

	return (

		<div className="text-center" style={{ paddingTop: '50px', backgroundColor: '#FCF8FF', minHeight: '100vh' }}>

			{/* Contenedor principal Bunny */}
			<div className="col-lg-4 col-md-6 col-sm-8 mx-auto" style={customStyles.appContainer}>
				<h1 className="text-center mt-3 mb-4 display-3" style={customStyles.title}>
					My 🐰 List 🥕
				</h1>

				{/* Controles de entrada */}
				<div className="d-flex mb-3">
					<input
						type="text"
						className="form-control p-3"
						placeholder="¿Qué necesita el conejito?"
						style={customStyles.inputField}
						onChange={(e) => setNewTask(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleAddTask();
							}
						}}
						value={newTask}
					/>
				</div>

				{/* Lista de Tareas */}
				{tasks.length > 0 ? (
					tasks.map(task => <Task key={task.id} task={task} />)
				) : (
					// Mensaje cuando la lista está vacía
					<div className="form-control mt-2 p-3 text-body-tertiary" style={{ backgroundColor: '#FCF8FF', border: '1px dashed #C3B1E1', borderRadius: '15px' }}>
						<p className="text-center m-0">¡No hay tareas! Tu 🐰 muy esta feliz :). ✨</p>
					</div>
				)}


				{/* Contador */}
				<div className="mt-3" style={customStyles.counterFooter}>
					<p className="text-start" style={{ margin: "0" }}>
						{pendingCount === 0
							? "¡Todas las tareas completadas! 🎉"
							: pendingCount + " pendiente(s)"
						}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Home;