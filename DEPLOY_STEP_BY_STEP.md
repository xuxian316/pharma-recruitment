# 🚀 部署步骤指南

本指南将帮助您将项目部署到 Supabase + Railway。

## 第一部分：设置 Supabase（10分钟）

### 1. 创建 Supabase 账号
1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 
3. 使用 GitHub 账号登录（推荐）

### 2. 创建新项目
1. 点击 "New project"
2. 填写项目信息：
   - **Project name**: pharma-recruitment
   - **Database Password**: 设置一个强密码（请记住！）
   - **Region**: 选择离您最近的区域（如 Northeast Asia）
3. 点击 "Create new project"（需要等待约2分钟）

### 3. 初始化数据库
1. 项目创建完成后，进入项目仪表板
2. 点击左侧菜单的 "SQL Editor"
3. 点击 "New query"
4. 复制并粘贴 `supabase/init.sql` 文件的全部内容
5. 点击 "Run" 执行 SQL 脚本

### 4. 创建存储桶（用于Excel文件）
1. 点击左侧菜单的 "Storage"
2. 点击 "Create bucket"
3. 设置：
   - **Name**: excel-uploads
   - **Public**: 关闭（保持私有）
4. 点击 "Create"

### 5. 获取 API 密钥
1. 点击左侧菜单的 "Settings"
2. 点击 "API"
3. 复制以下信息（保存到记事本）：
   - **Project URL**: https://xxxxx.supabase.co
   - **anon public**: eyJhbGciOiJI... (很长的字符串)

## 第二部分：推送代码到 GitHub（5分钟）

### 1. 创建 GitHub 仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 设置：
   - **Repository name**: pharma-recruitment
   - **Public/Private**: 选择 Public（Railway 免费版需要）
   - 不要勾选任何初始化选项
4. 点击 "Create repository"

### 2. 推送代码
在您的项目目录执行以下命令：

```bash
# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/pharma-recruitment.git

# 推送代码
git push -u origin master
```

如果遇到认证问题，使用 GitHub Personal Access Token：
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. 选择 repo 权限
4. 使用 token 作为密码

## 第三部分：部署到 Railway（10分钟）

### 1. 创建 Railway 账号
1. 访问 [https://railway.app](https://railway.app)
2. 点击 "Start a New Project"
3. 使用 GitHub 登录

### 2. 创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 搜索并选择您的 `pharma-recruitment` 仓库
4. Railway 会自动检测到 Next.js 项目

### 3. 配置环境变量
1. 在 Railway 项目页面，点击您的服务
2. 点击 "Variables" 标签
3. 点击 "Raw Editor"
4. 粘贴以下内容（替换为您的 Supabase 信息）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
ADMIN_PASSWORD=your-admin-password
```

5. 点击 "Save"

### 4. 部署项目
1. Railway 会自动开始部署
2. 等待部署完成（约3-5分钟）
3. 部署完成后，点击 "Settings"
4. 在 "Domains" 部分点击 "Generate Domain"
5. 您会得到一个类似 `pharma-recruitment-production.up.railway.app` 的域名

## 第四部分：测试部署（5分钟）

### 1. 访问您的网站
1. 打开生成的域名
2. 应该能看到主页

### 2. 测试管理员功能
1. 点击右上角 "管理员"
2. 使用密码登录（您在环境变量中设置的 ADMIN_PASSWORD）
3. 尝试上传 Excel 文件

### 3. 检查数据
1. 回到 Supabase 仪表板
2. 点击 "Table Editor"
3. 查看 `job_positions` 表，应该能看到上传的数据

## 常见问题解决

### 1. 部署失败
- 检查环境变量是否正确设置
- 查看 Railway 的部署日志

### 2. 数据库连接失败
- 确认 Supabase URL 和密钥正确
- 检查 Supabase 项目是否暂停（免费版 7 天不活动会暂停）

### 3. 上传失败
- 检查 Storage 桶是否创建
- 确认环境变量包含正确的密钥

## 需要帮助？

如果遇到问题，可以：
1. 查看 Railway 和 Supabase 的日志
2. 联系开发者：3331484470@qq.com

## 下一步

- 配置自定义域名
- 设置自动备份
- 添加更多功能
