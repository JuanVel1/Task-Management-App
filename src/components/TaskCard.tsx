import { Draggable as DraggableRaw, DraggableProvided } from 'react-beautiful-dnd';
import { ComponentType } from 'react';
import { Task } from '../types';

const Draggable = DraggableRaw as ComponentType<{
  draggableId: string;
  index: number;
  children: (provided: DraggableProvided) => React.ReactElement;
}>;

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded shadow-sm"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{task.title}</h3>
            <div className="space-x-2">
              <button
                onClick={onEdit}
                className="text-gray-600 hover:text-gray-900"
              >
                Editar
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              task.priority === 'high' 
                ? 'bg-red-100 text-red-800'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}