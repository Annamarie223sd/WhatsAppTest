#!/usr/bin/env node

// 备用构建脚本 - 直接使用 Node.js 执行 Vite
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 开始构建应用...');

// 直接使用 Node.js 执行 Vite
const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const buildProcess = spawn('node', [vitePath, 'build'], {
  stdio: 'inherit',
  cwd: __dirname
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ 构建成功完成！');
    process.exit(0);
  } else {
    console.error('❌ 构建失败，退出码:', code);
    process.exit(code);
  }
});

buildProcess.on('error', (err) => {
  console.error('❌ 构建过程出错:', err);
  process.exit(1);
});
