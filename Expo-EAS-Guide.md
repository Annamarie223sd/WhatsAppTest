# 📱 使用 Expo EAS Build 构建 iOS

## 🎯 为什么选择 EAS Build？
✅ **免费额度**：每月免费构建  
✅ **无需 Mac**：云端构建  
✅ **简单配置**：一条命令完成  
✅ **支持 Capacitor**：可以构建原生应用  

## 🔧 快速设置

### 步骤 1：安装 EAS CLI
```bash
npm install -g @expo/cli eas-cli
```

### 步骤 2：登录 Expo
```bash
npx expo login
```

### 步骤 3：初始化 EAS
```bash
eas build:configure
```

### 步骤 4：构建 iOS
```bash
# 构建开发版本（无需证书）
eas build --platform ios --profile development

# 或构建预览版本
eas build --platform ios --profile preview
```

## 📋 配置文件 (eas.json)
```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

## 💰 费用
- **免费额度**：每月有限制
- **付费计划**：$29/月起
- **无需 Apple Developer**（开发构建）
