import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types/project';
import { useEffect } from 'react';

const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch('/api/projects', {
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Project fetch error details:', error);
    throw new Error(error.details || error.message || 'Failed to fetch projects');
  }
  
  return response.json();
};

const createProject = async (project: Partial<Project>): Promise<Project> => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }
  
  return response.json();
};

export function useProjects() {
  const setProjects = useProjectStore((state) => state.setProjects);
  const addProject = useProjectStore((state) => state.addProject);
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      console.error('Projects query error:', error);
    }
  });

  useEffect(() => {
    if (projectsQuery.data) {
      setProjects(projectsQuery.data);
    }
  }, [projectsQuery.data, setProjects]);

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      addProject(data);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    }
  });

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject: (project: Partial<Project>) => createProjectMutation.mutateAsync(project),
    isCreating: createProjectMutation.isPending,
    refetch: projectsQuery.refetch,
  };
} 