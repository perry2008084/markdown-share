# Markdown Share 使用说明

## 启动服务
```bash
cd /root/markdown-share
npm start
```

默认监听端口: 3000

## 使用步骤
1. 打开浏览器访问 `http://localhost:3000/`。
2. 在编辑区输入 Markdown 内容，右侧实时预览。
3. 点击“分享”按钮，生成短链接。
4. 复制链接发送给其他用户。
5. 其他用户打开链接后即可预览内容。

## API
- POST `/api/share`
  - 请求: `{ "content": "<markdown>" }`
  - 返回: `{ "id": "<short_id>", "url": "/s/<short_id>" }`
- GET `/api/share/{id}`
  - 返回: `{ "content": "<markdown>", "createdAt": 1700000000000 }`
- POST `/api/preview`
  - 请求: `{ "content": "<markdown>" }`
  - 返回: `{ "html": "<sanitized_html>" }`

## 数据持久化
- 数据库: `data/share.db`
- 表: `shares`
  - id: 短链接 ID
  - content: Markdown 原文
  - created_at, updated_at: 时间戳
