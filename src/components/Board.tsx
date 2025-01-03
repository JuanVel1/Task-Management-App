import { useState, ComponentType } from "react";
import { Column as ColumnType, Task, TaskStatus } from "../types";
import { Column } from "./Column";
import { TaskForm } from "./TaskForm";
import { useTasks } from "../contexts/TaskContext";
import { TeamSelector } from "./TeamSelector";
import {
  DragDropContext as DragDropContextRaw,
  DropResult,
} from "react-beautiful-dnd";

// Crear un componente funcional envoltorio
const DragDropContext = DragDropContextRaw as unknown as ComponentType<{
  onDragEnd: (result: DropResult) => void;
  children: JSX.Element;
}>;

const initialColumns: ColumnType[] = [
  { id: 'todo' as TaskStatus, title: 'Por Hacer', tasks: [] },
  { id: 'in-progress' as TaskStatus, title: 'En Proceso', tasks: [] },
  { id: 'done' as TaskStatus, title: 'Completadas', tasks: [] },
];

interface BoardProps {
  view: "tablero" | "equipos";
}
export function Board({ view }: BoardProps) {
  const { tasks, addTask, updateTask, loading, error, deleteTask, setTasks } = useTasks();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Filtrar tareas según la vista
  const filteredTasks = tasks.filter((task) => {
    if (view === "tablero") {
      return true; // Mostrar todas las tareas en el tablero
    } else {
      return task.teamId === selectedTeamId; // Mostrar solo tareas del equipo seleccionado
    }
  });

  const columns = initialColumns.map((col) => ({
    ...col,
    tasks: filteredTasks.filter((task) => task.status === col.id),
  }));

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSubmitTask = async (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;

    // Actualizar el estado local inmediatamente
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === draggableId 
          ? { ...task, status: newStatus }
          : task
      )
    );

    // Luego actualizar en la base de datos
    try {
      await updateTask(draggableId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task:', error);
      // Revertir en caso de error
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === draggableId 
            ? { ...task, status: source.droppableId as TaskStatus }
            : task
        )
      );
    }
  };

  return (
    <div className="bg-slate-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {view === "tablero" ? "Tablero de Tareas" : "Tareas del Equipo"}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Nueva Tarea
        </button>
      </div>

      {view === "equipos" && (
        <div className="mb-6">
          <TeamSelector
            onSelectTeam={setSelectedTeamId}
            selectedTeamId={selectedTeamId}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? "Editar Tarea" : "Nueva Tarea"}
            </h2>
            <TaskForm
              onSubmit={handleSubmitTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              initialTask={editingTask || undefined}
            />
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

