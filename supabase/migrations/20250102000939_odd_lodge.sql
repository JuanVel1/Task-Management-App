/*
  # Esquema inicial del sistema de gestión de tareas

  1. Tablas
    - users (gestionada por auth.users de Supabase)
    - projects
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - description (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    - tasks
      - id (uuid, primary key)
      - project_id (uuid, foreign key)
      - title (text)
      - description (text)
      - status (text)
      - priority (text)
      - due_date (timestamp)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Relaciones
    - projects.user_id -> auth.users.id
    - tasks.project_id -> projects.id

  3. Políticas
    - RLS habilitado para todas las tablas
    - Usuarios pueden realizar operaciones CRUD en sus propios proyectos y tareas
*/

-- Crear tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de tareas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para proyectos
CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para tareas
CREATE POLICY "Users can view tasks of their projects"
  ON tasks
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create tasks in their projects"
  ON tasks
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update tasks in their projects"
  ON tasks
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tasks in their projects"
  ON tasks
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.user_id = auth.uid()
  ));

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add due_date column
ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;