import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('peblo_token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('peblo_token', token);
      set({ user: userData, token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('peblo_token', token);
      set({ user: userData, token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Signup failed', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('peblo_token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('peblo_token');
    if (!token) {
      set({ user: null, token: null, isLoading: false });
      return;
    }
    
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('peblo_token');
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
