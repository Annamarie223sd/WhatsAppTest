# 🚀 Codemagic iOS 构建指南（无需证书）

## 为什么选择 Codemagic？
✅ **免费额度**：每月 500 分钟免费构建时间  
✅ **无需证书**：可以构建未签名的 IPA  
✅ **简单配置**：几分钟即可完成设置  
✅ **支持 Capacitor**：原生支持您的项目类型  

## 🔧 设置步骤

### 步骤 1：准备 Git 仓库
```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit for iOS build"

# 推送到 GitHub
# 在 GitHub 上创建新仓库，然后：
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 步骤 2：连接 Codemagic
1. 访问 [https://codemagic.io](https://codemagic.io)
2. 点击 "Sign up with GitHub"
3. 授权 Codemagic 访问您的仓库
4. 选择您的 WhatsApp 项目仓库

### 步骤 3：配置构建
1. 选择 **"Capacitor App"** 模板
2. 配置构建设置：
   ```yaml
   # 自动检测到的配置
   Build for: iOS
   Xcode version: Latest
   Node.js version: 18
   ```

### 步骤 4：开始构建
1. 点击 "Start new build"
2. 选择分支（通常是 main）
3. 等待构建完成（约 10-15 分钟）

### 步骤 5：下载 IPA
1. 构建完成后，点击 "Artifacts"
2. 下载 `.ipa` 文件
3. 可以通过 TestFlight 或直接安装测试

## 📱 安装方式

### 方式 1：通过 TestFlight（推荐）
- 需要 Apple Developer 账户
- 可以分享给其他用户测试

### 方式 2：直接安装（开发测试）
- 使用 Xcode 或第三方工具
- 仅限个人设备测试

## 💰 费用说明
- **免费额度**：每月 500 分钟
- **付费计划**：$28/月起（如需更多构建时间）
- **无需 Apple Developer 账户**（仅用于构建）

## 🔧 高级配置（可选）

### 自定义构建脚本
```yaml
# codemagic.yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 60
    environment:
      node: 18
      xcode: latest
    scripts:
      - name: Install dependencies
        script: npm install
      - name: Build web app
        script: npm run build
      - name: Sync Capacitor
        script: npx cap sync ios
    artifacts:
      - ios/build/**/*.ipa
```

## ⚠️ 注意事项
1. **未签名 IPA**：构建的应用未经苹果签名
2. **测试用途**：主要用于开发和内部测试
3. **分发限制**：无法直接上架 App Store

## 🎯 下一步
1. 创建 GitHub 仓库
2. 推送代码
3. 连接 Codemagic
4. 开始构建
5. 下载测试
