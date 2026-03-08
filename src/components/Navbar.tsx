import { History, Star, LogOut, Sparkles, Settings, Zap, Cloud, CloudUpload, CloudDownload, Download, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { exportUserData, importUserData, syncToCloud, syncFromCloud, mergeSyncData, getSyncStatus } from '../utils/sync';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const user = useStore((s) => s.user);
  const projects = useStore((s) => s.projects);
  const apiKey = useStore((s) => s.apiKey);
  const setUser = useStore((s) => s.setUser);
  const setProjects = useStore((s) => s.setProjects);
  const setShowHistory = useStore((s) => s.setShowHistory);
  const setHistoryTab = useStore((s) => s.setHistoryTab);
  const setShowSettings = useStore((s) => s.setShowSettings);
  const [syncLoading, setSyncLoading] = useState(false);
  const [showSyncMenu, setShowSyncMenu] = useState(false);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSyncMenu && !(event.target as Element).closest('.relative')) {
        setShowSyncMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSyncMenu]);

  // 同步功能处理函数
  const handleExportData = () => {
    exportUserData(projects, user);
    setShowSyncMenu(false);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSyncLoading(true);
    importUserData(file)
      .then((data) => {
        if (data.projects.length > 0) {
          const mergedProjects = mergeSyncData(projects, data);
          setProjects(mergedProjects);
          alert(`成功导入 ${data.projects.length} 个项目`);
        }
      })
      .catch((error) => {
        alert('导入失败: ' + error.message);
      })
      .finally(() => {
        setSyncLoading(false);
        setShowSyncMenu(false);
      });

    // 重置文件输入
    event.target.value = '';
  };

  const handleSyncToCloud = () => {
    setSyncLoading(true);
    try {
      syncToCloud(projects, user);
      setTimeout(() => {
        setSyncLoading(false);
        setShowSyncMenu(false);
        alert('数据已同步到云端');
      }, 1000);
    } catch (error) {
      setSyncLoading(false);
      alert('同步失败');
    }
  };

  const handleSyncFromCloud = () => {
    setSyncLoading(true);
    try {
      const cloudData = syncFromCloud();
      if (cloudData && cloudData.projects.length > 0) {
        const mergedProjects = mergeSyncData(projects, cloudData);
        setProjects(mergedProjects);
        setTimeout(() => {
          setSyncLoading(false);
          setShowSyncMenu(false);
          alert(`从云端恢复了 ${cloudData.projects.length} 个项目`);
        }, 1000);
      } else {
        setSyncLoading(false);
        alert('云端没有可恢复的数据');
      }
    } catch (error) {
      setSyncLoading(false);
      alert('云端同步失败');
    }
  };

  const isConnected = apiKey.trim().length > 0;

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/40 bg-white/50 backdrop-blur-2xl z-30 relative">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            PixelMuse AI
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 tracking-wider">
            BETA
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* AI Status Indicator */}
        <button
          onClick={() => setShowSettings(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
            isConnected
              ? 'bg-emerald-50/60 border-emerald-200/50 text-emerald-700 hover:bg-emerald-100/60'
              : 'bg-amber-50/60 border-amber-200/50 text-amber-700 hover:bg-amber-100/60'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isConnected ? 'AI 已连接' : '演示模式'}
          <Zap className="w-3 h-3" />
        </button>

        {/* ⭐ 配置按钮 — 未配置时带脉冲动画 */}
        <div className="relative">
          {!isConnected && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
            </span>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className={`glass-btn ${
              !isConnected
                ? '!bg-gradient-to-r !from-blue-500/10 !to-indigo-500/10 !border-blue-300/50 !text-blue-700 font-semibold'
                : ''
            }`}
            title="API 配置"
          >
            <Settings className="w-4 h-4" />
            <span>配置</span>
          </button>
        </div>

        <div className="w-px h-6 bg-blue-200/40 mx-0.5" />

        {/* 同步按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowSyncMenu(!showSyncMenu)}
            disabled={syncLoading}
            className="glass-btn"
            title="数据同步"
          >
            {syncLoading ? (
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <Cloud className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">同步</span>
          </button>

          {/* 同步菜单 */}
          {showSyncMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl border border-white/50 shadow-xl z-50">
              <div className="p-2">
                <button
                  onClick={handleSyncToCloud}
                  disabled={syncLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50/60 rounded-lg transition"
                >
                  <CloudUpload className="w-4 h-4" />
                  上传到云端
                </button>
                <button
                  onClick={handleSyncFromCloud}
                  disabled={syncLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50/60 rounded-lg transition"
                >
                  <CloudDownload className="w-4 h-4" />
                  从云端恢复
                </button>
                <div className="border-t border-slate-200/50 my-1" />
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50/60 rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
                <label className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50/60 rounded-lg transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  导入数据
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    disabled={syncLoading}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setHistoryTab('history');
            setShowHistory(true);
          }}
          className="glass-btn"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">历史记录</span>
        </button>
        <button
          onClick={() => {
            setHistoryTab('favorites');
            setShowHistory(true);
          }}
          className="glass-btn"
        >
          <Star className="w-4 h-4" />
          <span className="hidden sm:inline">收藏夹</span>
        </button>

        <div className="w-px h-6 bg-blue-200/40 mx-0.5" />

        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-blue-400/20">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">
            {user?.username || '用户'}
          </span>
          <button
            onClick={() => setUser(null)}
            className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/60 transition-all"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
