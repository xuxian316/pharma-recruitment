# 部署指南

## 方案1：Vercel 部署（推荐）

最简单快速的部署方式：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel（如果没有账号会引导注册）
vercel login

# 3. 部署
vercel

# 按照提示操作即可
```

## 方案2：传统服务器部署

### 前置要求
- Node.js 18+ 
- PM2（进程管理器）
- Nginx（反向代理）

### 部署步骤

1. **上传文件到服务器**
```bash
# 使用 scp 上传（替换为您的服务器信息）
scp -r ./* user@your-server:/path/to/app

# 或使用 Git
git clone your-repo-url
```

2. **在服务器上安装依赖**
```bash
cd /path/to/app
npm install
```

3. **构建项目**
```bash
npm run build
```

4. **使用 PM2 启动**
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "pharma-recruitment" -- start

# 保存 PM2 配置
pm2 save
pm2 startup
```

5. **配置 Nginx**
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
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 方案3：Docker 部署

1. **构建 Docker 镜像**
```bash
docker build -t pharma-recruitment .
```

2. **运行容器**
```bash
docker run -p 3000:3000 -d --name pharma-app pharma-recruitment
```

3. **使用 Docker Compose**（可选）
创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

运行：
```bash
docker-compose up -d
```

## 方案4：云平台部署

### Railway
```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录并部署
railway login
railway up
```

### Render
1. 连接 GitHub 仓库
2. 选择 Web Service
3. 自动部署

## 环境变量配置

如需配置环境变量，创建 `.env.production` 文件：
```env
# 示例
NEXT_PUBLIC_API_URL=https://your-api.com
```

## 注意事项

1. **数据持久化**：当前项目数据存储在文件系统，部署时注意：
   - 使用数据库替代文件存储
   - 或配置持久化存储卷

2. **文件上传**：确保服务器有写入权限
   ```bash
   chmod -R 755 /path/to/app
   ```

3. **性能优化**：
   - 启用 Nginx 缓存
   - 配置 CDN
   - 启用 Gzip 压缩

## 故障排查

1. **检查日志**
   ```bash
   # PM2 日志
   pm2 logs pharma-recruitment
   
   # Docker 日志
   docker logs pharma-app
   ```

2. **常见问题**
   - 端口被占用：修改端口或停止占用进程
   - 权限问题：检查文件权限
   - 依赖问题：删除 node_modules 重新安装

## 域名配置

1. 购买域名
2. 配置 DNS 指向服务器 IP
3. 配置 SSL 证书（推荐使用 Let's Encrypt）

```bash
# 使用 Certbot 配置 SSL
sudo certbot --nginx -d your-domain.com
```
