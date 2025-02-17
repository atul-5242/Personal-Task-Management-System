'use client';

import { useState } from 'react';
import { useTasks } from '@/app/hooks/useTasks';
import { Task } from '@/app/types/task';

interface TaskFormProps {
  projectId: number;
  categoryId?: number;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

export default function TaskForm({ projectId, categoryId, onClose, onSuccess }: TaskFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    priority: 'medium' as const,
    dueDate: '',
    category: {
      name: ''
    }
  });
  const { createTask, isCreating } = useTasks(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const task = await createTask({ 
        ...formData, 
        projectId,
        categoryId
      });
      onSuccess(task);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={formData.status}
            // @ts-ignore
            onChange={(e) => setFormData({ ...formData, status: e.target.value  })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            // @ts-ignore
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category (Optional)</label>
        <input
          type="text"
          id="category"
          value={formData.category.name}
          onChange={(e) => setFormData({ 
            ...formData, 
            category: { ...formData.category, name: e.target.value }
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter new category name"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}