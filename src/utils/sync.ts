import type { Project, User } from '../types';

// 同步服务 - 目前使用本地存储模拟云端同步
// 后续可以扩展为真实的云端同步服务

const SYNC_VERSION = '1.0.0';

interface SyncData {
  version: string;
  lastSync: number;
  projects: Project[];
  user: User | null;
}

/**
 * 导出用户数据为 JSON 文件
 */
export function exportUserData(projects: Project[], user: User | null): void {
  const data: SyncData = {
    version: SYNC_VERSION,
    lastSync: Date.now(),
    projects,
    user
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pixelmuse-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 从 JSON 文件导入用户数据
 */
export function importUserData(file: File): Promise<SyncData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // 验证数据格式
        if (!data.version || !data.projects || !Array.isArray(data.projects)) {
          reject(new Error('无效的备份文件格式'));
          return;
        }

        // 验证项目数据
        const validProjects = data.projects.filter((p: any) =>
          p.id && p.userId && p.prompt && p.generatedCode
        );

        resolve({
          version: data.version,
          lastSync: data.lastSync || Date.now(),
          projects: validProjects,
          user: data.user
        });
      } catch (error) {
        reject(new Error('文件解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

/**
 * 模拟云端同步 - 保存到本地存储
 */
export function syncToCloud(projects: Project[], user: User | null): void {
  try {
    const syncData: SyncData = {
      version: SYNC_VERSION,
      lastSync: Date.now(),
      projects,
      user
    };

    localStorage.setItem('pm_cloud_sync', JSON.stringify(syncData));
    console.log('数据已同步到云端');
  } catch (error) {
    console.error('同步失败:', error);
  }
}

/**
 * 模拟云端同步 - 从本地存储恢复
 */
export function syncFromCloud(): SyncData | null {
  try {
    const syncData = localStorage.getItem('pm_cloud_sync');
    if (!syncData) return null;

    const data = JSON.parse(syncData);
    return {
      version: data.version,
      lastSync: data.lastSync,
      projects: data.projects || [],
      user: data.user
    };
  } catch (error) {
    console.error('云端数据恢复失败:', error);
    return null;
  }
}

/**
 * 合并本地和云端数据
 */
export function mergeSyncData(localProjects: Project[], cloudData: SyncData | null): Project[] {
  if (!cloudData || !cloudData.projects.length) {
    return localProjects;
  }

  // 创建项目映射以便快速查找
  const localMap = new Map(localProjects.map(p => [p.id, p]));
  const cloudMap = new Map(cloudData.projects.map(p => [p.id, p]));

  const mergedProjects: Project[] = [];
  const processedIds = new Set<string>();

  // 合并策略：选择更新时间最新的项目
  for (const localProject of localProjects) {
    const cloudProject = cloudMap.get(localProject.id);

    if (cloudProject) {
      // 选择最新的版本
      const useLocal = localProject.createTime >= cloudProject.createTime;
      mergedProjects.push(useLocal ? localProject : cloudProject);
    } else {
      // 本地独有的项目
      mergedProjects.push(localProject);
    }

    processedIds.add(localProject.id);
  }

  // 添加云端独有的项目
  for (const cloudProject of cloudData.projects) {
    if (!processedIds.has(cloudProject.id)) {
      mergedProjects.push(cloudProject);
    }
  }

  // 按创建时间排序
  return mergedProjects.sort((a, b) => b.createTime - a.createTime);
}

/**
 * 获取同步状态信息
 */
export function getSyncStatus() {
  try {
    const cloudData = syncFromCloud();
    const localProjects = JSON.parse(localStorage.getItem('pm_projects') || '[]');

    return {
      hasCloudData: !!cloudData,
      lastSyncTime: cloudData?.lastSync,
      cloudProjectCount: cloudData?.projects?.length || 0,
      localProjectCount: localProjects.length,
      canSync: localProjects.length > 0
    };
  } catch (error) {
    return {
      hasCloudData: false,
      lastSyncTime: null,
      cloudProjectCount: 0,
      localProjectCount: 0,
      canSync: false
    };
  }
}