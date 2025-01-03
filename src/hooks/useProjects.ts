import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Project {
  id: string;
  name: string;
  description: string | null;
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const createProject = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ name, description, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { projects, loading, error, createProject };
}