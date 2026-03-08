// ═══════════════════════════════════════════════════════════════
// UniCloud 云函数 — generate-ui
//
// 文件位置：uniCloud-aliyun/cloudfunctions/generate-ui/index.js
//
// 功能：
// 1. 接收前端传来的 prompt + imageUrl + framework
// 2. 调用阿里云百炼 Qwen-VL API
// 3. 将生成结果存入 ui-projects 数据库表
// 4. 返回生成的代码给前端
//
// 部署：在 HBuilderX 中右键此云函数 → 上传部署
// ═══════════════════════════════════════════════════════════════

'use strict';

const DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ⚠️ 请在 UniCloud 云函数配置中设置环境变量，或直接替换此处
// 强烈建议使用环境变量，不要硬编码 API Key
const API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-your-api-key-here';

const SYSTEM_PROMPT = `你是一位顶级的前端 UI 工程师。根据用户提供的参考图片和文字描述，生成一个完整的、可直接在浏览器中运行的 HTML 页面。

## 严格输出要求：
1. 输出必须是完整的 HTML 文件，以 <!DOCTYPE html> 开头，以 </html> 结尾
2. 在 <head> 中必须包含 <script src="https://cdn.tailwindcss.com"><\/script>
3. 所有样式通过 Tailwind CSS 类名或内联 <style> 标签实现
4. 页面必须美观、现代、专业
5. 不要输出任何解释文字或 markdown 标记，只输出纯 HTML 代码
6. 如果需要图标用 emoji 替代
7. 确保 charset 为 UTF-8`;

exports.main = async (event, context) => {
  const { prompt, imageUrl, framework } = event;
  
  // ── 参数校验 ──
  if (!prompt || !prompt.trim()) {
    return { code: 400, message: '请输入需求描述' };
  }

  // ── 获取用户信息（需要配合 uni-id 使用）──
  // const { uid } = context.auth || {};
  // if (!uid) return { code: 401, message: '请先登录' };

  try {
    // ── 构建消息 ──
    const frameworkHints = {
      html: '请生成纯 HTML + Tailwind CSS 代码。',
      vue3: '请生成纯 HTML + Tailwind CSS 的预览代码。',
      react: '请生成纯 HTML + Tailwind CSS 的预览代码。',
      uniapp: '请生成纯 HTML + Tailwind CSS 的预览代码。',
    };

    let userContent;
    const textContent = `${frameworkHints[framework] || frameworkHints.html}\n\n用户需求：${prompt}`;

    if (imageUrl && imageUrl.startsWith('http')) {
      // 多模态请求（图 + 文）
      userContent = [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: textContent },
      ];
    } else {
      // 纯文本请求
      userContent = textContent;
    }

    // ── 调用 DashScope API ──
    // 注意：云函数中使用 uniCloud.httpclient 发起 HTTP 请求
    const res = await uniCloud.httpclient.request(DASHSCOPE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      data: {
        model: imageUrl ? 'qwen-vl-max' : 'qwen-max',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        max_tokens: 16384,
        temperature: 0.7,
        // 云函数中不建议用流式，因为云函数有执行时间限制
        // 如需流式，建议使用 uni-push 或 WebSocket 方案
        stream: false,
      },
      // 超时设置：大模型生成可能较慢，建议设长一些
      timeout: 120000, // 120 秒
      dataType: 'json',
      contentType: 'json',
    });

    if (res.status !== 200) {
      console.error('DashScope API Error:', res.status, res.data);
      return {
        code: 500,
        message: `AI 接口返回错误: ${res.status}`,
      };
    }

    const generatedCode = res.data?.choices?.[0]?.message?.content || '';

    // ── 提取 HTML 代码 ──
    let cleanCode = generatedCode;
    const codeBlockMatch = generatedCode.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      cleanCode = codeBlockMatch[1].trim();
    }

    // ── 存入数据库 ──
    const db = uniCloud.database();
    const collection = db.collection('ui-projects');
    
    const projectData = {
      // user_id: uid,  // 取消注释以关联用户
      user_id: 'anonymous',
      image_url: imageUrl || '',
      prompt: prompt,
      framework: framework || 'html',
      generated_code: cleanCode,
      is_favorite: false,
      create_time: Date.now(),
    };

    const insertRes = await collection.add(projectData);

    return {
      code: 0,
      message: 'success',
      data: {
        id: insertRes.id,
        generatedCode: cleanCode,
        ...projectData,
      },
    };

  } catch (error) {
    console.error('Cloud Function Error:', error);
    return {
      code: 500,
      message: `生成失败: ${error.message || '未知错误'}`,
    };
  }
};


// ═══════════════════════════════════════════════════════════════
// package.json (放在同级目录)
// ═══════════════════════════════════════════════════════════════
/*
{
  "name": "generate-ui",
  "version": "1.0.0",
  "description": "AI UI 代码生成云函数",
  "main": "index.js",
  "dependencies": {}
}
*/

// ═══════════════════════════════════════════════════════════════
// 数据库 Schema (ui-projects.schema.json)
// 放在 uniCloud-aliyun/database/ 目录下
// ═══════════════════════════════════════════════════════════════
/*
{
  "bsonType": "object",
  "required": ["user_id", "prompt"],
  "permission": {
    "read": "auth.uid == doc.user_id",
    "create": "auth.uid != null",
    "update": "auth.uid == doc.user_id",
    "delete": "auth.uid == doc.user_id"
  },
  "properties": {
    "_id": { "description": "记录 ID" },
    "user_id": {
      "bsonType": "string",
      "description": "用户 ID",
      "foreignKey": "uni-id-users._id"
    },
    "image_url": {
      "bsonType": "string",
      "description": "参考图片 URL",
      "trim": "both"
    },
    "prompt": {
      "bsonType": "string",
      "description": "用户提示词",
      "trim": "both"
    },
    "framework": {
      "bsonType": "string",
      "description": "目标框架",
      "enum": ["html", "vue3", "react", "uniapp"]
    },
    "generated_code": {
      "bsonType": "string",
      "description": "AI 生成的代码"
    },
    "is_favorite": {
      "bsonType": "bool",
      "description": "是否收藏",
      "defaultValue": false
    },
    "create_time": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
*/
