import { Task, TaskStatus, Team } from '../../types';
import { TeamCell } from './TeamCell';

interface TeamRowProps {
  team: Team;
  tasks: Task[];
  statuses: TaskStatus[];
}

export function TeamRow({ team, tasks, statuses }: TeamRowProps) {
  return (
    <tr className="border-b border-gray-200">
      <td className="py-4 px-6 bg-gray-50 font-medium">{team.name}</td>
      {statuses.map((status) => (
        <td key={status} className="py-2 px-4">
          <TeamCell 
            tasks={tasks.filter(task => task.status === status && task.teamId === team.id)} 
          />
        </td>
      ))}
    </tr>
  );
}