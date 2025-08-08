#!/usr/bin/env node

// 修复 Vite 权限问题的脚本
const fs = require('fs');
const path = require('path');

console.log('🔧 修复 Vite 权限问题...');

const viteBinPath = path.join(__dirname, 'node_modules', '.bin', 'vite');
const viteJsPath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');

// 创建一个新的 vite 脚本，直接使用 Node.js 执行
const viteScript = `#!/usr/bin/env node
require('${viteJsPath.replace(/\\/g, '/')}');
`;

try {
  // 写入新的 vite 脚本
  fs.writeFileSync(viteBinPath, viteScript, { mode: 0o755 });
  console.log('✅ Vite 权限问题已修复');
} catch (error) {
  console.log('⚠️  无法修复权限，将使用备用方案');
  console.log('错误:', error.message);
}

// 确保 vite.js 文件存在且可读
try {
  if (fs.existsSync(viteJsPath)) {
    console.log('✅ Vite.js 文件存在且可访问');
  } else {
    console.log('❌ Vite.js 文件不存在');
  }
} catch (error) {
  console.log('❌ 无法访问 Vite.js 文件:', error.message);
}

