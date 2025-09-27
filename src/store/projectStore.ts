import { create } from 'zustand';

export interface Project {
  id: string;
  title: string;
  certificationStandard: string;
  buildingType: string;
  status: 'draft' | 'in-progress' | 'completed';
  score: number;
  maxScore: number;
  lastModified: Date;
  selections: Record<string, any>;
  images: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  projectId: string;
  criterionId: string;
  url: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  
  // Actions
  createProject: (title: string, standard: string, buildingType: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (id: string) => void;
  updateProjectScore: (id: string, score: number) => void;
  addImage: (projectId: string, image: Omit<ProjectImage, 'id'>) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  
  createProject: (title, standard, buildingType) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      certificationStandard: standard,
      buildingType,
      status: 'draft',
      score: 0,
      maxScore: 100,
      lastModified: new Date(),
      selections: {},
      images: [],
    };
    
    set(state => ({
      projects: [...state.projects, newProject],
      currentProject: newProject
    }));
  },
  
  updateProject: (id, updates) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === id ? { ...p, ...updates, lastModified: new Date() } : p
      ),
      currentProject: state.currentProject?.id === id 
        ? { ...state.currentProject, ...updates, lastModified: new Date() }
        : state.currentProject
    }));
  },
  
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  
  deleteProject: (id) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject
    }));
  },
  
  updateProjectScore: (id, score) => {
    get().updateProject(id, { score });
  },
  
  addImage: (projectId, image) => {
    const newImage: ProjectImage = {
      ...image,
      id: Date.now().toString(),
    };
    
    const project = get().projects.find(p => p.id === projectId);
    if (project) {
      get().updateProject(projectId, {
        images: [...project.images, newImage]
      });
    }
  },
}));