// ═══════════════════════════════════════════════════════════════
// CloudFlare Worker — Qwen-VL API 代理
//
// 部署步骤：
// 1. 登录 https://dash.cloudflare.com
// 2. Workers & Pages → 创建应用程序 → 创建 Worker
// 3. 粘贴此代码
// 4. 设置 → 变量 → 添加环境变量 DASHSCOPE_API_KEY
// 5. 触发器中可绑定自定义域名
//
// 前端 API 端点设为：
//   https://your-worker.your-subdomain.workers.dev/v1/chat/completions
// ═══════════════════════════════════════════════════════════════

const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com/compatible-mode';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env) {
    // ── CORS 预检 ──
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── 只允许 POST ──
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const url = new URL(request.url);
      const targetUrl = `${DASHSCOPE_BASE}${url.pathname}${url.search}`;

      // API Key：优先使用环境变量
      const apiKey = env.DASHSCOPE_API_KEY
        ? `Bearer ${env.DASHSCOPE_API_KEY}`
        : request.headers.get('Authorization');

      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: { message: '未配置 API Key' } }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await request.text();

      // ── 转发到 DashScope ──
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: body,
      });

      // ── 检测是否为流式请求 ──
      let isStream = false;
      try {
        const parsed = JSON.parse(body);
        isStream = parsed.stream === true;
      } catch {}

      if (isStream) {
        // 流式转发
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        });
      }

      // 非流式转发
      const data = await response.text();
      return new Response(data, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: { message: err.message } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};
