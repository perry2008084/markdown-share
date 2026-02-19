# Markdown Share 📝

一个简单优雅的 Markdown 编辑器，支持实时预览和一键分享。

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node-22.22.0-green.svg)
![Express](https://img.shields.io/badge/express-5.2.1-lightgrey.svg)

## ✨ 功能特点

### 🎨 编辑器功能
- **实时预览** - 输入 Markdown 即时看到渲染效果
- **一键分享** - 生成短链接，轻松分享内容
- **内容持久化** - SQLite 数据库存储，随时访问

### 🌟 用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **暗色模式** - 一键切换明暗主题
- **触摸优化** - 双击预览区域放大/缩小字体
- **社交媒体分享** - 一键分享到微信、QQ、微博、Twitter

### 🔒 安全性
- **XSS 防护** - DOMPurify 净化 HTML
- **输入验证** - 严格的 content 检查

## 📸 预览

### 编辑器页面
- 左侧：Markdown 编辑区
- 右侧：实时预览区
- 顶部：分享按钮

### 分享页面
- 渲染后的 Markdown 内容
- 分享时间信息
- 社交媒体分享按钮

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0
- npm >= 9.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/perry2008084/markdown-share.git
cd markdown-share

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动生产服务器
npm start
```

### 配置

```bash
# 设置端口（默认 3000）
export PORT=8080

# 设置数据库路径（默认 ./data/share.db）
export DB_PATH=/path/to/database.db
```

## 📁 项目结构

```
markdown-share/
├── public/              # 静态文件
│   ├── index.html       # 编辑器页面
│   ├── share.html       # 分享页面
│   ├── app.js          # 编辑器脚本
│   ├── share.js        # 分享页面脚本
│   └── styles.css      # 样式文件
├── data/               # 数据库目录
│   └── share.db       # SQLite 数据库
├── server.js           # Express 服务器
├── package.json        # 项目配置
├── .gitignore         # Git 忽略配置
├── design.md          # 设计文档
└── README.md          # 本文件
```

## 🔌 API 接口

### POST /api/share
生成分享链接

**请求：**
```json
{
  "content": "# Hello World\n\nThis is a test."
}
```

**响应：**
```json
{
  "id": "abc123xyz",
  "url": "/s/abc123xyz"
}
```

### POST /api/preview
预览 Markdown 内容

**请求：**
```json
{
  "content": "# Hello World"
}
```

**响应：**
```json
{
  "html": "<h1>Hello World</h1>"
}
```

### GET /api/share/:id
获取分享内容

**响应：**
```json
{
  "content": "# Hello World",
  "createdAt": 1739918400000
}
```

### GET /health
健康检查

**响应：**
```json
{
  "ok": true
}
```

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 22.22.0 | 运行时 |
| Express | 5.2.1 | Web 框架 |
| SQLite | 3.x | 数据库 |
| better-sqlite3 | 12.6.2 | SQLite 驱动 |
| marked | 17.0.2 | Markdown 解析 |
| DOMPurify | 3.3.1 | XSS 防护 |
| jsdom | 28.1.0 | DOM 模拟 |
| nanoid | 5.1.6 | ID 生成 |

## 🎨 设计理念

### 响应式布局
- 桌面端：双栏布局（编辑器 + 预览）
- 移动端：单栏布局，支持触摸手势

### 主题系统
- 使用 CSS 变量管理颜色
- 支持 localStorage 持久化主题
- 一键切换明暗模式

### 性能优化
- 静态文件缓存
- 代码分割
- 按需加载

## 📱 移动端特性

### 触摸手势
- **双击预览区域** - 放大/缩小字体
- **触摸区域** - 最小 44px，符合苹果规范

### 响应式字体
- 桌面端：基础字体 16px
- 移动端：基础字体 14px
- 代码块：12px

### 社交分享
- 微信：复制链接提示
- QQ：QQ 分享组件
- 微博：微博分享 API
- Twitter：Twitter 分享 API

## 🔐 安全性

### XSS 防护
使用 DOMPurify 净化 HTML：

```javascript
const clean = DOMPurify.sanitize(raw);
```

### 输入验证
- 检查 content 是否为空
- 限制内容大小（最大 1MB）
- 验证 ID 格式（10 字符）

### HTTPS 配置
建议配置 Nginx + Let's Encrypt：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## 🚢 部署

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name markdown-share

# 设置开机自启
pm2 startup
pm2 save
```

### 使用 Docker

```bash
# 构建镜像
docker build -t markdown-share .

# 运行容器
docker run -p 3000:3000 -v ./data:/app/data markdown-share
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 性能

### 加载时间
- 首次加载：< 500ms
- 实时预览：< 50ms
- 分享生成：< 100ms

### 资源占用
- 内存：~60 MB（Node.js）
- CPU：< 1%（空闲状态）
- 磁盘：< 10 MB（数据库 + 文件）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 2 空格缩进
- 遵循 ESLint 配置
- 提交信息使用 Conventional Commits 规范

## 📝 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**perry2008084**

- GitHub: [perry2008084](https://github.com/perry2008084)

## 🙏 致谢

- [Express](https://expressjs.com/) - Web 框架
- [marked](https://marked.js.org/) - Markdown 解析器
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS 防护
- [nanoid](https://github.com/ai/nanoid) - ID 生成器

## 📧 故障排查

### 数据库错误
如果遇到 SQLite 错误：

```bash
# 检查数据库文件权限
ls -la data/

# 修复权限
chmod 600 data/share.db
chmod 700 data/
```

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### PM2 无法启动
```bash
# 重置 PM2
pm2 delete all
pm2 start server.js --name markdown-share
```

## 📞 支持

如有问题或建议，请：

- 提交 [Issue](https://github.com/perry2008084/markdown-share/issues)
- 发送邮件：perry2008084@users.noreply.github.com

---

⭐ 如果这个项目对你有帮助，请给一个 Star！
