import type { Framework } from '../types';
import { generateCode as mockGenerate } from './mockAI';

// ═══════════════════════════════════════════════════════════════
// Qwen-VL 真实 API 调用模块
// 支持阿里云百炼平台 (DashScope) OpenAI 兼容接口
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `你是一位顶级的前端 UI 工程师。根据用户提供的参考图片和文字描述，生成一个完整的、可直接在浏览器中运行的 HTML 页面。

## 严格输出要求：
1. 输出必须是 **完整的 HTML 文件**，以 <!DOCTYPE html> 开头，以 </html> 结尾
2. 在 <head> 中必须包含 <script src="https://cdn.tailwindcss.com"><\/script>
3. 所有样式通过 Tailwind CSS 类名或内联 <style> 标签实现
4. 页面必须美观、现代、专业，有良好的间距、配色和排版
5. 页面必须是响应式的，在桌面和移动端都能良好展示
6. 不要输出任何解释文字、markdown 标记或代码块标记（如 \`\`\`），只输出纯 HTML 代码
7. 如果用户需要图标，使用 emoji 替代
8. 如果用户需要图片占位，使用渐变色块或 SVG 图形替代
9. 确保所有中文正确显示，charset 设为 UTF-8`;

function buildUserMessage(prompt: string, framework: Framework, imageUrl?: string) {
  const frameworkHints: Record<Framework, string> = {
    html: '请生成纯 HTML + Tailwind CSS 代码。',
    vue3: '请生成纯 HTML + Tailwind CSS 的预览代码（后续我会转为 Vue 3 组件）。',
    react: '请生成纯 HTML + Tailwind CSS 的预览代码（后续我会转为 React JSX 组件）。',
    uniapp: '请生成纯 HTML + Tailwind CSS 的预览代码（后续我会转为 Uni-app 页面）。',
  };

  const textContent = `${frameworkHints[framework]}\n\n用户需求：${prompt}`;

  // 如果有图片，构建多模态消息
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return [
      { type: 'image_url', image_url: { url: imageUrl } },
      { type: 'text', text: textContent },
    ];
  }

  // 如果图片是 base64 data URL
  if (imageUrl && imageUrl.startsWith('data:image/')) {
    return [
      { type: 'image_url', image_url: { url: imageUrl } },
      { type: 'text', text: textContent },
    ];
  }

  return textContent;
}

/**
 * 从 AI 返回文本中提取 HTML 代码
 */
function extractHTML(text: string): string {
  // 如果返回的文本被 markdown 代码块包裹，提取其中的内容
  const codeBlockMatch = text.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // 如果已经以 <!DOCTYPE 或 <html 开头，直接返回
  const trimmed = text.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<HTML')) {
    return trimmed;
  }

  // 尝试找到 HTML 文档部分
  const htmlMatch = text.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
  if (htmlMatch) {
    return htmlMatch[1];
  }

  // 实在没有匹配到，返回原文
  return trimmed;
}

/**
 * 通过真实 API 调用 Qwen-VL 生成代码
 * 支持 SSE 流式返回
 */
export async function generateCodeReal(
  prompt: string,
  framework: Framework,
  imageUrl: string | undefined,
  apiKey: string,
  apiEndpoint: string,
  modelName: string,
  onProgress?: (text: string) => void
): Promise<string> {
  const userContent = buildUserMessage(prompt, framework, imageUrl);

  const requestBody = {
    model: modelName,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    stream: true,
    max_tokens: 16384,
    temperature: 0.7,
    top_p: 0.9,
  };

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    let errorMsg = `API 请求失败 (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson?.error?.message || errorJson?.message || errorMsg;
    } catch {
      if (errorText.length < 200) errorMsg = errorText;
    }
    throw new Error(errorMsg);
  }

  // ─── 处理 SSE 流式响应 ───
  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

        if (trimmedLine.startsWith('data: ')) {
          const jsonStr = trimmedLine.slice(6);
          try {
            const json = JSON.parse(jsonStr);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              onProgress?.(extractHTML(accumulated));
            }
          } catch {
            // JSON 解析失败，跳过此行
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return extractHTML(accumulated);
}

// ═══════════════════════════════════════════════════════════════
// 统一入口：根据是否配置 API Key 自动选择真实/模拟
// ═══════════════════════════════════════════════════════════════

export interface GenerateOptions {
  prompt: string;
  framework: Framework;
  imageUrl?: string;
  apiKey?: string;
  apiEndpoint?: string;
  modelName?: string;
  onProgress?: (text: string) => void;
}

export async function generateCode(options: GenerateOptions): Promise<string> {
  const {
    prompt,
    framework,
    imageUrl,
    apiKey,
    apiEndpoint,
    modelName,
    onProgress,
  } = options;

  // 如果配置了 API Key，使用真实 API
  if (apiKey && apiKey.trim().length > 0 && apiEndpoint) {
    return generateCodeReal(
      prompt,
      framework,
      imageUrl,
      apiKey.trim(),
      apiEndpoint,
      modelName || 'qwen-vl-max',
      onProgress
    );
  }

  // 否则使用 mock
  return mockGenerate(prompt, framework, imageUrl, onProgress);
}
