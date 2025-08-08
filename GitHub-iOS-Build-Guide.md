# 🚀 GitHub Actions 构建 iOS 应用完整指南

## 🎯 方案优势

### 为什么选择 GitHub Actions？
- ✅ **完全免费**：每月 2000 分钟构建时间
- ✅ **无需 Mac**：使用 GitHub 提供的 macOS 环境
- ✅ **自动化**：代码推送自动触发构建
- ✅ **专业级**：支持证书管理、自动签名
- ✅ **易于配置**：YAML 配置文件

## 📋 前置准备

### 1. 必需的账户和文件
```
✅ GitHub 账户（免费）
✅ 免费 Apple ID
✅ iOS 项目代码
✅ 基本的 YAML 知识
```

### 2. 项目结构
```
your-repo/
├── .github/
│   └── workflows/
│       └── ios-build.yml
├── ios/
│   └── App/
│       └── App.xcworkspace
├── src/
├── package.json
└── capacitor.config.ts
```

## 🔧 GitHub Actions 配置

### 创建工作流文件
创建 `.github/workflows/ios-build.yml`：

```yaml
name: 🍎 iOS Build

# 触发条件
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch: # 手动触发

# 环境变量
env:
  DEVELOPER_DIR: /Applications/Xcode.app/Contents/Developer

jobs:
  build-ios:
    name: 🏗️ Build iOS App
    runs-on: macos-latest # 使用最新的 macOS 环境
    
    steps:
    # 1. 检出代码
    - name: 📥 Checkout Repository
      uses: actions/checkout@v4
      
    # 2. 设置 Node.js 环境
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    # 3. 安装依赖
    - name: 📦 Install Dependencies
      run: |
        npm ci
        npm install -g @capacitor/cli
        
    # 4. 构建 Web 应用
    - name: 🔨 Build Web App
      run: |
        npm run build
        
    # 5. 同步 Capacitor
    - name: ⚡ Sync Capacitor
      run: |
        npx cap sync ios
        
    # 6. 设置 Xcode 版本
    - name: 🛠️ Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: latest-stable
        
    # 7. 安装 iOS 依赖（如果有 CocoaPods）
    - name: 📱 Install iOS Dependencies
      run: |
        cd ios/App
        if [ -f "Podfile" ]; then
          pod install
        fi
        
    # 8. 构建 iOS 应用
    - name: 🏗️ Build iOS App
      run: |
        cd ios/App
        xcodebuild \
          -workspace App.xcworkspace \
          -scheme App \
          -configuration Release \
          -destination generic/platform=iOS \
          -archivePath App.xcarchive \
          archive
          
    # 9. 导出 IPA
    - name: 📦 Export IPA
      run: |
        cd ios/App
        xcodebuild \
          -exportArchive \
          -archivePath App.xcarchive \
          -exportPath . \
          -exportOptionsPlist ../../exportOptions.plist
          
    # 10. 上传构建产物
    - name: 📤 Upload IPA
      uses: actions/upload-artifact@v4
      with:
        name: iOS-App
        path: ios/App/*.ipa
        retention-days: 30
```

### 高级配置（带证书管理）
```yaml
name: 🍎 iOS Build with Signing

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-ios:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v4
    
    # 设置证书和配置文件
    - name: 🔐 Setup Certificates
      env:
        BUILD_CERTIFICATE_BASE64: ${{ secrets.BUILD_CERTIFICATE_BASE64 }}
        P12_PASSWORD: ${{ secrets.P12_PASSWORD }}
        BUILD_PROVISION_PROFILE_BASE64: ${{ secrets.BUILD_PROVISION_PROFILE_BASE64 }}
        KEYCHAIN_PASSWORD: ${{ secrets.KEYCHAIN_PASSWORD }}
      run: |
        # 创建变量
        CERTIFICATE_PATH=$RUNNER_TEMP/build_certificate.p12
        PP_PATH=$RUNNER_TEMP/build_pp.mobileprovision
        KEYCHAIN_PATH=$RUNNER_TEMP/app-signing.keychain-db

        # 导入证书和配置文件
        echo -n "$BUILD_CERTIFICATE_BASE64" | base64 --decode --output $CERTIFICATE_PATH
        echo -n "$BUILD_PROVISION_PROFILE_BASE64" | base64 --decode --output $PP_PATH

        # 创建临时钥匙串
        security create-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
        security set-keychain-settings -lut 21600 $KEYCHAIN_PATH
        security unlock-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH

        # 导入证书
        security import $CERTIFICATE_PATH -P "$P12_PASSWORD" -A -t cert -f pkcs12 -k $KEYCHAIN_PATH
        security list-keychain -d user -s $KEYCHAIN_PATH

        # 安装配置文件
        mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
        cp $PP_PATH ~/Library/MobileDevice/Provisioning\ Profiles
        
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: 📦 Install Dependencies
      run: |
        npm ci
        npm install -g @capacitor/cli
        
    - name: 🔨 Build Web App
      run: npm run build
      
    - name: ⚡ Sync Capacitor
      run: npx cap sync ios
      
    - name: 🏗️ Build and Archive
      run: |
        cd ios/App
        xcodebuild \
          -workspace App.xcworkspace \
          -scheme App \
          -configuration Release \
          -destination generic/platform=iOS \
          -archivePath App.xcarchive \
          archive \
          CODE_SIGN_STYLE=Manual \
          PROVISIONING_PROFILE_SPECIFIER="${{ secrets.PROVISIONING_PROFILE_SPECIFIER }}" \
          CODE_SIGN_IDENTITY="${{ secrets.CODE_SIGN_IDENTITY }}"
          
    - name: 📦 Export IPA
      run: |
        cd ios/App
        xcodebuild \
          -exportArchive \
          -archivePath App.xcarchive \
          -exportPath . \
          -exportOptionsPlist ../../exportOptions.plist
          
    - name: 📤 Upload to App Store Connect
      env:
        APP_STORE_CONNECT_USERNAME: ${{ secrets.APP_STORE_CONNECT_USERNAME }}
        APP_STORE_CONNECT_PASSWORD: ${{ secrets.APP_STORE_CONNECT_PASSWORD }}
      run: |
        cd ios/App
        xcrun altool --upload-app \
          --type ios \
          --file *.ipa \
          --username "$APP_STORE_CONNECT_USERNAME" \
          --password "$APP_STORE_CONNECT_PASSWORD"
          
    # 清理
    - name: 🧹 Clean up keychain
      if: ${{ always() }}
      run: |
        security delete-keychain $RUNNER_TEMP/app-signing.keychain-db
```

## 🔐 GitHub Secrets 配置

### 必需的 Secrets
在 GitHub 仓库设置中添加以下 Secrets：

```bash
# 基础配置
KEYCHAIN_PASSWORD=your-keychain-password

# 证书相关（如果使用付费开发者账户）
BUILD_CERTIFICATE_BASE64=<base64-encoded-p12-certificate>
P12_PASSWORD=your-p12-password
BUILD_PROVISION_PROFILE_BASE64=<base64-encoded-mobileprovision>
PROVISIONING_PROFILE_SPECIFIER=your-profile-name
CODE_SIGN_IDENTITY=iPhone Developer

# App Store Connect（如果要上传）
APP_STORE_CONNECT_USERNAME=your-apple-id
APP_STORE_CONNECT_PASSWORD=your-app-specific-password
```

### 生成 Base64 编码
```bash
# 编码证书文件
base64 -i certificate.p12 | pbcopy

# 编码配置文件
base64 -i profile.mobileprovision | pbcopy
```

## 📄 exportOptions.plist 配置

创建 `exportOptions.plist` 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    
    <key>compileBitcode</key>
    <false/>
    
    <key>uploadBitcode</key>
    <false/>
    
    <key>uploadSymbols</key>
    <true/>
    
    <key>signingStyle</key>
    <string>automatic</string>
    
    <key>destination</key>
    <string>export</string>
</dict>
</plist>
```

## 🆓 免费方案配置

### 使用免费 Apple ID 的简化配置
```yaml
name: 🍎 Free iOS Build

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-ios:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: 📦 Install Dependencies
      run: |
        npm ci
        npm install -g @capacitor/cli
        
    - name: 🔨 Build Web App
      run: npm run build
      
    - name: ⚡ Sync Capacitor
      run: npx cap sync ios
      
    # 只构建，不签名（用于检查编译错误）
    - name: 🏗️ Build iOS App (No Signing)
      run: |
        cd ios/App
        xcodebuild \
          -workspace App.xcworkspace \
          -scheme App \
          -configuration Release \
          -destination generic/platform=iOS \
          build \
          CODE_SIGN_IDENTITY="" \
          CODE_SIGNING_REQUIRED=NO \
          CODE_SIGNING_ALLOWED=NO
          
    - name: ✅ Build Success
      run: echo "iOS 应用构建成功！"
```

## 🔄 自动化触发

### 多种触发方式
```yaml
on:
  # 推送到主分支时触发
  push:
    branches: [ main, develop ]
    paths:
      - 'src/**'
      - 'ios/**'
      - 'package.json'
      
  # PR 时触发
  pull_request:
    branches: [ main ]
    
  # 定时触发（每天凌晨2点）
  schedule:
    - cron: '0 2 * * *'
    
  # 手动触发
  workflow_dispatch:
    inputs:
      build_type:
        description: '构建类型'
        required: true
        default: 'development'
        type: choice
        options:
        - development
        - release
```

## 📊 构建状态和通知

### 添加构建徽章
在 README.md 中添加：
```markdown
![iOS Build](https://github.com/username/repo/workflows/iOS%20Build/badge.svg)
```

### Slack 通知
```yaml
- name: 📢 Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#ios-builds'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 💰 成本和限制

### GitHub Actions 免费额度
```
✅ 公开仓库：无限制
✅ 私有仓库：每月 2000 分钟
✅ macOS 构建：消耗 10x 分钟数
✅ 实际可用：约 200 分钟 macOS 构建时间
```

### 优化构建时间
```yaml
# 缓存 node_modules
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# 缓存 CocoaPods
- uses: actions/cache@v3
  with:
    path: ios/App/Pods
    key: ${{ runner.os }}-pods-${{ hashFiles('**/Podfile.lock') }}
```

## 🚀 完整示例项目

### 项目结构
```
whatsapp-generator/
├── .github/
│   └── workflows/
│       ├── ios-build.yml
│       └── ios-release.yml
├── ios/
│   └── App/
├── src/
├── exportOptions.plist
├── package.json
└── README.md
```

### 快速开始脚本
```bash
#!/bin/bash
# setup-github-ios.sh

echo "🚀 设置 GitHub iOS 构建..."

# 创建工作流目录
mkdir -p .github/workflows

# 复制配置文件
cp ios-build.yml .github/workflows/

# 创建 exportOptions.plist
cat > exportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

# 提交更改
git add .
git commit -m "🍎 Add GitHub Actions iOS build"
git push

echo "✅ GitHub Actions iOS 构建配置完成！"
echo "📱 推送代码到 GitHub 即可触发构建"
```

## 🎯 最佳实践

### 1. 分支策略
```yaml
# 开发分支：只检查编译
# 主分支：完整构建和签名
# 发布分支：构建并上传到 App Store
```

### 2. 环境分离
```yaml
# 开发环境
- name: Development Build
  if: github.ref == 'refs/heads/develop'
  
# 生产环境  
- name: Production Build
  if: github.ref == 'refs/heads/main'
```

### 3. 错误处理
```yaml
- name: 🏗️ Build iOS App
  continue-on-error: false
  timeout-minutes: 30
```

---

**总结：GitHub Actions 是 Windows 用户构建 iOS 应用的最佳免费方案！** 🚀
