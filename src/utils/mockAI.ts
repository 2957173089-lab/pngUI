import type { Framework } from '../types';

const templates: Record<string, string> = {
  login: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
body{margin:0;min-height:100vh;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);font-family:system-ui,sans-serif}
.glass{background:rgba(255,255,255,.15);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.25);border-radius:24px}
</style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">
<div class="glass p-10 w-full max-w-md shadow-2xl">
  <div class="text-center mb-8">
    <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🔐</div>
    <h1 class="text-3xl font-bold text-white mb-2">欢迎回来</h1>
    <p class="text-white/70">登录您的账户以继续</p>
  </div>
  <div class="space-y-5">
    <div>
      <label class="block text-white/90 text-sm font-medium mb-2">邮箱地址</label>
      <input type="email" placeholder="your@email.com" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition">
    </div>
    <div>
      <label class="block text-white/90 text-sm font-medium mb-2">密码</label>
      <input type="password" placeholder="••••••••" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition">
    </div>
    <div class="flex items-center justify-between text-sm">
      <label class="flex items-center text-white/70 gap-2"><input type="checkbox" class="rounded"> 记住我</label>
      <a href="#" class="text-white/90 hover:text-white transition">忘记密码？</a>
    </div>
    <button class="w-full py-3.5 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">登 录</button>
    <p class="text-center text-white/60 text-sm">还没有账户？<a href="#" class="text-white font-medium hover:underline">立即注册</a></p>
  </div>
</div>
</body>
</html>`,

  dashboard: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#f0f4ff}</style>
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
<nav class="bg-white/70 backdrop-blur-xl border-b border-white/50 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
  <div class="flex items-center gap-3"><div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">D</div><span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Dashboard</span></div>
  <div class="flex items-center gap-4"><div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">👤</div></div>
</nav>
<main class="max-w-7xl mx-auto p-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来 👋</h1>
  <p class="text-gray-500 mb-8">以下是您的业务数据概览</p>
  <div class="grid grid-cols-4 gap-6 mb-8">
    <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg shadow-blue-500/5 hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="flex items-center justify-between mb-4"><span class="text-sm text-gray-500">总收入</span><span class="text-2xl">💰</span></div>
      <p class="text-3xl font-bold text-gray-900">¥128,430</p><p class="text-sm text-emerald-600 mt-2">↑ 12.5% 较上月</p>
    </div>
    <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg shadow-blue-500/5 hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="flex items-center justify-between mb-4"><span class="text-sm text-gray-500">新增用户</span><span class="text-2xl">👥</span></div>
      <p class="text-3xl font-bold text-gray-900">2,847</p><p class="text-sm text-emerald-600 mt-2">↑ 8.2% 较上月</p>
    </div>
    <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg shadow-blue-500/5 hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="flex items-center justify-between mb-4"><span class="text-sm text-gray-500">订单量</span><span class="text-2xl">📦</span></div>
      <p class="text-3xl font-bold text-gray-900">1,024</p><p class="text-sm text-red-500 mt-2">↓ 3.1% 较上月</p>
    </div>
    <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg shadow-blue-500/5 hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="flex items-center justify-between mb-4"><span class="text-sm text-gray-500">转化率</span><span class="text-2xl">📈</span></div>
      <p class="text-3xl font-bold text-gray-900">3.24%</p><p class="text-sm text-emerald-600 mt-2">↑ 1.2% 较上月</p>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg shadow-blue-500/5">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">近期订单</h3>
      <table class="w-full"><thead><tr class="text-left text-sm text-gray-500 border-b"><th class="pb-3">订单号</th><th class="pb-3">客户</th><th class="pb-3">金额</th><th class="pb-3">状态</th></tr></thead>
      <tbody class="text-sm">
        <tr class="border-b border-gray-100"><td class="py-3">#10421</td><td>张三</td><td>¥2,340</td><td><span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">已完成</span></td></tr>
        <tr class="border-b border-gray-100"><td class="py-3">#10420</td><td>李四</td><td>¥1,890</td><td><span class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">进行中</span></td></tr>
        <tr class="border-b border-gray-100"><td class="py-3">#10419</td><td>王五</td><td>¥4,560</td><td><span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">已完成</span></td></tr>
        <tr><td class="py-3">#10418</td><td>赵六</td><td>¥890</td><td><span class="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">待处理</span></td></tr>
      </tbody></table>
    </div>
    <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg shadow-blue-500/5">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">热门产品</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">📱</div><div class="flex-1"><p class="text-sm font-medium">智能手机 Pro</p><p class="text-xs text-gray-400">销量 1,204</p></div><span class="text-sm font-semibold text-blue-600">¥4,999</span></div>
        <div class="flex items-center gap-3"><div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">💻</div><div class="flex-1"><p class="text-sm font-medium">轻薄笔记本</p><p class="text-xs text-gray-400">销量 867</p></div><span class="text-sm font-semibold text-blue-600">¥6,299</span></div>
        <div class="flex items-center gap-3"><div class="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">🎧</div><div class="flex-1"><p class="text-sm font-medium">降噪耳机</p><p class="text-xs text-gray-400">销量 2,341</p></div><span class="text-sm font-semibold text-blue-600">¥1,299</span></div>
      </div>
    </div>
  </div>
</main>
</body>
</html>`,

  ecommerce: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#fafbff}</style>
</head>
<body class="min-h-screen">
<nav class="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
  <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">ShopNow</span>
  <div class="flex items-center gap-6 text-sm text-gray-600"><a href="#" class="hover:text-blue-600 transition">首页</a><a href="#" class="hover:text-blue-600 transition">分类</a><a href="#" class="hover:text-blue-600 transition">新品</a><a href="#" class="hover:text-blue-600 transition">特惠</a></div>
  <div class="flex items-center gap-4"><button class="relative text-gray-600 hover:text-blue-600 transition text-xl">🛒<span class="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span></button></div>
</nav>
<div class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-8 overflow-hidden">
  <div class="absolute inset-0 opacity-10"><div class="absolute w-96 h-96 bg-white rounded-full -top-48 -right-24 blur-3xl"></div></div>
  <div class="max-w-6xl mx-auto relative z-10"><p class="text-blue-200 text-sm font-medium mb-3 tracking-wider">2024 冬季新品</p><h1 class="text-5xl font-bold mb-4 leading-tight">探索智能生活<br>新可能</h1><p class="text-blue-100 mb-8 max-w-md">精选全球顶级科技产品，让智能融入生活的每一刻</p><button class="px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-xl transition-all hover:-translate-y-0.5">立即探索 →</button></div>
</div>
<main class="max-w-6xl mx-auto px-8 py-12">
  <h2 class="text-2xl font-bold text-gray-900 mb-8">热门推荐</h2>
  <div class="grid grid-cols-4 gap-6">
    <div class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">📱</div>
      <div class="p-5"><p class="font-semibold text-gray-800">智能手机 Pro Max</p><p class="text-sm text-gray-400 mt-1">超感影像 · 旗舰芯片</p><div class="flex items-center justify-between mt-4"><span class="text-xl font-bold text-blue-600">¥5,999</span><button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">加入购物车</button></div></div>
    </div>
    <div class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="aspect-square bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">⌚</div>
      <div class="p-5"><p class="font-semibold text-gray-800">智能手表 Ultra</p><p class="text-sm text-gray-400 mt-1">健康监测 · 超长续航</p><div class="flex items-center justify-between mt-4"><span class="text-xl font-bold text-blue-600">¥2,499</span><button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">加入购物车</button></div></div>
    </div>
    <div class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="aspect-square bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">🎧</div>
      <div class="p-5"><p class="font-semibold text-gray-800">头戴式降噪耳机</p><p class="text-sm text-gray-400 mt-1">Hi-Res · 主动降噪</p><div class="flex items-center justify-between mt-4"><span class="text-xl font-bold text-blue-600">¥1,899</span><button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">加入购物车</button></div></div>
    </div>
    <div class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      <div class="aspect-square bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">💻</div>
      <div class="p-5"><p class="font-semibold text-gray-800">轻薄本 Air 15</p><p class="text-sm text-gray-400 mt-1">2K屏 · 高性能轻薄本</p><div class="flex items-center justify-between mt-4"><span class="text-xl font-bold text-blue-600">¥6,999</span><button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">加入购物车</button></div></div>
    </div>
  </div>
</main>
</body>
</html>`,

  landing: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>body{margin:0;font-family:system-ui,sans-serif}</style>
</head>
<body class="min-h-screen bg-white">
<nav class="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
  <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">SaaS Pro</span>
  <div class="flex items-center gap-8 text-sm text-gray-600"><a href="#" class="hover:text-blue-600 transition">产品</a><a href="#" class="hover:text-blue-600 transition">方案</a><a href="#" class="hover:text-blue-600 transition">定价</a><a href="#" class="hover:text-blue-600 transition">关于</a></div>
  <button class="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">免费试用</button>
</nav>
<section class="relative overflow-hidden py-28 text-center">
  <div class="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white"></div>
  <div class="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
  <div class="absolute top-32 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl"></div>
  <div class="relative z-10 max-w-4xl mx-auto px-4">
    <div class="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">🚀 全新 3.0 版本已发布</div>
    <h1 class="text-6xl font-bold text-gray-900 mb-6 leading-tight">让工作更高效<br><span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">让协作更简单</span></h1>
    <p class="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">全方位的团队协作平台，融合项目管理、知识库、即时通讯，助力团队效能提升 300%</p>
    <div class="flex items-center gap-4 justify-center"><button class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5">开始免费试用</button><button class="px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all">查看演示 →</button></div>
  </div>
</section>
<section class="max-w-6xl mx-auto px-8 py-20">
  <div class="text-center mb-16"><h2 class="text-3xl font-bold text-gray-900 mb-4">核心功能</h2><p class="text-gray-500">强大的功能矩阵，满足团队多样化需求</p></div>
  <div class="grid grid-cols-3 gap-8">
    <div class="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl transition-all group hover:-translate-y-1"><div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">📊</div><h3 class="text-xl font-semibold text-gray-800 mb-3">智能数据分析</h3><p class="text-gray-500 leading-relaxed">AI 驱动的数据分析引擎，自动生成可视化报表，让决策有据可依</p></div>
    <div class="p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 hover:shadow-xl transition-all group hover:-translate-y-1"><div class="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">🤝</div><h3 class="text-xl font-semibold text-gray-800 mb-3">实时协作</h3><p class="text-gray-500 leading-relaxed">多人实时编辑文档，评论、@提及、任务指派，沟通零障碍</p></div>
    <div class="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 hover:shadow-xl transition-all group hover:-translate-y-1"><div class="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">🔒</div><h3 class="text-xl font-semibold text-gray-800 mb-3">企业级安全</h3><p class="text-gray-500 leading-relaxed">端到端加密、细粒度权限管理、审计日志，全方位保护数据安全</p></div>
  </div>
</section>
</body>
</html>`,
};

function matchTemplate(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('登录') || p.includes('login') || p.includes('注册') || p.includes('sign')) return 'login';
  if (p.includes('仪表') || p.includes('dashboard') || p.includes('后台') || p.includes('管理') || p.includes('数据')) return 'dashboard';
  if (p.includes('商城') || p.includes('电商') || p.includes('商品') || p.includes('购物') || p.includes('shop')) return 'ecommerce';
  return 'landing';
}

export async function generateCode(
  prompt: string,
  _framework: Framework,
  _imageUrl?: string,
  onProgress?: (text: string) => void
): Promise<string> {
  const key = matchTemplate(prompt);
  const code = templates[key] || templates.landing;
  const chunks = [];
  const chunkSize = 80;
  for (let i = 0; i < code.length; i += chunkSize) {
    chunks.push(code.slice(i, i + chunkSize));
  }
  let accumulated = '';
  for (const chunk of chunks) {
    accumulated += chunk;
    onProgress?.(accumulated);
    await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
  }
  return code;
}
