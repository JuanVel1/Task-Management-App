import { Droppable as DroppableRaw, DroppableProvided } from 'react-beautiful-dnd';
import { ComponentType } from 'react';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task } from '../types';

const Droppable = DroppableRaw as unknown as ComponentType<{
  droppableId: string;
  children: (provided: DroppableProvided) => JSX.Element;
}>;

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function Column({ column, onEditTask, onDeleteTask }: ColumnProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg min-w-[300px] h-full">
      <h2 className="font-semibold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-[200px]"
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {provided.placeholder as JSX.Element}
          </div>
        )}
      </Droppable>
    </div>
  );
}
