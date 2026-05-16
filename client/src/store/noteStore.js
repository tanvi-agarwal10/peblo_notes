import { create } from 'zustand';
import api from '../services/api';

export const useNoteStore = create((set, get) => ({
  notes: [],
  activeNoteId: null,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/notes');
      set({ notes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchNotes: async (query) => {
    if (!query) return get().fetchNotes();
    set({ isLoading: true });
    try {
      const response = await api.get(`/notes/search?q=${query}`);
      set({ notes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createNote: async () => {
    try {
      const response = await api.post('/notes');
      set((state) => ({ 
        notes: [response.data, ...state.notes],
        activeNoteId: response.data._id 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateNote: async (id, data) => {
    // Optimistic update
    const previousNotes = get().notes;
    set((state) => ({
      notes: state.notes.map(note => note._id === id ? { ...note, ...data, updatedAt: new Date().toISOString() } : note)
    }));

    try {
      await api.put(`/notes/${id}`, data);
    } catch (error) {
      // Revert on error
      set({ notes: previousNotes, error: error.message });
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter(note => note._id !== id),
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  setActiveNote: (id) => set({ activeNoteId: id }),
}));
