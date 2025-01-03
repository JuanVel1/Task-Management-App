import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDefaultProject = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .limit(1)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert([{
            name: 'Proyecto Default',
            description: 'Proyecto principal',
            user_id: user.id
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        if (!newProject) throw new Error('No se pudo crear el proyecto');
        setProjectId(newProject.id);
        await fetchTasks(newProject.id);
      } else if (error) {
        throw error;
      } else if (!data) {
        throw new Error('No se encontró el proyecto');
      } else {
        setProjectId(data.id);
        await fetchTasks(data.id);
      }
    } catch (err) {
      console.error('Error fetching/creating default project:', err);
      setError('Error al cargar el proyecto por defecto');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchDefaultProject();
    }
  }, [user, fetchDefaultProject]);

  const fetchTasks = async (projectId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!projectId) {
      throw new Error('No hay proyecto seleccionado');
    }

    try {
      console.log('Adding task with project_id:', projectId);
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, project_id: projectId }])
        .select()
        .single();

      if (error) throw error;
      setTasks([...tasks, data]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };
  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask, loading, error }}>
      {children}
    </TaskContext.Provider>
  );
}


export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}