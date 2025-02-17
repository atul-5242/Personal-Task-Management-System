'use client';

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useProjects } from "@/app/hooks/useProjects";
import { FaArrowLeft, FaPlus, FaCalendar, FaList } from "react-icons/fa";
import Calendar from '@/app/components/shared/Calendar';
import TaskForm from '@/app/components/tasks/TaskForm';
import { useTasks } from '@/app/hooks/useTasks';
import { useQueryClient } from '@tanstack/react-query';

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const { projects } = useProjects();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { tasks, isLoading: isLoadingTasks } = useTasks(parseInt(params.id as string));
  const queryClient = useQueryClient();

  const project = projects.find(p => p.id === parseInt(params.id as string));

  const handleTaskCreated = () => {
    setIsTaskModalOpen(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-100';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-100';
      case 'low':
        return 'bg-green-500/20 text-green-100';
      default:
        return 'bg-gray-500/20 text-gray-100';
    }
  };
 

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-white/70">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-white text-purple-600' : 'text-white'
                }`}
              >
                <FaList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'calendar' ? 'bg-white text-purple-600' : 'text-white'
                }`}
              >
                <FaCalendar className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
            >
              <FaPlus className="mr-2" />
              New Task
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {isLoadingTasks ? (
                <div className="text-white">Loading tasks...</div>
              ) : tasks.length > 0 ? (
                tasks.map(task => (
                  <div key={task.id} className="bg-white/5 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <p className="text-white/70">{task.description}</p>
                      {/* @ts-expect-error - Task type does not include category, but it is expected to be present */}
                      {task.category && (
                        <span className="inline-block bg-purple-500/20 text-white text-sm px-2 py-1 rounded mt-2">
                          {/* @ts-expect-error - Task type does not include category, but it is expected to be present */}
                          {task.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={task.status}
                        onChange={async (e) => {
                          const response = await fetch(`/api/tasks/${task.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: e.target.value }),
                          });
                          if (response.ok) {
                            queryClient.invalidateQueries({ queryKey: ['tasks', params.id] });
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadgeColor(task.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      {/* Add Priority Dropdown */}
                      <select
                        value={task.priority}
                        onChange={async (e) => {
                          const response = await fetch(`/api/tasks/${task.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ priority: e.target.value }),
                          });
                          if (response.ok) {
                            queryClient.invalidateQueries({ queryKey: ['tasks', params.id] });
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityBadgeColor(task.priority)}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white">No tasks yet</p>
              )}
            </div>
          ) : (
            <Calendar />
          )}
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <button
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
            <TaskForm
              projectId={parseInt(params.id as string)}
              categoryId={selectedCategoryId || undefined}
              onClose={() => {
                setIsTaskModalOpen(false);
                setSelectedCategoryId(null);
              }}
              onSuccess={handleTaskCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
} 