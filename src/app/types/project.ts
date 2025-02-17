export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
} 