export type Framework = 'html' | 'vue3' | 'react' | 'uniapp';

export interface Project {
  id: string;
  userId: string;
  imageUrl: string;
  prompt: string;
  framework: Framework;
  generatedCode: string;
  isFavorite: boolean;
  createTime: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
}

export const frameworkLabels: Record<Framework, string> = {
  html: 'HTML + Tailwind',
  vue3: 'Vue 3',
  react: 'React',
  uniapp: 'Uni-app',
};

export const frameworkIcons: Record<Framework, string> = {
  html: '🌐',
  vue3: '💚',
  react: '⚛️',
  uniapp: '📱',
};
