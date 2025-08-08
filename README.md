# WhatsApp聊天记录生成器

一个离线版的WhatsApp聊天记录生成器，可以创建和编辑聊天记录，支持文本、图片和文件消息。

## 功能特性

- 🎨 **真实的WhatsApp界面** - 完全模拟WhatsApp的UI设计
- 💬 **多种消息类型** - 支持文本、图片和文件消息
- 🖼️ **图片支持** - 可以上传自定义图片或使用默认图片
- 📁 **文件消息** - 支持生成文件类型的消息
- 📤 **导出功能** - 可以将聊天记录导出为JSON格式
- 🎲 **随机生成** - 一键生成随机聊天记录
- 📱 **响应式设计** - 支持桌面和移动设备

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 使用方法

### 基本操作

1. **生成示例聊天** - 点击"生成示例聊天"按钮快速创建示例对话
2. **添加消息** - 在右侧面板中选择消息类型并输入内容
3. **随机生成** - 点击"生成随机消息"按钮快速添加随机消息
4. **导出记录** - 点击"导出聊天记录"按钮下载JSON文件

### 消息类型

- **文本消息** - 普通的文字消息
- **图片消息** - 可以添加图片URL和说明文字
- **文件消息** - 可以设置文件名和大小

### 图片支持

你可以：
- 提供自己的图片URL
- 使用默认图片（需要替换`public/default-image.jpg`）
- 将图片文件放在`public`目录下并引用

## 项目结构

```
src/
├── components/          # React组件
│   ├── ChatHeader.tsx  # 聊天头部
│   ├── ChatContainer.tsx # 聊天容器
│   ├── ChatMessage.tsx # 消息组件
│   └── MessageGenerator.tsx # 消息生成器
├── types.ts            # TypeScript类型定义
├── App.tsx            # 主应用组件
├── App.css            # 应用样式
└── main.tsx          # 应用入口
```

## 自定义配置

### 更换头像和图片

1. 将你的图片文件放在`public`目录下
2. 在代码中更新图片路径
3. 或者直接在应用中输入图片URL

### 修改联系人信息

在`src/App.tsx`中修改`contact`对象：

```typescript
const [contact] = useState<Contact>({
  id: '1',
  name: '你的联系人姓名',
  avatar: '/your-avatar.jpg',
  status: 'online',
});
```

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Lucide React** - 图标库
- **date-fns** - 日期处理

## 许可证

MIT License 