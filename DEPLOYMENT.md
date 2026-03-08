# 🚀 PixelMuse AI — 部署上线完整指南

> 从零到上线的每一步，让你的 AI UI 生成助手真正跑起来。

---

## 📋 目录

1. [架构总览](#1-架构总览)
2. [方案一：Vercel 一键部署（推荐，最快）](#2-方案一vercel-一键部署推荐最快)
3. [方案二：CloudFlare Workers 代理](#3-方案二cloudflare-workers-代理)
4. [方案三：迁移到 Uni-app + UniCloud](#4-方案三迁移到-uni-app--unicloud)
5. [获取阿里云 API Key](#5-获取阿里云-api-key)
6. [前端配置说明](#6-前端配置说明)
7. [常见问题 FAQ](#7-常见问题-faq)
8. [成本估算](#8-成本估算)

---

## 1. 架构总览

```
┌──────────────────────────────────────────────────────────────┐
│                        用户浏览器                            │
│  ┌──────────────┐    ┌──────────────────────────────────┐   │
│  │  左侧输入面板  │    │       右侧预览/代码面板           │   │
│  │  - 上传图片    │    │  - iframe 实时预览               │   │
│  │  - 输入需求    │    │  - 代码视图 + 复制               │   │
│  │  - 选择框架    │    │  - 下载源码                      │   │
│  └──────┬───────┘    └──────────────────────────────────┘   │
│         │ HTTP POST (流式 SSE)                               │
└─────────┼────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐         ┌──────────────────────────┐
│   代理层 (选其一)     │────────▶│  阿里云百炼 DashScope    │
│                     │         │  Qwen-VL-Max API         │
│  A. Vercel Edge     │◀────────│  (流式 SSE 返回)          │
│  B. CloudFlare      │         └──────────────────────────┘
│  C. UniCloud 云函数  │
└─────────────────────┘
```

**为什么需要代理层？**
浏览器直接调用 DashScope API 会遇到 **CORS 跨域限制**，且 API Key 暴露在前端代码中不安全。代理层解决这两个问题。

---

## 2. 方案一：Vercel 一键部署（推荐，最快）

> ⏱ 预计 10 分钟完成部署

### 步骤 1：准备代码

项目中已包含 `api/generate.js`（Vercel Edge Function），无需额外编写。

```
项目根目录/
├── api/
│   └── generate.js          ← Vercel Serverless Function (已提供)
├── src/                     ← 前端源码
├── index.html
├── package.json
└── vite.config.ts
```

### 步骤 2：推送到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
# 在 github.com 上创建新仓库后：
git remote add origin https://github.com/你的用户名/pixelmuse-ai.git
git push -u origin main
```

### 步骤 3：部署到 Vercel

1. 访问 [vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 点击 **「Import Project」** → 选择刚推送的仓库
3. **Framework Preset** 选择 `Vite`
4. 点击 **「Deploy」**

### 步骤 4：配置环境变量

部署成功后：

1. 进入 Vercel 项目页面 → **Settings** → **Environment Variables**
2. 添加变量：
   | Name | Value |
   |------|-------|
   | `DASHSCOPE_API_KEY` | `sk-你的API密钥` |
3. 点击 **Save**
4. 回到 **Deployments** → 点击 **Redeploy**（重新部署以使环境变量生效）

### 步骤 5：前端配置

打开部署好的网站，在顶部导航栏点击 **「配置」** 按钮：

- **API Key**：留空（由服务端环境变量提供，更安全）
  - 或者也可以填写 Key，由客户端直接传递
- **API 端点**：选择 **「Vercel 代理」** → 自动填写 `/api/generate`
- **模型**：选择 `Qwen-VL-Max`
- 点击 **「测试连接」** → 显示绿色 ✅ 即成功
- 点击 **「保存配置」**

### 🎉 完成！

你的 AI UI 生成助手已上线！访问 `https://你的项目名.vercel.app` 即可使用。

---

## 3. 方案二：CloudFlare Workers 代理

> 适合已有 CloudFlare 账号的用户，全球 CDN 加速

### 步骤 1：创建 Worker

1. 登录 [CloudFlare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Workers & Pages** → **创建应用程序** → **创建 Worker**
3. 给 Worker 起个名字（如 `qwen-proxy`）
4. 点击 **「部署」**

### 步骤 2：编辑代码

1. 点击 **「编辑代码」**
2. 删除默认代码，粘贴 `docs/cloudflare-worker.js` 的内容
3. 点击 **「保存并部署」**

### 步骤 3：配置环境变量

1. 回到 Worker 页面 → **设置** → **变量和机密**
2. 添加变量：`DASHSCOPE_API_KEY` = `sk-你的密钥`
3. 保存

### 步骤 4：前端配置

在网站的设置面板中：
- **API 端点** 填写：`https://qwen-proxy.你的子域名.workers.dev/v1/chat/completions`

### 步骤 5：部署前端

前端静态文件可部署到任何静态托管平台：
- CloudFlare Pages（免费）
- GitHub Pages
- Netlify
- 任意 CDN / OSS

```bash
# 构建前端
npm run build

# dist/ 目录下就是构建产物，上传到你选择的托管平台即可
```

---

## 4. 方案三：迁移到 Uni-app + UniCloud

> 完全按照 PRD 原方案，适合需要多端（H5+小程序+App）的场景

### 4.1 创建 Uni-app 项目

```bash
# 方式一：使用 HBuilderX（推荐）
# 下载 HBuilderX → 文件 → 新建 → 项目 → uni-app → Vue3

# 方式二：使用 CLI
npx degit dcloudio/uni-preset-vue#vite-ts my-project
cd my-project
npm install
```

### 4.2 项目结构

```
pixelmuse-uniapp/
├── pages/
│   ├── login/
│   │   └── login.vue              ← 登录页（复用现有 LoginPage 的逻辑）
│   └── workspace/
│       └── workspace.vue          ← 工作台主页
│
├── components/
│   ├── Navbar.vue
│   ├── InputPanel.vue
│   ├── PreviewPanel.vue
│   └── HistoryDrawer.vue
│
├── uniCloud-aliyun/               ← UniCloud 后端
│   ├── cloudfunctions/
│   │   └── generate-ui/           ← AI 生成云函数
│   │       ├── index.js           ← 见 docs/unicloud-function.js
│   │       └── package.json
│   │
│   └── database/
│       └── ui-projects.schema.json ← 数据库表结构
│
├── pages.json                      ← 路由配置
├── manifest.json                   ← 应用配置
└── App.vue
```

### 4.3 配置 UniCloud

1. **HBuilderX** → 右键 `uniCloud-aliyun` → **关联云服务空间**
2. 如果没有，点击 **新建云服务空间**，选择 **阿里云** + **按量计费**
3. 右键 `cloudfunctions/generate-ui` → **上传部署**
4. 右键 `database/ui-projects.schema.json` → **上传 Schema**

### 4.4 前端调用云函数

```vue
<script setup>
// Uni-app 中调用云函数
async function handleGenerate() {
  const res = await uniCloud.callFunction({
    name: 'generate-ui',
    data: {
      prompt: prompt.value,
      imageUrl: imageUrl.value,
      framework: framework.value,
    },
  });

  if (res.result.code === 0) {
    generatedCode.value = res.result.data.generatedCode;
  } else {
    uni.showToast({ title: res.result.message, icon: 'none' });
  }
}
</script>
```

### 4.5 图片上传到云存储

```javascript
// 选择图片并上传到 UniCloud 云存储
uni.chooseImage({
  count: 1,
  success: async (res) => {
    const tempPath = res.tempFilePaths[0];
    const uploadRes = await uniCloud.uploadFile({
      filePath: tempPath,
      cloudPath: `ref-images/${Date.now()}.jpg`,
    });
    imageUrl.value = uploadRes.fileID;
    // fileID 可以直接用于云函数中的图片访问
  },
});
```

### 4.6 部署

```bash
# HBuilderX 中：
# 发行 → 网站-H5 → 构建

# 或 CLI：
npm run build:h5

# 构建产物在 dist/build/h5 目录
# 上传到任意静态服务器或 UniCloud 前端托管
```

在 HBuilderX 中可以直接使用 **前端网页托管**（右键 uniCloud → 前端网页托管），一键上传到 CDN。

---

## 5. 获取阿里云 API Key

### 5.1 注册阿里云账号

1. 访问 [阿里云官网](https://www.aliyun.com)，注册账号
2. 完成实名认证（个人即可）

### 5.2 开通百炼平台

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 首次进入会引导你开通服务，按提示操作即可
3. 🎁 **新用户福利**：通常赠送 100万+ 免费 Token

### 5.3 创建 API Key

1. 进入百炼控制台
2. 右上角点击 **小人图标** → **API-KEY 管理**
3. 点击 **「创建新的 API-KEY」**
4. 选择 **「全部」** 或创建对应的应用
5. 复制生成的 Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
6. ⚠️ **请妥善保管，不要泄露**

### 5.4 可用模型列表

| 模型名 | 类型 | 图片理解 | 价格（每百万Token） | 推荐场景 |
|--------|------|---------|-------------------|---------|
| `qwen-vl-max` | 多模态 | ✅ 最强 | ¥20 输入 / ¥20 输出 | 有参考图时 |
| `qwen-vl-plus` | 多模态 | ✅ 良好 | ¥8 输入 / ¥8 输出 | 性价比之选 |
| `qwen-max` | 纯文本 | ❌ | ¥20 输入 / ¥60 输出 | 无图片时 |
| `qwen-plus` | 纯文本 | ❌ | ¥4 输入 / ¥12 输出 | 简单页面 |
| `qwen-turbo` | 纯文本 | ❌ | ¥2 输入 / ¥6 输出 | 最快速度 |

> 💡 单次生成约消耗 2000-8000 Token，**一次生成成本约 ¥0.02 - ¥0.10**

---

## 6. 前端配置说明

### 6.1 应用内配置

登录后点击顶部导航栏的 **⚙️ 配置** 按钮：

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| API Key | 你的 DashScope API Key | `sk-xxxx...` |
| API 端点 | 代理服务地址 | `/api/generate` (Vercel) |
| 模型选择 | AI 模型 | `qwen-vl-max` |

### 6.2 数据存储

- API Key 存储在浏览器的 `localStorage` 中
- **不会上传到任何服务器**
- 清除浏览器数据会导致配置丢失
- 使用 Vercel 方案时，Key 可配置在服务端环境变量中（更安全）

### 6.3 多部署方案对比

| 特性 | Vercel (推荐) | CloudFlare | UniCloud |
|------|:---:|:---:|:---:|
| 部署难度 | ⭐ 最简单 | ⭐⭐ 简单 | ⭐⭐⭐ 需要 HBuilderX |
| 费用 | 免费额度充足 | 免费 10万次/天 | 按量计费（极低） |
| 流式响应 | ✅ Edge Runtime | ✅ 原生支持 | ⚠️ 需要 SSE 方案 |
| 全球加速 | ✅ | ✅ 最好 | ❌ 仅国内 |
| 自定义域名 | ✅ | ✅ | ✅ |
| 多端支持 | 仅 Web | 仅 Web | ✅ H5/小程序/App |

---

## 7. 超时问题解决方案

### FUNCTION_INVOCATION_TIMEOUT 错误

**问题描述**：部署后运行时出现 `FUNCTION_INVOCATION_TIMEOUT` 错误，特别是在 Vercel 上。

**根本原因**：
1. Vercel Edge Functions 默认 30 秒超时限制
2. Qwen-VL 模型生成复杂 UI 代码通常需要 30-60 秒
3. 网络延迟和 API 响应时间叠加

**解决方案**：

#### 1. 已应用的修复措施

项目已更新以下配置来解决超时问题：

**vercel.json** (新增文件)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/generate.js",
      "use": "@vercel/node"
    }
  ],
  "functions": {
    "api/generate.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

**api/generate.js 更新**：
- 从 `Edge Runtime` 切换到 `Node.js Runtime`
- 设置 60 秒最大执行时间
- 增加 45 秒 API 请求超时控制
- 优化错误处理和超时提示

**前端超时处理**：
- 增加 50 秒前端请求超时
- 完善的超时错误提示
- 流式响应中断处理

#### 2. 部署后验证

1. **重新部署**：在 Vercel 仪表板点击 Redeploy
2. **测试连接**：在应用设置中点击 "Test Connection"
3. **性能测试**：上传图片生成 UI，观察是否仍然超时

#### 3. 如果仍然超时

**优化建议**：
- **简化提示词**：使用更简洁明确的需求描述
- **减小图片尺寸**：上传 1024x1024 以下的图片
- **选择更快模型**：使用 `qwen-vl-plus` 替代 `qwen-vl-max`
- **分步生成**：先生成基础框架，再逐步完善

**高级配置**：
```json
// vercel.json - 进一步增加超时限制
{
  "functions": {
    "api/generate.js": {
      "memory": 2048,
      "maxDuration": 90
    }
  }
}
```

> ⚠️ Vercel Pro 账户支持最长 90 秒超时，Hobby 账户最长 60 秒

## 8. 常见问题 FAQ

### Q1：测试连接时报 "Failed to fetch"？

**原因**：浏览器 CORS 跨域限制。

**解决**：不能直接连 DashScope，必须通过代理：
- Vercel：`/api/generate`
- CloudFlare：你的 Worker URL

### Q2：生成很慢 / 超时？

**原因**：大模型生成长 HTML 需要较长时间（10-30秒）。

**解决**：
- 项目已使用 **SSE 流式输出**，用户可以实时看到生成进度
- 如果使用 UniCloud 云函数，注意超时设置（建议 120 秒）
- 选择较快的模型如 `qwen-turbo` 可以加速

### Q3：生成的代码质量不好？

**建议**：
- 提供清晰的参考图（截图比照片效果好）
- 详细描述需求，包括颜色、风格、布局
- 示例提示词：`请生成一个后台管理系统的登录页面，使用蓝色渐变背景，玻璃拟态卡片居中，包含用户名密码输入框和登录按钮，风格现代简约`

### Q4：如何自定义域名？

**Vercel**：Settings → Domains → 添加域名 → 按提示配置 DNS

**CloudFlare**：Workers → 触发器 → 添加自定义域

### Q5：API Key 安全吗？

- **前端模式**：Key 存在 localStorage 中，适合个人/内部使用
- **Vercel 模式**：Key 存在服务端环境变量中，前端无感知，更安全（推荐）
- **UniCloud 模式**：Key 存在云函数中，前端完全不接触

---

## 8. 成本估算

### 5 人团队月度成本（假设每人每天生成 5 次）

| 项目 | 计算 | 月费用 |
|------|------|--------|
| Qwen-VL-Plus Token | 5人 × 5次/天 × 30天 × 5000 Token × ¥0.008/千Token | ≈ ¥30 |
| Vercel 托管 | 免费额度（Hobby Plan） | ¥0 |
| 域名（可选） | .com 域名 | ≈ ¥60/年 |
| **月总计** | | **≈ ¥30-35** |

> 💡 如果使用新用户免费 Token，前几个月成本为 **¥0**！

---

## 🏁 快速启动检查清单

- [ ] 注册阿里云账号并完成实名认证
- [ ] 开通百炼平台，获取 API Key
- [ ] 将代码推送到 GitHub
- [ ] 在 Vercel 上导入并部署
- [ ] 在 Vercel 设置环境变量 `DASHSCOPE_API_KEY`
- [ ] 打开网站，点击「配置」→ 选择 Vercel 代理端点
- [ ] 测试连接 → 生成第一个 UI！
- [ ] 分享给团队成员 🎉

---

*如有问题，请参考 [阿里云百炼文档](https://help.aliyun.com/zh/model-studio/) 或 [Vercel 文档](https://vercel.com/docs)*
