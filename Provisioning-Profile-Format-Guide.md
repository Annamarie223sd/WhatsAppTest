# 📄 iOS 预配配置文件格式完整指南

## 🎯 文件基本信息

### 文件扩展名
```
.mobileprovision
```

### 文件类型
```
CMS (Cryptographic Message Syntax) 签名的 plist 文件
实际内容: XML 格式
编码: Base64 + 数字签名
```

### 文件大小
```
通常: 5-15 KB
包含设备多时: 可达 50+ KB
```

## 🔍 文件内部结构

### 查看文件内容
```bash
# 在 macOS 上解码查看内容
security cms -D -i "YourApp.mobileprovision"

# 或者使用 openssl
openssl smime -inform der -verify -noverify -in "YourApp.mobileprovision"
```

### 主要字段结构
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- 应用标识符 -->
    <key>AppIDName</key>
    <string>WhatsApp Chat Generator</string>
    
    <!-- Bundle ID -->
    <key>ApplicationIdentifierPrefix</key>
    <array>
        <string>TEAM123456</string>
    </array>
    
    <!-- 创建日期 -->
    <key>CreationDate</key>
    <date>2024-01-15T10:30:00Z</date>
    
    <!-- 过期日期 -->
    <key>ExpirationDate</key>
    <date>2025-01-15T10:30:00Z</date>
    
    <!-- 配置文件名称 -->
    <key>Name</key>
    <string>iOS Team Provisioning Profile: com.yourname.whatsapp</string>
    
    <!-- 平台 -->
    <key>Platform</key>
    <array>
        <string>iOS</string>
    </array>
    
    <!-- 团队标识符 -->
    <key>TeamIdentifier</key>
    <array>
        <string>TEAM123456</string>
    </array>
    
    <!-- 团队名称 -->
    <key>TeamName</key>
    <string>Your Name</string>
    
    <!-- 配置文件类型 -->
    <key>ProvisionsAllDevices</key>
    <false/>
    
    <!-- 允许的设备列表 -->
    <key>ProvisionedDevices</key>
    <array>
        <string>00008030-001234567890123A</string>
        <string>00008030-001234567890123B</string>
    </array>
    
    <!-- 开发者证书 -->
    <key>DeveloperCertificates</key>
    <array>
        <data>
        MIIFmTCCBIGgAwIBAgIIcesuoK...
        </data>
    </array>
    
    <!-- 应用权限 -->
    <key>Entitlements</key>
    <dict>
        <key>application-identifier</key>
        <string>TEAM123456.com.yourname.whatsapp</string>
        
        <key>com.apple.developer.team-identifier</key>
        <string>TEAM123456</string>
        
        <key>get-task-allow</key>
        <true/>
        
        <key>keychain-access-groups</key>
        <array>
            <string>TEAM123456.*</string>
        </array>
    </dict>
    
    <!-- UUID -->
    <key>UUID</key>
    <string>12345678-1234-1234-1234-123456789012</string>
    
    <!-- 版本 -->
    <key>Version</key>
    <integer>1</integer>
</dict>
</plist>
```

## 📱 不同类型的配置文件

### 1. 开发配置文件 (Development)
```
文件名格式: iOS_Team_Provisioning_Profile_com_yourname_app.mobileprovision
特点:
- get-task-allow: true (允许调试)
- 包含特定设备 UDID
- 有效期: 1年
```

### 2. 分发配置文件 (Distribution)
```
文件名格式: AppStore_com_yourname_app.mobileprovision
特点:
- get-task-allow: false (不允许调试)
- ProvisionsAllDevices: true
- 用于 App Store 发布
```

### 3. Ad Hoc 配置文件
```
文件名格式: AdHoc_com_yourname_app.mobileprovision
特点:
- get-task-allow: false
- 包含特定设备列表
- 用于内部分发
```

### 4. 企业配置文件 (Enterprise)
```
文件名格式: InHouse_com_yourname_app.mobileprovision
特点:
- ProvisionsAllDevices: true
- 无设备数量限制
- 需要企业开发者账户
```

## 🔧 文件操作工具

### 查看配置文件信息
```bash
# 方法1: 使用 security 命令
security cms -D -i "profile.mobileprovision" | plutil -p -

# 方法2: 提取特定信息
security cms -D -i "profile.mobileprovision" | grep -A1 "ExpirationDate"

# 方法3: 查看 UUID
security cms -D -i "profile.mobileprovision" | grep -A1 "UUID"
```

### 验证配置文件
```bash
# 检查签名有效性
security cms -D -i "profile.mobileprovision" > /dev/null && echo "有效" || echo "无效"

# 检查过期时间
security cms -D -i "profile.mobileprovision" | grep ExpirationDate
```

### 批量处理脚本
```bash
#!/bin/bash
# 批量检查配置文件

PROFILE_DIR="$HOME/Library/MobileDevice/Provisioning Profiles"

for profile in "$PROFILE_DIR"/*.mobileprovision; do
    echo "=== $(basename "$profile") ==="
    
    # 提取基本信息
    INFO=$(security cms -D -i "$profile")
    
    # 显示名称
    echo "名称: $(echo "$INFO" | grep -A1 "Name" | tail -1 | sed 's/.*<string>\(.*\)<\/string>.*/\1/')"
    
    # 显示过期时间
    echo "过期: $(echo "$INFO" | grep -A1 "ExpirationDate" | tail -1 | sed 's/.*<date>\(.*\)<\/date>.*/\1/')"
    
    # 显示 Bundle ID
    echo "Bundle ID: $(echo "$INFO" | grep -A1 "application-identifier" | tail -1 | sed 's/.*<string>.*\.\(.*\)<\/string>.*/\1/')"
    
    echo ""
done
```

## 📂 文件存储位置

### macOS 系统位置
```bash
# 用户配置文件
~/Library/MobileDevice/Provisioning Profiles/

# 系统配置文件
/Library/MobileDevice/Provisioning Profiles/
```

### Xcode 项目位置
```bash
# 项目嵌入的配置文件
YourProject.xcodeproj/project.pbxproj

# 构建产物中的配置文件
Build/Products/Debug-iphoneos/YourApp.app/embedded.mobileprovision
```

### Windows 位置（如果使用虚拟机）
```
虚拟机内的 macOS:
/Users/username/Library/MobileDevice/Provisioning Profiles/
```

## 🔍 文件内容解析

### 关键字段说明
```xml
<!-- 应用唯一标识 -->
<key>application-identifier</key>
<string>TEAMID.com.yourname.app</string>

<!-- 调试权限（开发版为 true，发布版为 false） -->
<key>get-task-allow</key>
<true/>

<!-- 钥匙串访问组 -->
<key>keychain-access-groups</key>
<array>
    <string>TEAMID.*</string>
</array>

<!-- 推送通知权限 -->
<key>aps-environment</key>
<string>development</string>

<!-- 关联域名 -->
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:yourwebsite.com</string>
</array>
```

### 设备信息格式
```xml
<key>ProvisionedDevices</key>
<array>
    <!-- iPhone UDID 格式 -->
    <string>00008030-001A2B3C4D5E6F7G</string>
    <!-- iPad UDID 格式 -->
    <string>00008103-001A2B3C4D5E6F7G</string>
</array>
```

## 🛠️ 创建自定义工具

### Python 解析脚本
```python
#!/usr/bin/env python3
import subprocess
import plistlib
import sys

def parse_mobileprovision(file_path):
    # 解码配置文件
    cmd = ['security', 'cms', '-D', '-i', file_path]
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"错误: 无法解析 {file_path}")
        return None
    
    # 解析 plist
    plist_data = plistlib.loads(result.stdout.encode())
    
    return {
        'name': plist_data.get('Name', '未知'),
        'bundle_id': plist_data.get('Entitlements', {}).get('application-identifier', '未知'),
        'expiration': plist_data.get('ExpirationDate', '未知'),
        'devices': len(plist_data.get('ProvisionedDevices', [])),
        'uuid': plist_data.get('UUID', '未知')
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("用法: python3 parse_profile.py profile.mobileprovision")
        sys.exit(1)
    
    info = parse_mobileprovision(sys.argv[1])
    if info:
        print(f"名称: {info['name']}")
        print(f"Bundle ID: {info['bundle_id']}")
        print(f"过期时间: {info['expiration']}")
        print(f"设备数量: {info['devices']}")
        print(f"UUID: {info['uuid']}")
```

## 🚨 常见格式问题

### 问题1: 文件损坏
```bash
错误: "Could not decode mobileprovision"

解决方案:
1. 重新下载配置文件
2. 检查文件完整性
3. 确认文件未被修改
```

### 问题2: 格式不正确
```bash
错误: "Invalid provisioning profile format"

解决方案:
1. 确认文件扩展名为 .mobileprovision
2. 检查文件是否为二进制格式
3. 验证文件签名
```

### 问题3: 编码问题
```bash
错误: "Unable to parse plist"

解决方案:
1. 使用正确的解码工具
2. 检查文件编码格式
3. 确认 XML 结构完整
```

## 💡 最佳实践

### 文件命名规范
```
开发: Dev_AppName_YYYYMMDD.mobileprovision
分发: Dist_AppName_YYYYMMDD.mobileprovision
测试: AdHoc_AppName_YYYYMMDD.mobileprovision
```

### 版本控制
```bash
# 不要将配置文件提交到代码库
echo "*.mobileprovision" >> .gitignore

# 但可以提交配置文件的信息
echo "profile_info.json" # 包含配置文件元数据
```

### 自动化管理
```bash
# 使用脚本自动检查和更新
#!/bin/bash
find ~/Library/MobileDevice/Provisioning\ Profiles/ -name "*.mobileprovision" -mtime +30 -exec echo "配置文件即将过期: {}" \;
```

---

**总结：预配配置文件是 `.mobileprovision` 格式的加密 XML 文件，包含应用的完整授权信息！** 🔐
