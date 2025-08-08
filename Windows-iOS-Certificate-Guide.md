# 🖥️ Windows 系统 iOS 证书配置指南

## 🎯 Windows 用户的挑战
- 无法直接使用 Xcode
- 无法使用 macOS 钥匙串访问
- 需要替代工具生成证书签名请求 (CSR)

## 🚀 方案一：在线工具生成 CSR（最简单）

### 步骤 1：使用在线 CSR 生成器
1. 访问 [https://certificatesigningrequest.com](https://certificatesigningrequest.com)
2. 填写信息：
   ```
   Country: CN
   State: Your State
   City: Your City
   Organization: Your Name or Company
   Organizational Unit: IT Department
   Email: your-email@example.com
   Common Name: Your Name
   ```
3. 点击 "Generate CSR"
4. 下载两个文件：
   - `certificate.csr` (证书签名请求)
   - `private.key` (私钥，重要！)

### 步骤 2：在 Apple Developer 创建证书
1. 登录 [Apple Developer Console](https://developer.apple.com/account)
2. 转到 "Certificates, Identifiers & Profiles"
3. 点击 "Certificates" → "+"
4. 选择 "iOS App Development"
5. 上传刚才生成的 `certificate.csr` 文件
6. 下载证书文件 `ios_development.cer`

### 步骤 3：转换证书格式
```bash
# 使用 OpenSSL 转换（Windows 可以安装 Git Bash 获得）
openssl x509 -in ios_development.cer -inform DER -out ios_development.pem -outform PEM
openssl pkcs12 -export -out ios_development.p12 -inkey private.key -in ios_development.pem
```

## 🔧 方案二：使用 OpenSSL（Windows）

### 安装 OpenSSL
1. 下载 [Win32/Win64 OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)
2. 安装到默认路径
3. 添加到系统 PATH

### 生成 CSR
```bash
# 生成私钥
openssl genrsa -out private.key 2048

# 生成 CSR
openssl req -new -key private.key -out certificate.csr -subj "/C=CN/ST=YourState/L=YourCity/O=YourName/OU=IT/CN=YourName/emailAddress=your-email@example.com"
```

## ☁️ 方案三：使用云端服务（强烈推荐）

### Codemagic 自动管理
1. 注册 [Codemagic](https://codemagic.io)
2. 连接 GitHub 仓库
3. 配置 Apple Developer API Key
4. 让 Codemagic 自动处理所有证书

### 配置 App Store Connect API Key
1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. 转到 "用户和访问" → "密钥"
3. 创建新密钥：
   ```
   名称: Codemagic API Key
   访问权限: 开发者
   ```
4. 下载 `.p8` 文件
5. 记录 Key ID 和 Issuer ID

### 在 Codemagic 中配置
1. 项目设置 → "iOS code signing"
2. 上传 API Key 文件
3. 输入 Key ID 和 Issuer ID
4. 选择自动管理证书

## 🛠️ 方案四：使用 Windows Subsystem for Linux (WSL)

### 安装 WSL
```powershell
# 在 PowerShell 中运行
wsl --install
```

### 在 WSL 中生成 CSR
```bash
# 安装 OpenSSL
sudo apt update
sudo apt install openssl

# 生成私钥和 CSR
openssl genrsa -out private.key 2048
openssl req -new -key private.key -out certificate.csr
```

## 📱 完整的 Windows 工作流程

### 推荐流程（使用 Codemagic）
```bash
# 1. 准备项目
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 3. 在 Codemagic 中配置
# - 连接仓库
# - 配置 API Key
# - 开始构建
```

### 手动流程（如果必须）
1. **注册 Apple Developer Program** ($99/年)
2. **使用在线工具生成 CSR**
3. **在 Apple Developer 创建证书**
4. **创建 App ID 和 Provisioning Profile**
5. **配置构建工具**

## 🔐 证书文件管理

### 重要文件说明
```
private.key          # 私钥（绝对保密）
certificate.csr      # 证书签名请求
ios_development.cer  # Apple 签发的证书
ios_development.p12  # PKCS#12 格式证书（包含私钥）
profile.mobileprovision # Provisioning Profile
```

### 安全存储
- 将私钥文件备份到安全位置
- 不要将私钥提交到 Git
- 使用密码保护 .p12 文件

## ⚡ 快速开始（推荐）

### 最简单的方案
1. **跳过本地证书配置**
2. **使用 Codemagic 云构建**：
   ```
   1. 推送代码到 GitHub
   2. 连接 Codemagic
   3. 配置 Apple API Key
   4. 自动构建 iOS 应用
   ```

### 测试方案
1. **构建 Web 版本**：
   ```bash
   npm run build
   npm run preview
   ```
2. **在手机浏览器测试**
3. **添加到主屏幕体验**

## 🆘 遇到问题？

### 常见错误
- **OpenSSL 未找到**：安装 Git Bash 或 WSL
- **证书格式错误**：检查转换命令
- **私钥丢失**：重新生成 CSR 和证书

### 获取帮助
- Apple Developer 支持
- Codemagic 文档
- Stack Overflow iOS 标签

## 💡 最佳实践

1. **优先使用云服务**：避免本地复杂配置
2. **备份重要文件**：私钥和证书
3. **使用版本控制**：但排除敏感文件
4. **定期更新证书**：避免过期问题

---

**总结**：对于 Windows 用户，强烈推荐使用 Codemagic 等云服务，可以避免复杂的本地证书配置，直接获得可用的 iOS 应用。
