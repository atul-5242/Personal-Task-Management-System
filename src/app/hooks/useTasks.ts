import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types/task';

type CreateTaskInput = Partial<Task> & {
  categoryName?: string;
};

const fetchTasks = async (projectId: number): Promise<Task[]> => {
  const response = await fetch(`/api/tasks?projectId=${projectId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

const createTask = async (task: CreateTaskInput): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
};

export function useTasks(projectId: number) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId),
  });

  const createTaskMutation = useMutation<Task, Error, CreateTaskInput>({
    mutationFn: createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      return data;
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: (task: CreateTaskInput) => createTaskMutation.mutateAsync(task),
    isCreating: createTaskMutation.isPending,
  };
} 