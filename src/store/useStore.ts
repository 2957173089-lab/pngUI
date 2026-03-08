import { create } from 'zustand';
import type { Project, Framework, User } from '../types';

type PreviewMode = 'desktop' | 'mobile';
type TabMode = 'preview' | 'code';

interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;

  prompt: string;
  framework: Framework;
  imageUrl: string;
  isGenerating: boolean;
  streamingCode: string;
  previewMode: PreviewMode;
  tabMode: TabMode;

  showHistory: boolean;
  historyTab: 'history' | 'favorites';

  setUser: (user: User | null) => void;
  setPrompt: (prompt: string) => void;
  setFramework: (framework: Framework) => void;
  setImageUrl: (url: string) => void;
  setIsGenerating: (v: boolean) => void;
  setStreamingCode: (code: string) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setTabMode: (mode: TabMode) => void;
  setShowHistory: (v: boolean) => void;
  setHistoryTab: (tab: 'history' | 'favorites') => void;
  setCurrentProject: (p: Project | null) => void;

  addProject: (p: Project) => void;
  toggleFavorite: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  projects: [],
  currentProject: null,

  prompt: '',
  framework: 'html',
  imageUrl: '',
  isGenerating: false,
  streamingCode: '',
  previewMode: 'desktop',
  tabMode: 'preview',

  showHistory: false,
  historyTab: 'history',

  setUser: (user) => set({ user }),
  setPrompt: (prompt) => set({ prompt }),
  setFramework: (framework) => set({ framework }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setStreamingCode: (streamingCode) => set({ streamingCode }),
  setPreviewMode: (previewMode) => set({ previewMode }),
  setTabMode: (tabMode) => set({ tabMode }),
  setShowHistory: (showHistory) => set({ showHistory }),
  setHistoryTab: (historyTab) => set({ historyTab }),
  setCurrentProject: (currentProject) => set({ currentProject }),

  addProject: (p) => set((s) => ({ projects: [p, ...s.projects], currentProject: p })),
  toggleFavorite: (id) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
      currentProject:
        s.currentProject?.id === id
          ? { ...s.currentProject, isFavorite: !s.currentProject.isFavorite }
          : s.currentProject,
    })),
}));
