#!/usr/bin/env node

/**
 * 部署配置测试脚本
 * 验证项目配置是否正确，避免部署时出现超时等问题
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 开始检查部署配置...\n');

// 检查必要文件
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'api/generate.js',
  'vercel.json'
];

let hasError = false;

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 缺少必要文件: ${file}`);
    hasError = true;
  } else {
    console.log(`✅ 找到文件: ${file}`);
  }
}

// 检查 package.json 配置
console.log('\n📦 检查 package.json 配置...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  // 检查必要依赖
  const requiredDeps = ['react', 'vite', 'zustand'];
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep]) {
      console.log(`⚠️  缺少依赖: ${dep}`);
    }
  }

  console.log('✅ package.json 配置检查完成');
} catch (error) {
  console.log('❌ package.json 读取失败:', error.message);
  hasError = true;
}

// 检查 vercel.json 配置
console.log('\n⚙️  检查 vercel.json 配置...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

  if (!vercelConfig.functions || !vercelConfig.functions['api/generate.js']) {
    console.log('❌ vercel.json 中缺少函数配置');
    hasError = true;
  } else {
    const funcConfig = vercelConfig.functions['api/generate.js'];
    if (funcConfig.maxDuration < 60) {
      console.log('⚠️  建议增加 maxDuration 到 60 秒以上');
    } else {
      console.log('✅ 超时配置正确');
    }
  }

  console.log('✅ vercel.json 配置检查完成');
} catch (error) {
  console.log('❌ vercel.json 读取失败:', error.message);
  hasError = true;
}

// 检查 API 文件
console.log('\n🔧 检查 API 配置...');
try {
  const apiContent = fs.readFileSync('api/generate.js', 'utf8');

  if (!apiContent.includes('maxDuration: 60')) {
    console.log('⚠️  API 文件可能需要更新超时配置');
  } else {
    console.log('✅ API 超时配置正确');
  }

  if (!apiContent.includes('nodejs')) {
    console.log('⚠️  API 应该使用 Node.js Runtime 而非 Edge Runtime');
  } else {
    console.log('✅ Runtime 配置正确');
  }

  console.log('✅ API 配置检查完成');
} catch (error) {
  console.log('❌ API 文件读取失败:', error.message);
  hasError = true;
}

// 总结
console.log('\n' + '='.repeat(50));
if (hasError) {
  console.log('❌ 发现配置问题，请修复后再部署');
  process.exit(1);
} else {
  console.log('✅ 所有配置检查通过！可以安全部署');
  console.log('\n🚀 部署建议：');
  console.log('1. 在 Vercel 上导入项目');
  console.log('2. 设置 DASHSCOPE_API_KEY 环境变量');
  console.log('3. 重新部署项目');
  console.log('4. 测试连接和生成功能');
}

console.log('\n📚 详细部署指南请查看 DEPLOYMENT.md 文件');
console.log('='.repeat(50));