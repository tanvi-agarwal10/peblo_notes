import { create } from 'zustand';
import api from '../services/api';
import { useNoteStore } from './noteStore';

export const useAiStore = create((set) => ({
  isGenerating: false,
  error: null,
  actionResult: null,

  generateInsights: async (noteId) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await api.post(`/notes/${noteId}/generate-ai`);
      
      // Update note in noteStore
      const { notes } = useNoteStore.getState();
      useNoteStore.setState({
        notes: notes.map(n => n._id === noteId ? response.data : n)
      });
      
      set({ isGenerating: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isGenerating: false });
    }
  },

  performAiAction: async (noteId, type) => {
    set({ isGenerating: true, error: null, actionResult: null });
    try {
      const response = await api.post(`/notes/${noteId}/ai-action`, { type });
      set({ actionResult: response.data, isGenerating: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isGenerating: false });
    }
  },

  clearResult: () => set({ actionResult: null, error: null })
}));
