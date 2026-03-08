import { useState, useMemo, useCallback } from 'react';
import {
  Monitor, Smartphone, RefreshCw, Star, Download, Copy, Check,
  Eye, Code2, Sparkles, Loader2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { frameworkLabels } from '../types';
import { generateCode } from '../utils/mockAI';

export default function PreviewPanel() {
  const {
    currentProject,
    streamingCode,
    isGenerating,
    previewMode, setPreviewMode,
    tabMode, setTabMode,
    prompt, framework, imageUrl,
    setIsGenerating, setStreamingCode, addProject,
    toggleFavorite,
  } = useStore();

  const [copied, setCopied] = useState(false);

  const displayCode = useMemo(() => {
    if (isGenerating && streamingCode) return streamingCode;
    return currentProject?.generatedCode || '';
  }, [isGenerating, streamingCode, currentProject]);

  const handleCopy = useCallback(() => {
    if (!displayCode) return;
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [displayCode]);

  const handleRegenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setStreamingCode('');
    setTabMode('preview');
    try {
      const code = await generateCode(prompt, framework, imageUrl || undefined, (partial) => {
        setStreamingCode(partial);
      });
      addProject({
        id: Date.now().toString(),
        userId: 'demo-user',
        imageUrl,
        prompt,
        framework,
        generatedCode: code,
        isFavorite: false,
        createTime: Date.now(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!displayCode) return;
    const ext: Record<string, string> = { html: 'html', vue3: 'vue', react: 'jsx', uniapp: 'vue' };
    const fileExt = ext[currentProject?.framework || framework] || 'html';
    const blob = new Blob([displayCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ui-component.${fileExt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Empty state
  if (!displayCode && !isGenerating) {
    return (
      <main className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center max-w-md px-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100/80 to-indigo-100/80 flex items-center justify-center shadow-lg shadow-blue-200/20">
            <Sparkles className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-3">开始创作你的 UI</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            在左侧上传参考图片，描述你想要的界面效果，
            <br />AI 将为你自动生成高质量的前端代码
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              智能识图
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              实时预览
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              多框架导出
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 relative z-10">
      {/* Action Bar */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-white/30 bg-white/25 backdrop-blur-xl">
        <div className="flex items-center gap-1">
          {/* Tabs */}
          <button
            onClick={() => setTabMode('preview')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
              tabMode === 'preview'
                ? 'bg-white/60 text-blue-600 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 预览
          </button>
          <button
            onClick={() => setTabMode('code')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
              tabMode === 'code'
                ? 'bg-white/60 text-blue-600 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> 代码
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-blue-200/30 mx-2" />

          {/* Preview Mode */}
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${
              previewMode === 'desktop'
                ? 'bg-white/60 text-blue-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/30'
            }`}
            title="桌面端预览"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${
              previewMode === 'mobile'
                ? 'bg-white/60 text-blue-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/30'
            }`}
            title="移动端预览"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <span className="text-xs text-slate-400 bg-white/30 px-2.5 py-1 rounded-lg">
              {frameworkLabels[currentProject.framework]}
            </span>
          )}
          <button onClick={handleRegenerate} disabled={isGenerating} className="glass-btn">
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            重新生成
          </button>
          {currentProject && (
            <button
              onClick={() => toggleFavorite(currentProject.id)}
              className={`glass-btn ${currentProject.isFavorite ? 'text-amber-500 bg-amber-50/50' : ''}`}
            >
              <Star className={`w-3.5 h-3.5 ${currentProject.isFavorite ? 'fill-amber-400' : ''}`} />
              {currentProject.isFavorite ? '已收藏' : '收藏'}
            </button>
          )}
          <button onClick={handleDownload} className="btn-primary !py-2 !px-4 !text-sm !rounded-xl !shadow-md">
            <Download className="w-3.5 h-3.5 mr-1.5 inline" />
            下载源码
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        {tabMode === 'preview' ? (
          <div className="h-full flex items-start justify-center overflow-auto">
            <div
              className={`h-full rounded-2xl overflow-hidden border border-white/50 shadow-xl shadow-blue-500/5 bg-white transition-all duration-300 ${
                previewMode === 'mobile' ? 'w-[375px]' : 'w-full'
              }`}
            >
              {isGenerating && !streamingCode ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-slate-400 animate-pulse">AI 正在理解你的需求...</p>
                </div>
              ) : (
                <iframe
                  srcDoc={displayCode}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                  title="UI Preview"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-end mb-3 gap-2">
              <button onClick={handleCopy} className="glass-btn !text-xs">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '已复制' : '复制代码'}
              </button>
            </div>
            <div className="code-block flex-1 p-5 overflow-auto">
              {isGenerating && (
                <div className="flex items-center gap-2 mb-3 text-blue-400 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>流式输出中...</span>
                </div>
              )}
              <pre className="whitespace-pre-wrap break-all">
                <code>{displayCode}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
