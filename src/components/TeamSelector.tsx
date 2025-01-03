import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Team } from '../types';

interface TeamSelectorProps {
  onSelectTeam: (teamId: string | null) => void;
  selectedTeamId: string | null;
}

export function TeamSelector({ onSelectTeam, selectedTeamId }: TeamSelectorProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }

      setTeams(data || []);
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {teams.map(team => (
        <button
          key={team.id}
          onClick={() => onSelectTeam(team.id)}
          className={`px-4 py-2 rounded-lg ${
            selectedTeamId === team.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {team.name}
        </button>
      ))}
    </div>
  );
} 