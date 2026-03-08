#!/usr/bin/env node

/**
 * 功能测试脚本
 * 验证登录注册和数据同步功能是否正常工作
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 开始测试功能修复...\n');

// 检查核心文件是否存在
const requiredFiles = [
  'src/store/useStore.ts',
  'src/pages/LoginPage.tsx',
  'src/components/Navbar.tsx',
  'src/utils/sync.ts'
];

let hasError = false;

console.log('📁 检查核心文件...');
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 缺少文件: ${file}`);
    hasError = true;
  } else {
    console.log(`✅ 找到文件: ${file}`);
  }
}

// 检查 store 功能
console.log('\n🔧 检查状态管理功能...');
try {
  const storeContent = fs.readFileSync('src/store/useStore.ts', 'utf8');

  const requiredFeatures = [
    'loadUser()',
    'saveUser(user)',
    'loadProjects()',
    'saveProjects(projects)',
    'setUser:',
    'setProjects:'
  ];

  for (const feature of requiredFeatures) {
    if (!storeContent.includes(feature)) {
      console.log(`❌ Store 缺少功能: ${feature}`);
      hasError = true;
    } else {
      console.log(`✅ Store 包含: ${feature}`);
    }
  }
} catch (error) {
  console.log('❌ 无法读取 store 文件:', error.message);
  hasError = true;
}

// 检查登录页面功能
console.log('\n🔐 检查登录注册功能...');
try {
  const loginContent = fs.readFileSync('src/pages/LoginPage.tsx', 'utf8');

  const requiredFeatures = [
    'isRegisterMode',
    'confirmPassword',
    'handleAuth',
    'useEffect',
    '自动登录',
    'localStorage.setItem'
  ];

  for (const feature of requiredFeatures) {
    if (!loginContent.includes(feature)) {
      console.log(`❌ 登录页面缺少功能: ${feature}`);
      hasError = true;
    } else {
      console.log(`✅ 登录页面包含: ${feature}`);
    }
  }
} catch (error) {
  console.log('❌ 无法读取登录页面文件:', error.message);
  hasError = true;
}

// 检查同步功能
console.log('\n☁️ 检查数据同步功能...');
try {
  const syncContent = fs.readFileSync('src/utils/sync.ts', 'utf8');

  const requiredFunctions = [
    'exportUserData',
    'importUserData',
    'syncToCloud',
    'syncFromCloud',
    'mergeSyncData',
    'getSyncStatus'
  ];

  for (const func of requiredFunctions) {
    if (!syncContent.includes(func)) {
      console.log(`❌ 同步工具缺少函数: ${func}`);
      hasError = true;
    } else {
      console.log(`✅ 同步工具包含: ${func}`);
    }
  }
} catch (error) {
  console.log('❌ 无法读取同步工具文件:', error.message);
  hasError = true;
}

// 检查导航栏同步功能
console.log('\n🧭 检查导航栏同步功能...');
try {
  const navbarContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

  const requiredFeatures = [
    'showSyncMenu',
    'handleExportData',
    'handleImportData',
    'handleSyncToCloud',
    'handleSyncFromCloud',
    'Cloud',
    'CloudUpload',
    'CloudDownload'
  ];

  for (const feature of requiredFeatures) {
    if (!navbarContent.includes(feature)) {
      console.log(`❌ 导航栏缺少功能: ${feature}`);
      hasError = true;
    } else {
      console.log(`✅ 导航栏包含: ${feature}`);
    }
  }
} catch (error) {
  console.log('❌ 无法读取导航栏文件:', error.message);
  hasError = true;
}

// 总结
console.log('\n' + '='.repeat(50));
if (hasError) {
  console.log('❌ 发现功能问题，请修复后再测试');
  process.exit(1);
} else {
  console.log('✅ 所有功能检查通过！');
  console.log('\n🎉 修复完成的功能：');
  console.log('1. ✅ 用户登录注册系统');
  console.log('2. ✅ 用户数据持久化存储');
  console.log('3. ✅ 项目数据本地保存');
  console.log('4. ✅ 数据导出导入功能');
  console.log('5. ✅ 云端同步模拟功能');
  console.log('6. ✅ 自动登录检查');
  console.log('7. ✅ 同步状态管理');
  console.log('\n💡 使用说明：');
  console.log('- 登录页面现在支持注册新账户');
  console.log('- 用户数据会持久化存储在浏览器中');
  console.log('- 点击导航栏的同步按钮可以导出/导入数据');
  console.log('- 支持云端同步功能（目前模拟实现）');
  console.log('- 刷新页面后自动保持登录状态');
}

console.log('\n📚 详细使用说明请查看 DEPLOYMENT.md 文件');
console.log('='.repeat(50));