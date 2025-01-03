import React, { useState } from 'react';
import { Priority, Task } from '../types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  initialTask?: Task;
}

export function TaskForm({ onSubmit, onCancel, initialTask }: TaskFormProps) {
  const [task, setTask] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'medium' as Priority,
    due_date: initialTask?.due_date ? initialTask.due_date.toString().split('T')[0] : '',
    status: initialTask?.status || 'todo',
    project_id: initialTask?.project_id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...task,
      due_date: task.due_date || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Prioridad
        </label>
        <select
          id="priority"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value as Priority })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Fecha de vencimiento
        </label>
        <input
          type="date"
          id="dueDate"
          value={task.due_date}
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={handleSubmit}
        >
          {initialTask ? 'Actualizar' : 'Crear'} Tarea
        </button>
      </div>
    </form>
  );
}