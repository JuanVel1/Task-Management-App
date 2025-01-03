export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  due_date: string | undefined;
  project_id?: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}