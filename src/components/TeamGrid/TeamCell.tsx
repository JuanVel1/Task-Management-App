import { Task } from '../../types';

interface TeamCellProps {
  tasks: Task[];
}

export function TeamCell({ tasks }: TeamCellProps) {
  const priorityColors = {
    low: 'bg-blue-100',
    medium: 'bg-yellow-100',
    high: 'bg-red-100',
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 rounded-md">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`w-6 h-6 rounded ${priorityColors[task.priority]} cursor-pointer`}
          title={task.title}
        />
      ))}
    </div>
  );
}