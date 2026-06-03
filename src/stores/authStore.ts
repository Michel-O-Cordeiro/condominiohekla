import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUsers: User[] = [
    { id: '1', name: 'Administrador', email: 'admin@condominio.com', password: '123456', createdAt: new Date() }
  ];

  return {
    user: null,
    isAuthenticated: false,
    users: initialUsers,

    login: async (email: string, password: string) => {
      const state = get();  
      const user = state.users.find(u => u.email === email && u.password === password);
      
      if (user) {
        set({ user, isAuthenticated: true });
        return { success: true, message: 'Login realizado com sucesso!' };
      }
      
      return { success: false, message: 'Email ou senha incorretos!' };
    },

    register: async (name: string, email: string, password: string) => {
      const state = get();
      const existingUser = state.users.find(u => u.email === email);
      
      if (existingUser) {
        return { success: false, message: 'Este email já está cadastrado!' };
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date()
      };
      
      set({ users: [...state.users, newUser] });
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    },

    logout: () => {
      set({ user: null, isAuthenticated: false });
    },

    forgotPassword: async (email: string) => {
      const state = get();
      const user = state.users.find(u => u.email === email);
      
      if (user) {
        return { success: true, message: 'Um email de recuperação foi enviado!' };
      }
      
      return { success: false, message: 'Email não encontrado!' };
    }
  };
});
