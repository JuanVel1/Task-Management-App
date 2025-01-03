import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types';

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        setError(err);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, project_id: projectId }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === taskId ? data : task));
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  };
}