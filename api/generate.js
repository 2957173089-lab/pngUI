// ═══════════════════════════════════════════════════════════════
// Vercel Serverless Function — Qwen-VL API 代理
// 文件位置：项目根目录 /api/generate.js
// 部署到 Vercel 后，前端请求 /api/generate 即可
// ═══════════════════════════════════════════════════════════════

export const config = {
  // 使用 Edge Runtime 以支持流式响应
  runtime: 'edge',
};

const DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export default async function handler(req) {
  // ── CORS 预检 ──
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();

    // API Key 优先级：
    // 1. 服务端环境变量（更安全，推荐）
    // 2. 客户端传递的 Authorization header（开发调试用）
    const serverApiKey = process.env.DASHSCOPE_API_KEY;
    const clientAuth = req.headers.get('Authorization');
    const apiKey = serverApiKey ? `Bearer ${serverApiKey}` : clientAuth;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: '未配置 API Key。请在 Vercel 环境变量中设置 DASHSCOPE_API_KEY' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 转发请求到 DashScope ──
    const response = await fetch(DASHSCOPE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
      },
      body: JSON.stringify(body),
    });

    // ── 流式转发 ──
    if (body.stream) {
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // ── 非流式返回 ──
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: `代理服务器错误: ${error.message}` } }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
