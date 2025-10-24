import { create } from 'zustand';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  mode: 'anonymous',
  login: (user: User) =>
    set({
      isAuthenticated: true,
      user,
      mode: 'registered',
    }),
  logout: async () => {
    try {
      const { authApi } = await import('../services/api/authApi');
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        isAuthenticated: false,
        user: null,
        mode: 'anonymous',
      });
    }
  },
  checkAuth: async () => {
    try {
      const { authApi } = await import('../services/api/authApi');
      const response = await authApi.getCurrentUser();
      set({
        isAuthenticated: true,
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          createdAt: new Date(response.user.createdAt),
        },
        mode: 'registered',
      });
    } catch (error) {
      // User not authenticated
      set({
        isAuthenticated: false,
        user: null,
        mode: 'anonymous',
      });
    }
  },
}));
