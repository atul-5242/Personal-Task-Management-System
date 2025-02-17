'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPlus, FaClock, FaTasks, FaCheckCircle } from "react-icons/fa";
import { useProjects } from "@/app/hooks/useProjects";

interface NewProjectForm {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

export default function Projects() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<NewProjectForm>({
    name: '',
    description: '',
    status: 'active',
    priority: 'medium',
    dueDate: ''
  });
  const [error, setError] = useState<string | null>(null);

  const { projects, isLoading, createProject, isCreating } = useProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'on_hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createProject(formData);
      console.log('Project creation form submitted:', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        status: 'active',
        priority: 'medium',
        dueDate: ''
      });
    } catch (err) {
      console.error('Project creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  useEffect(() => {
    console.log('Current projects:', projects);
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Your Projects</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
          >
            <FaPlus className="mr-2" />
            New Project
          </button>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <FaTasks className="text-white text-2xl mr-3" />
              <div>
                <p className="text-white/70">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <FaClock className="text-white text-2xl mr-3" />
              <div>
                <p className="text-white/70">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <FaCheckCircle className="text-white text-2xl mr-3" />
              <div>
                <p className="text-white/70">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                <p className="text-white/70 mb-4">{project.description}</p>
                <div className="flex justify-between items-center text-white/50 text-sm">
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  {project.dueDate && (
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-white/70 text-center mb-4">
                Get started by creating your first project using the New Project button above.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
              >
                <FaPlus className="mr-2" />
                Create First Project
              </button>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'on_hold' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 