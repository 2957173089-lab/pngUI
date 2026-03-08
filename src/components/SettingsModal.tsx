import { useState, useEffect } from 'react';
import {
  X, Settings, Key, Globe, Cpu, Eye, EyeOff, CheckCircle2,
  AlertCircle, Loader2, HelpCircle, ExternalLink, Zap, Server
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: Props) {
  const { apiKey, apiEndpoint, modelName, setApiKey, setApiEndpoint, setModelName } = useStore();

  const [localKey, setLocalKey] = useState(apiKey);
  const [localEndpoint, setLocalEndpoint] = useState(apiEndpoint);
  const [localModel, setLocalModel] = useState(modelName);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMsg, setTestMsg] = useState('');
  const [activeGuide, setActiveGuide] = useState<'dashscope' | 'vercel' | 'cloudflare' | null>(null);

  useEffect(() => {
    if (open) {
      setLocalKey(apiKey);
      setLocalEndpoint(apiEndpoint);
      setLocalModel(modelName);
      setTestResult(null);
      setTestMsg('');
    }
  }, [open, apiKey, apiEndpoint, modelName]);

  const handleSave = () => {
    setApiKey(localKey);
    setApiEndpoint(localEndpoint);
    setModelName(localModel);
    onClose();
  };

  const handleTest = async () => {
    if (!localKey.trim()) {
      setTestResult('error');
      setTestMsg('请先填写 API Key');
      return;
    }
    setTesting(true);
    setTestResult(null);
    setTestMsg('');

    try {
      const res = await fetch(localEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localKey.trim()}`,
        },
        body: JSON.stringify({
          model: localModel,
          messages: [{ role: 'user', content: '你好，请简单回复"连接成功"两个字' }],
          max_tokens: 20,
        }),
      });

      if (res.ok) {
        setTestResult('success');
        setTestMsg('🎉 连接成功！API 配置正确，可以正常使用');
      } else {
        const err = await res.text().catch(() => '');
        let msg = `HTTP ${res.status}`;
        try {
          const j = JSON.parse(err);
          msg = j?.error?.message || j?.message || msg;
        } catch {
          if (err.length < 150) msg = err;
        }
        setTestResult('error');
        setTestMsg(`连接失败：${msg}`);
      }
    } catch (e: unknown) {
      setTestResult('error');
      const errMsg = e instanceof Error ? e.message : '未知错误';
      if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
        setTestMsg('网络错误：请检查 API 端点地址是否正确，或是否存在 CORS 跨域限制。如果直连 DashScope，需要通过代理服务转发。');
      } else {
        setTestMsg(`连接失败：${errMsg}`);
      }
    } finally {
      setTesting(false);
    }
  };

  const presetEndpoints = [
    {
      label: 'DashScope 直连',
      value: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      desc: '需要配合代理使用（存在 CORS 限制）',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: 'Vercel 代理',
      value: '/api/generate',
      desc: '通过 Vercel Serverless Functions 转发（推荐）',
      icon: <Server className="w-4 h-4" />,
    },
  ];

  const presetModels = [
    { label: 'Qwen-VL-Max（推荐）', value: 'qwen-vl-max', desc: '最强多模态能力' },
    { label: 'Qwen-VL-Plus', value: 'qwen-vl-plus', desc: '性价比之选' },
    { label: 'Qwen-Max', value: 'qwen-max', desc: '纯文本，无图片理解' },
    { label: 'Qwen-Turbo', value: 'qwen-turbo', desc: '最快响应速度' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[720px] max-h-[88vh] mx-4 overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10"
        style={{ animation: 'modalSlideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-blue-100/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">AI 接口配置</h2>
              <p className="text-xs text-slate-400">配置 Qwen-VL API 以启用真实 AI 生成能力</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100/60 hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(88vh-140px)] px-7 py-6 space-y-6">

          {/* ⭐ 快速开始提示（仅在未配置时显示） */}
          {!apiKey.trim() && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/[0.08] via-indigo-500/[0.05] to-violet-500/[0.08] border border-blue-200/40">
              <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                🚀 三步快速配置
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">1</span>
                  <div>
                    <p className="font-semibold text-slate-700">获取 Key</p>
                    <p className="text-slate-400 mt-0.5">在阿里云百炼平台创建 API Key</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">2</span>
                  <div>
                    <p className="font-semibold text-slate-700">填入下方</p>
                    <p className="text-slate-400 mt-0.5">将 API Key 粘贴到下方输入框</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">3</span>
                  <div>
                    <p className="font-semibold text-slate-700">保存使用</p>
                    <p className="text-slate-400 mt-0.5">点击保存，返回工作台即可使用</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Key className="w-4 h-4 text-blue-500" />
              API Key
              <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={localKey}
                onChange={(e) => { setLocalKey(e.target.value); setTestResult(null); }}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="glass-input w-full pr-20 font-mono text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <button
                onClick={() => setActiveGuide(activeGuide === 'dashscope' ? null : 'dashscope')}
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition"
              >
                如何获取 API Key？
              </button>
            </div>
            {activeGuide === 'dashscope' && (
              <div className="mt-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100/60 text-sm text-slate-600 space-y-2">
                <p className="font-semibold text-blue-700 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  获取阿里云百炼 API Key 步骤：
                </p>
                <ol className="list-decimal list-inside space-y-1.5 ml-1 text-xs leading-relaxed">
                  <li>
                    访问{' '}
                    <a
                      href="https://bailian.console.aliyun.com/"
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 underline inline-flex items-center gap-0.5"
                    >
                      阿里云百炼平台 <ExternalLink className="w-3 h-3" />
                    </a>
                    ，注册/登录阿里云账号
                  </li>
                  <li>进入控制台，点击右上角 → <strong>API-KEY 管理</strong></li>
                  <li>点击 <strong>「创建 API Key」</strong>，复制生成的 Key（格式为 sk-xxx...）</li>
                  <li>新注册用户通常赠送 <strong>100万+ 免费 Token</strong>，足够大量使用</li>
                  <li>将 Key 粘贴到上方输入框即可</li>
                </ol>
                <p className="text-xs text-amber-600 bg-amber-50/80 p-2 rounded-xl mt-2">
                  ⚠️ 注意：浏览器直连 DashScope API 会遇到 CORS 限制，建议配合 Vercel / CloudFlare Workers 代理使用。详见下方「API 端点」配置。
                </p>
              </div>
            )}
          </div>

          {/* API Endpoint */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Globe className="w-4 h-4 text-blue-500" />
              API 端点
            </label>
            <input
              type="text"
              value={localEndpoint}
              onChange={(e) => { setLocalEndpoint(e.target.value); setTestResult(null); }}
              placeholder="https://your-proxy.vercel.app/api/generate"
              className="glass-input w-full font-mono text-sm"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {presetEndpoints.map((ep) => (
                <button
                  key={ep.value}
                  onClick={() => { setLocalEndpoint(ep.value); setTestResult(null); }}
                  className={`p-3 rounded-xl text-left transition-all text-xs border ${
                    localEndpoint === ep.value
                      ? 'bg-blue-50/70 border-blue-300/50 text-blue-700'
                      : 'bg-white/30 border-white/50 text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold mb-0.5">
                    {ep.icon} {ep.label}
                  </div>
                  <p className="text-slate-400 text-[10px]">{ep.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setActiveGuide(activeGuide === 'vercel' ? null : 'vercel')}
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition"
              >
                📖 Vercel 代理部署教程
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setActiveGuide(activeGuide === 'cloudflare' ? null : 'cloudflare')}
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition"
              >
                📖 CloudFlare Workers 教程
              </button>
            </div>

            {activeGuide === 'vercel' && (
              <div className="mt-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/60 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-emerald-700">🚀 Vercel Serverless 代理部署：</p>
                <ol className="list-decimal list-inside space-y-1 ml-1 leading-relaxed">
                  <li>将项目推送到 GitHub 仓库</li>
                  <li>在项目根目录创建 <code className="bg-emerald-100/80 px-1 py-0.5 rounded">api/generate.js</code> 文件（项目中已提供模板）</li>
                  <li>登录 <a href="https://vercel.com" target="_blank" rel="noopener" className="text-emerald-600 underline">vercel.com</a>，导入该 GitHub 仓库</li>
                  <li>在 Vercel 项目设置 → Environment Variables 中添加 <code className="bg-emerald-100/80 px-1 py-0.5 rounded">DASHSCOPE_API_KEY</code></li>
                  <li>部署完成后，API 端点选择上方 <strong>「Vercel 代理」</strong>（即 <code className="bg-emerald-100/80 px-1 py-0.5 rounded">/api/generate</code>）</li>
                  <li>此时 API Key 输入框可填写你的 Key，或留空（由 Vercel 环境变量提供，更安全）</li>
                </ol>
              </div>
            )}

            {activeGuide === 'cloudflare' && (
              <div className="mt-3 p-4 rounded-2xl bg-orange-50/60 border border-orange-100/60 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-orange-700">⚡ CloudFlare Workers 代理部署：</p>
                <ol className="list-decimal list-inside space-y-1 ml-1 leading-relaxed">
                  <li>登录 <a href="https://dash.cloudflare.com" target="_blank" rel="noopener" className="text-orange-600 underline">CloudFlare Dashboard</a></li>
                  <li>进入 Workers & Pages → 创建 Worker</li>
                  <li>粘贴 <code className="bg-orange-100/80 px-1 py-0.5 rounded">docs/cloudflare-worker.js</code> 中的代码</li>
                  <li>在 Worker 设置中添加环境变量 <code className="bg-orange-100/80 px-1 py-0.5 rounded">DASHSCOPE_API_KEY</code></li>
                  <li>绑定自定义域名或使用 Workers 默认域名</li>
                  <li>API 端点填写 <code className="bg-orange-100/80 px-1 py-0.5 rounded">https://your-worker.your-subdomain.workers.dev/v1/chat/completions</code></li>
                </ol>
              </div>
            )}
          </div>

          {/* Model Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              模型选择
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetModels.map((m) => (
                <button
                  key={m.value}
                  onClick={() => { setLocalModel(m.value); setTestResult(null); }}
                  className={`p-3 rounded-xl text-left transition-all text-xs border ${
                    localModel === m.value
                      ? 'bg-blue-50/70 border-blue-300/50 text-blue-700'
                      : 'bg-white/30 border-white/50 text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <div className="font-semibold">{m.label}</div>
                  <p className="text-slate-400 text-[10px] mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={testing}
              className="glass-btn !text-sm !py-2.5 !px-5"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  测试连接
                </>
              )}
            </button>
            {testResult && (
              <div
                className={`flex-1 flex items-start gap-2 p-3 rounded-xl text-xs ${
                  testResult === 'success'
                    ? 'bg-emerald-50/60 text-emerald-700 border border-emerald-200/50'
                    : 'bg-red-50/60 text-red-700 border border-red-200/50'
                }`}
              >
                {testResult === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{testMsg}</span>
              </div>
            )}
          </div>

          {/* Info Box */}
          {!localKey.trim() && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border border-blue-100/50">
              <p className="text-xs text-slate-500 leading-relaxed">
                💡 <strong>提示：</strong>未配置 API Key 时，系统将使用内置的模板演示模式。配置后即可体验真实的 AI 生成能力。
                你的 API Key 仅存储在浏览器本地（localStorage），不会上传到任何服务器。
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-blue-100/40 bg-white/30">
          <p className="text-[10px] text-slate-400">
            配置存储于浏览器本地，安全可靠
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="glass-btn !py-2.5 !px-6">
              {apiKey.trim() ? '取消' : '跳过，先体验演示'}
            </button>
            <button onClick={handleSave} className="btn-primary !py-2.5 !px-6 !text-sm !rounded-xl">
              保存配置
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
