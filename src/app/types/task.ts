export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'deferred';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completedAt?: string;
  projectId: number;
  categoryId?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
} 