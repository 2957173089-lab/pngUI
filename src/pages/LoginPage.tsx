import { useState, useEffect } from 'react';
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2, Zap, Shield, Code2, UserPlus, LogIn } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const setUser = useStore((s) => s.setUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleAuth = async () => {
    if (!username.trim()) { setError('请输入用户名'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
      if (password.length < 6) {
        setError('密码长度至少6位');
        return;
      }
    }

    setError('');
    setLoading(true);

    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, 1200));

    // 保存用户信息到本地存储
    const userData = {
      id: 'user-' + Date.now(),
      username: username.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.trim()}`,
    };

    setUser(userData);
    setLoading(false);

    // 保存用户凭据到本地存储（用于自动登录）
    localStorage.setItem('pm_user_credentials', JSON.stringify({
      username: username.trim(),
      password: password // 注意：实际项目中应该加密存储
    }));
  };

  // 自动登录检查
  useEffect(() => {
    const checkAutoLogin = () => {
      try {
        const savedCredentials = localStorage.getItem('pm_user_credentials');
        const savedUser = localStorage.getItem('pm_user');

        if (savedCredentials && savedUser) {
          const credentials = JSON.parse(savedCredentials);
          const user = JSON.parse(savedUser);

          // 如果保存的用户名和凭据匹配，自动登录
          if (credentials.username === user.username) {
            setUser(user);
          }
        }
      } catch (error) {
        console.error('自动登录失败:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkAutoLogin();
  }, [setUser]);

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: '智能识图', desc: '上传参考图，AI 秒懂你的设计意图' },
    { icon: <Code2 className="w-5 h-5" />, title: '多框架导出', desc: '支持 Vue / React / Uni-app 源码输出' },
    { icon: <Shield className="w-5 h-5" />, title: '云端同步', desc: '所有生成记录安全存储在云端' },
  ];

  return (
    <div className="bg-login flex items-center justify-center min-h-screen">
      {/* Floating orbs */}
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="orb-3" />

      <div className="relative z-10 flex w-full max-w-[960px] mx-4">
        {/* Left: Brand Section */}
        <div className="hidden lg:flex flex-col justify-center w-[440px] pr-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                PixelMuse AI
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 leading-tight mb-4">
              让 AI 成为你的
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                专属 UI 设计师
              </span>
            </h1>
            <p className="text-base text-slate-500 leading-relaxed">
              上传参考图片，描述需求，即刻获得精美的前端代码。
              <br />支持多框架导出，让创意即刻落地。
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 transition-all hover:bg-white/45"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15 flex items-center justify-center text-blue-600">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">{f.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[400px] p-8 glass-card-strong">
            {isInitialLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">正在检查登录状态...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="lg:hidden inline-flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      PixelMuse AI
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1.5">
                    {isRegisterMode ? '创建账户 🚀' : '欢迎回来 👋'}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {isRegisterMode ? '注册以开始你的创作之旅' : '登录以继续你的创作'}
                  </p>
                </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="输入用户名"
                  className="glass-input w-full"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">密码</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                    placeholder="输入密码"
                    className="glass-input w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">确认密码</label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                    placeholder="再次输入密码"
                    className="glass-input w-full"
                  />
                </div>
              )}

              {error && (
                <div className="text-sm text-red-500 bg-red-50/60 border border-red-200/40 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleAuth}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isRegisterMode ? '注册中...' : '登录中...'}
                  </>
                ) : (
                  <>
                    {isRegisterMode ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        注册账户
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        登录
                      </>
                    )}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setIsRegisterMode(false);
                    setError('');
                    setConfirmPassword('');
                  }}
                  className={`text-xs transition ${!isRegisterMode ? 'text-blue-600 font-medium' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  登录
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => {
                    setIsRegisterMode(true);
                    setError('');
                    setConfirmPassword('');
                  }}
                  className={`text-xs transition ${isRegisterMode ? 'text-blue-600 font-medium' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  注册
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-2">
                演示版本 · 数据本地存储，支持自动同步
              </p>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
