import { create } from 'zustand';

export const useUiStore = create((set) => ({
  currentView: 'editor', // 'editor' or 'dashboard'
  setView: (view) => set({ currentView: view }),
}));
