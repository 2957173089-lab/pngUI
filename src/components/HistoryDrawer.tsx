import { X, Clock, Star, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';
import { frameworkLabels, frameworkIcons, type Project } from '../types';

export default function HistoryDrawer() {
  const {
    showHistory, setShowHistory,
    historyTab, setHistoryTab,
    projects,
    setCurrentProject,
    setPrompt, setFramework, setImageUrl,
    setStreamingCode,
    setTabMode,
    toggleFavorite,
  } = useStore();

  if (!showHistory) return null;

  const list: Project[] =
    historyTab === 'favorites' ? projects.filter((p) => p.isFavorite) : projects;

  const loadProject = (p: Project) => {
    setCurrentProject(p);
    setPrompt(p.prompt);
    setFramework(p.framework);
    setImageUrl(p.imageUrl);
    setStreamingCode('');
    setTabMode('preview');
    setShowHistory(false);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={() => setShowHistory(false)} />

      {/* Panel */}
      <div className="drawer-panel flex flex-col bg-white/80 backdrop-blur-3xl border-l border-white/50 shadow-2xl shadow-blue-900/10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blue-100/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">我的作品</h3>
          </div>
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-100/30 px-5">
          <button
            onClick={() => setHistoryTab('history')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-all ${
              historyTab === 'history'
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            全部记录
            <span className="ml-1 text-[10px] bg-blue-100/70 text-blue-600 px-1.5 py-0.5 rounded-full">
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setHistoryTab('favorites')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-all ${
              historyTab === 'favorites'
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            我的收藏
            <span className="ml-1 text-[10px] bg-amber-100/70 text-amber-600 px-1.5 py-0.5 rounded-full">
              {projects.filter((p) => p.isFavorite).length}
            </span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-blue-50/60 flex items-center justify-center mb-4">
                {historyTab === 'favorites' ? (
                  <Star className="w-8 h-8 text-blue-300" />
                ) : (
                  <Clock className="w-8 h-8 text-blue-300" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-500">
                {historyTab === 'favorites' ? '暂无收藏' : '暂无记录'}
              </p>
              <p className="text-xs text-slate-400 mt-1">开始生成你的第一个 UI 作品吧</p>
            </div>
          ) : (
            list.map((item) => (
              <div
                key={item.id}
                onClick={() => loadProject(item)}
                className="group p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/70 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover border border-white/60 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl shadow-sm">
                      {frameworkIcons[item.framework]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate leading-snug">
                      {item.prompt || '无描述'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50/80 text-blue-600 font-medium">
                        {frameworkLabels[item.framework]}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatTime(item.createTime)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={`shrink-0 p-1.5 rounded-lg transition-all ${
                      item.isFavorite
                        ? 'text-amber-500 hover:bg-amber-50'
                        : 'text-slate-300 hover:text-amber-400 hover:bg-amber-50/50 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
