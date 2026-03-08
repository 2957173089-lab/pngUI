import { useRef, useState, useCallback } from 'react';
import { Upload, X, ImagePlus, Wand2, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { frameworkLabels, frameworkIcons, type Framework, type Project } from '../types';
import { generateCode } from '../utils/mockAI';

const frameworks: Framework[] = ['html', 'vue3', 'react', 'uniapp'];

export default function InputPanel() {
  const {
    prompt, setPrompt,
    framework, setFramework,
    imageUrl, setImageUrl,
    isGenerating, setIsGenerating,
    setStreamingCode,
    addProject,
    setTabMode,
  } = useStore();

  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [setImageUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setStreamingCode('');
    setTabMode('preview');

    try {
      const code = await generateCode(prompt, framework, imageUrl || undefined, (partial) => {
        setStreamingCode(partial);
      });

      const project: Project = {
        id: Date.now().toString(),
        userId: 'demo-user',
        imageUrl,
        prompt,
        framework,
        generatedCode: code,
        isFavorite: false,
        createTime: Date.now(),
      };
      addProject(project);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <aside className="w-[360px] min-w-[360px] h-full flex flex-col relative z-10">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-blue-500" />
            需求控制台
          </h2>
          <p className="text-xs text-slate-400 mt-1">上传参考图 + 描述需求，AI 为你生成代码</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-2 block">参考图片</label>
          {imageUrl ? (
            <div className="relative group rounded-2xl overflow-hidden border border-white/60 shadow-sm">
              <img src={imageUrl} alt="参考图" className="w-full h-44 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
              <button
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`
                h-40 rounded-2xl border-2 border-dashed cursor-pointer
                flex flex-col items-center justify-center gap-2 transition-all
                ${dragOver
                  ? 'border-blue-400 bg-blue-50/60 scale-[1.02]'
                  : 'border-blue-200/60 bg-white/30 hover:border-blue-300 hover:bg-white/50'}
              `}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/80 flex items-center justify-center">
                {dragOver ? (
                  <Upload className="w-6 h-6 text-blue-500 animate-bounce" />
                ) : (
                  <ImagePlus className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <p className="text-xs text-slate-500">拖拽图片至此 或 <span className="text-blue-500 font-medium">点击上传</span></p>
              <p className="text-[10px] text-slate-400">支持 JPG / PNG / WebP</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {/* Prompt */}
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-2 block">需求描述</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：请帮我生成一个现代风格的后台管理系统登录页面，带玻璃拟态效果..."
            rows={5}
            className="glass-input w-full resize-none leading-relaxed"
          />
          <div className="flex justify-end mt-1">
            <span className={`text-[10px] ${prompt.length > 500 ? 'text-amber-500' : 'text-slate-400'}`}>
              {prompt.length} / 500
            </span>
          </div>
        </div>

        {/* Framework Selector */}
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-2.5 block">目标框架</label>
          <div className="grid grid-cols-2 gap-2">
            {frameworks.map((fw) => (
              <button
                key={fw}
                onClick={() => setFramework(fw)}
                className={`
                  p-3 rounded-xl text-left transition-all text-sm flex items-center gap-2.5
                  ${framework === fw
                    ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-400/40 text-blue-700 font-semibold shadow-sm'
                    : 'bg-white/35 border border-white/50 text-slate-600 hover:bg-white/55 hover:border-blue-200/50'}
                `}
              >
                <span className="text-lg">{frameworkIcons[fw]}</span>
                <span>{frameworkLabels[fw]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-5 pt-0">
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="btn-primary w-full flex items-center justify-center gap-2.5 text-base py-3.5"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI 正在生成中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>生成 UI 代码</span>
            </>
          )}
        </button>
        {isGenerating && (
          <div className="mt-3 h-1.5 rounded-full bg-blue-100/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400 rounded-full shimmer" style={{ width: '100%' }} />
          </div>
        )}
      </div>
    </aside>
  );
}
