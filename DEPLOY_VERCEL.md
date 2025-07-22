# 快速部署到 Vercel（推荐）

## 1. 一键部署（最简单）

点击下方按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 2. 命令行部署

```bash
# 在项目根目录执行
npx vercel

# 首次使用会提示：
# 1. 登录/注册账号
# 2. 选择项目设置
# 3. 自动部署
```

## 3. Git 集成部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "Import Project"
4. 选择您的 GitHub 仓库
5. 自动部署完成

## Vercel 免费额度

- ✅ 100GB 带宽/月
- ✅ 无限网站数量
- ✅ 自动 HTTPS 证书
- ✅ 全球 CDN 加速
- ✅ Serverless 函数支持
- ✅ 自定义域名

## 配置自定义域名

1. 在 Vercel 控制台选择项目
2. 进入 Settings → Domains
3. 添加您的域名
4. 配置 DNS 记录

## 环境变量配置

在 Vercel 控制台配置环境变量：
- Settings → Environment Variables
- 添加生产环境变量

## 注意事项

1. **文件上传限制**：Vercel 的 Serverless 函数有 50MB 限制
2. **数据持久化**：上传的 Excel 数据不会持久保存，建议：
   - 使用外部数据库（如 Supabase、PlanetScale）
   - 使用对象存储（如 Cloudflare R2）

## 推荐数据库方案（免费）

### Supabase（推荐）
- 免费 500MB 存储
- PostgreSQL 数据库
- 实时同步功能

### PlanetScale
- 免费 5GB 存储
- MySQL 兼容
- 自动备份

### MongoDB Atlas
- 免费 512MB 存储
- NoSQL 数据库
- 全球部署
