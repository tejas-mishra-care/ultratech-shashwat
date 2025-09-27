import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  
  initialize: () => {
    // Set up auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      set({ 
        session, 
        user: session?.user ?? null, 
        isAuthenticated: !!session?.user,
        isLoading: false 
      });
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ 
        session, 
        user: session?.user ?? null, 
        isAuthenticated: !!session?.user,
        isLoading: false 
      });
    });
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        set({ isLoading: false });
        throw error;
      }
      // Auth state will be updated by the listener
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  
  setSession: (session) => {
    set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user });
  },
}));