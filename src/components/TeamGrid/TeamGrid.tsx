import { Task, Team, TaskStatus } from '../../types';
import { TeamRow } from './TeamRow';

const STATUSES = ['todo', 'in-progress', 'done'] as Array<TaskStatus>;
const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'Por Hacer',
  'in-progress': 'En Proceso',
  'done': 'Completado'
};

interface TeamGridProps {
  teams: Team[];
  tasks: Task[];
}

export function TeamGrid({ teams, tasks }: TeamGridProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-6 text-left">Equipo</th>
            {STATUSES.map((status) => (
              <th key={status} className="py-3 px-6 text-left">
                {STATUS_LABELS[status]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <TeamRow
              key={team.id}
              team={team}
              tasks={tasks}
              statuses={STATUSES}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}