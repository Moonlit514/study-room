# 🏫 在线自习室

一个实时多人在线自习室，支持屏幕共享，国内可直接访问。

## 技术栈

- **后端**: Node.js + Express + Socket.IO（实时通信）
- **屏幕共享**: WebRTC（P2P，服务器仅做信令转发）
- **部署**: Zeabur（国内可直连）

## 功能

- ✅ 无需注册，直接查看自习室成员
- ✅ 点击「开始自习」后填写昵称和任务
- ✅ 实时显示所有成员的昵称、任务、专注时长
- ✅ 可选择共享自己的屏幕
- ✅ 点击成员卡片查看其详情和屏幕（如果对方共享）
- ✅ 随时退出自习室

---

## 部署到 Zeabur（推荐，国内可访问）

### 方法一：GitHub 自动部署

1. 将项目推送到你的 GitHub 仓库
2. 前往 [https://zeabur.com](https://zeabur.com) 注册/登录
3. 创建新项目 → 「Deploy Service」→ 选择「GitHub」
4. 选择你的仓库，Zeabur 会自动识别 Node.js 项目
5. 部署完成后，点击「Generate Domain」获取域名
6. 分享该域名给你的朋友即可使用 ✨

### 方法二：本地运行测试

```bash
npm install
npm start
# 访问 http://localhost:3000
```

---

## 项目结构

```
studyroom/
├── server.js          # Node.js 后端（Socket.IO + Express）
├── package.json       # 依赖配置
├── zbpack.json        # Zeabur 部署配置
└── public/
    └── index.html     # 前端页面（单文件，含所有 CSS/JS）
```

---

## 注意事项

- 屏幕共享基于 WebRTC，需要 HTTPS 环境（Zeabur 自动提供 HTTPS）
- 本地测试时，localhost 也支持屏幕共享
- 服务器仅存储运行时数据，重启后数据清空
