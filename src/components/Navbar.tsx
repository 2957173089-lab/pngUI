import { History, Star, LogOut, Sparkles, Settings, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const user = useStore((s) => s.user);
  const apiKey = useStore((s) => s.apiKey);
  const setUser = useStore((s) => s.setUser);
  const setShowHistory = useStore((s) => s.setShowHistory);
  const setHistoryTab = useStore((s) => s.setHistoryTab);
  const setShowSettings = useStore((s) => s.setShowSettings);

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
