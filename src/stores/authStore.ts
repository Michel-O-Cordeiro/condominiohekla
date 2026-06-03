import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Login realizado com sucesso!' };
  },

  register: async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.' };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Um email de recuperação foi enviado!' };
  },
}));

// Hook para inicializar a autenticação
export function useInitializeAuth() {
  useEffect(() => {
    // Initial session check
    const init = async () => {
      useAuthStore.setState({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || '',
            createdAt: new Date(session.user.created_at),
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };
    
    init();

    // Listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || '',
            createdAt: new Date(session.user.created_at),
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}