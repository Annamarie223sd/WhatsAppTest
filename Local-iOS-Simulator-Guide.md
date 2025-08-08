# 📱 本地 iOS 模拟器测试指南

## 🎯 适用场景
- 快速测试应用功能
- 无需真机设备
- 无需 Apple Developer 账户
- 无需 iOS 证书

## 🔧 使用 iOS 模拟器网站

### 方案 1：Appetize.io（推荐）
1. 访问 [https://appetize.io](https://appetize.io)
2. 上传您的 `.app` 文件或 `.ipa` 文件
3. 在浏览器中直接运行 iOS 模拟器
4. **免费额度**：每月 100 分钟

### 方案 2：BrowserStack
1. 访问 [https://www.browserstack.com](https://www.browserstack.com)
2. 选择 iOS 设备测试
3. 上传应用进行测试
4. **免费试用**：有限时间

### 方案 3：Sauce Labs
1. 访问 [https://saucelabs.com](https://saucelabs.com)
2. 使用真实设备云测试
3. 支持 iOS 模拟器和真机

## 🚀 构建用于模拟器的应用

### 使用 Capacitor 构建模拟器版本
```bash
# 构建 Web 应用
npm run build

# 同步到 iOS
npx cap sync ios

# 如果有 macOS，可以直接打开 Xcode
npx cap open ios
```

### 生成 .app 文件（用于模拟器）
在 Xcode 中：
1. 选择 iOS Simulator 作为目标
2. Product → Build
3. 在 Products 文件夹中找到 .app 文件

## 📱 Web 版本测试（最简单）

### 直接在浏览器中测试
```bash
# 启动开发服务器
npm run dev

# 或预览构建版本
npm run preview
```

### 移动端浏览器测试
1. 在手机浏览器中打开应用
2. 添加到主屏幕
3. 体验类似原生应用的效果

## 🔧 PWA 配置（推荐）

### 添加 PWA 支持
```bash
npm install vite-plugin-pwa
```

### 配置 vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'WhatsApp Chat Generator',
        short_name: 'WhatsApp',
        description: 'WhatsApp离线版聊天记录生成器',
        theme_color: '#128c7e',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🎯 推荐流程
1. **先测试 Web 版本**：确保功能正常
2. **使用 Appetize.io**：在线 iOS 模拟器测试
3. **如需真机测试**：使用 Codemagic 构建
4. **最终发布**：考虑 Apple Developer 账户

## 💡 优势
- **无需证书**：完全免费测试
- **快速迭代**：即时查看效果
- **跨平台**：同时支持 iOS 和 Android
- **易于分享**：发送链接即可测试
