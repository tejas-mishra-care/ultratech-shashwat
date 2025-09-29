import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectDetails {
  certificationStandard: string;
  buildingType: string;
  registrationNumber: string;
  ownerName: string;
  mobileNumber: string;
  emailAddress: string;
  projectLocation: string;
  fullAddress: string;
  permissionAuthority: string;
  projectType: string;
  numberOfFloors: number;
  totalSiteArea: number;
  totalBuiltUpArea: number;
  landscapeArea: number;
  twoWheelerParking: number;
}

export interface Project {
  id: string;
  ownerUid: string;
  projectDetails: ProjectDetails;
  criteriaSelections: Record<string, any>;
  otherAutomationDetails: Record<string, string>;
  uploadedEvidence: Record<string, ProjectImage[]>;
  createdAt: Date;
  lastModified: Date;
}

export interface ProjectImage {
  storagePath: string;
  downloadUrl: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  uploadedAt: Date;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  
  // Actions
  loadProjects: () => Promise<void>;
  createProject: (projectDetails: ProjectDetails) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (id: string) => Promise<void>;
  addImage: (projectId: string, criterionId: string, image: Omit<ProjectImage, 'id'>) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_uid', user.id);

      if (error) throw error;

      set({ projects: data || [] });
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  createProject: async (projectDetails) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const newProject = {
        owner_uid: user.id,
        project_details: projectDetails,
        criteria_selections: {},
        other_automation_details: {},
        uploaded_evidence: {},
        created_at: new Date(),
        last_modified: new Date()
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;

      const project: Project = {
        id: data.id,
        ownerUid: data.owner_uid,
        projectDetails: data.project_details,
        criteriaSelections: data.criteria_selections,
        otherAutomationDetails: data.other_automation_details,
        uploadedEvidence: data.uploaded_evidence,
        createdAt: new Date(data.created_at),
        lastModified: new Date(data.last_modified)
      };

      set(state => ({
        projects: [...state.projects, project],
        currentProject: project
      }));

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProject: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          last_modified: new Date()
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates, lastModified: new Date() } : p
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates, lastModified: new Date() }
          : state.currentProject
      }));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  },
  
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  
  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  },
  
  addImage: async (projectId, criterionId, image) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) return;

      const currentEvidence = project.uploadedEvidence[criterionId] || [];
      const updatedEvidence = {
        ...project.uploadedEvidence,
        [criterionId]: [...currentEvidence, image]
      };

      await get().updateProject(projectId, {
        uploadedEvidence: updatedEvidence
      });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  },
}));