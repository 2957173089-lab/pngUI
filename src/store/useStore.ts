import { create } from 'zustand';
import type { Project, Framework, User } from '../types';

type PreviewMode = 'desktop' | 'mobile';
type TabMode = 'preview' | 'code';

// ─── 从 localStorage 读取持久化的 API 配置 ───
function loadSetting(key: string, defaultValue: string): string {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveSetting(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable
  }
}

// ─── 用户数据持久化 ───
function loadUser(): User | null {
  try {
    const userData = localStorage.getItem('pm_user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem('pm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pm_user');
    }
  } catch {
    // localStorage unavailable
  }
}

// ─── 项目数据持久化 ───
function loadProjects(): Project[] {
  try {
    const projectsData = localStorage.getItem('pm_projects');
    return projectsData ? JSON.parse(projectsData) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem('pm_projects', JSON.stringify(projects));
  } catch {
    // localStorage unavailable
  }
}

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

  // ─── 设置弹窗 ───
  showSettings: boolean;

  // ─── API 配置 ───
  apiKey: string;
  apiEndpoint: string;
  modelName: string;

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
  setShowSettings: (v: boolean) => void;

  // ─── API 配置 setters ───
  setApiKey: (key: string) => void;
  setApiEndpoint: (endpoint: string) => void;
  setModelName: (model: string) => void;

  addProject: (p: Project) => void;
  toggleFavorite: (id: string) => void;
  setProjects: (projects: Project[]) => void;
}

const DEFAULT_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DEFAULT_MODEL = 'qwen-vl-max';

export const useStore = create<AppState>((set) => ({
  user: loadUser(),
  projects: loadProjects(),
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

  // ─── 设置弹窗 ───
  showSettings: false,

  // ─── API 配置（从 localStorage 恢复） ───
  apiKey: loadSetting('pm_api_key', ''),
  apiEndpoint: loadSetting('pm_api_endpoint', DEFAULT_ENDPOINT),
  modelName: loadSetting('pm_model_name', DEFAULT_MODEL),

  setUser: (user) => {
    saveUser(user);
    set({ user });
  },
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
  setShowSettings: (showSettings) => set({ showSettings }),

  // ─── API 配置 setters（同时持久化到 localStorage）───
  setApiKey: (apiKey) => {
    saveSetting('pm_api_key', apiKey);
    set({ apiKey });
  },
  setApiEndpoint: (apiEndpoint) => {
    saveSetting('pm_api_endpoint', apiEndpoint);
    set({ apiEndpoint });
  },
  setModelName: (modelName) => {
    saveSetting('pm_model_name', modelName);
    set({ modelName });
  },

  addProject: (p) => set((s) => {
    const newProjects = [p, ...s.projects];
    saveProjects(newProjects);
    return { projects: newProjects, currentProject: p };
  }),
  toggleFavorite: (id) =>
    set((s) => {
      const newProjects = s.projects.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
      saveProjects(newProjects);
      return {
        projects: newProjects,
        currentProject:
          s.currentProject?.id === id
            ? { ...s.currentProject, isFavorite: !s.currentProject.isFavorite }
            : s.currentProject,
      };
    }),
  setProjects: (projects) => {
    saveProjects(projects);
    set({ projects });
  },
}));
