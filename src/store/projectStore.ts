import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectDetails {
  projectTitle: string;
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
  // Computed properties for UI compatibility
  title: string;
  certificationStandard: string;
  buildingType: string;
  status: 'draft' | 'in-progress' | 'completed';
  score: number;
  maxScore: number;
  images: number;
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

      const projects = (data || []).map((project: any) => {
        const projectDetails = project.project_details as ProjectDetails;
        const criteriaSelections = project.criteria_selections as Record<string, any>;
        const uploadedEvidence = project.uploaded_evidence as Record<string, ProjectImage[]>;
        const status = Object.keys(criteriaSelections || {}).length > 0 ? 'in-progress' as const : 'draft' as const;
        
        return {
          id: project.id,
          ownerUid: project.owner_uid,
          projectDetails,
          criteriaSelections,
          otherAutomationDetails: project.other_automation_details as Record<string, string>,
          uploadedEvidence,
          createdAt: new Date(project.created_at),
          lastModified: new Date(project.last_modified),
          // Computed properties
          title: projectDetails?.projectTitle || 'Untitled Project',
          certificationStandard: projectDetails?.certificationStandard || '',
          buildingType: projectDetails?.buildingType || '',
          status,
          score: 0, // Will be calculated from criteria
          maxScore: 79, // Default max score
          images: Object.values(uploadedEvidence || {}).flat().length
        };
      });

      set({ projects });
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
        project_details: projectDetails as any,
        criteria_selections: {} as any,
        other_automation_details: {} as any,
        uploaded_evidence: {} as any
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;

      if (!data) return null;

      const dbProjectDetails = data.project_details as any;
      
      const project: Project = {
        id: data.id,
        ownerUid: data.owner_uid,
        projectDetails: dbProjectDetails as ProjectDetails,
        criteriaSelections: (data.criteria_selections as any) || {},
        otherAutomationDetails: (data.other_automation_details as any) || {},
        uploadedEvidence: (data.uploaded_evidence as any) || {},
        createdAt: new Date(data.created_at),
        lastModified: new Date(data.last_modified),
        // Computed properties
        title: dbProjectDetails?.projectTitle || 'Untitled Project',
        certificationStandard: dbProjectDetails?.certificationStandard || '',
        buildingType: dbProjectDetails?.buildingType || '',
        status: 'draft' as const,
        score: 0,
        maxScore: 79,
        images: 0
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
      const dbUpdates: any = {};
      
      // Map Project fields to database fields
      if (updates.projectDetails) dbUpdates.project_details = updates.projectDetails;
      if (updates.criteriaSelections) dbUpdates.criteria_selections = updates.criteriaSelections;
      if (updates.otherAutomationDetails) dbUpdates.other_automation_details = updates.otherAutomationDetails;
      if (updates.uploadedEvidence) dbUpdates.uploaded_evidence = updates.uploadedEvidence;

      const { error } = await supabase
        .from('projects')
        .update(dbUpdates)
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