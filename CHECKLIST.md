# 📋 部署操作清单

请按照以下步骤操作，每完成一步就打勾 ✓

## 1. Supabase 设置（已打开网站）

- [ ] 点击 "Start your project" 按钮
- [ ] 使用 GitHub 账号登录
- [ ] 点击 "New project" 创建项目
- [ ] 填写项目信息：
  - Project name: `pharma-recruitment`
  - Database Password: 设置强密码（记住它！）
  - Region: 选择 `Northeast Asia (Tokyo)`
- [ ] 等待项目创建完成（约2分钟）

### 初始化数据库
- [ ] 点击左侧菜单 "SQL Editor"
- [ ] 点击 "New query"
- [ ] 复制 `supabase/init.sql` 文件内容
- [ ] 粘贴到编辑器并点击 "Run"
- [ ] 看到 "Success. No rows returned" 表示成功

### 创建存储桶
- [ ] 点击左侧菜单 "Storage"
- [ ] 点击 "New bucket"
- [ ] 填写：
  - Name: `excel-uploads`
  - Public bucket: **不要勾选**
- [ ] 点击 "Create bucket"

### 获取 API 密钥
- [ ] 点击左侧菜单 "Settings" → "API"
- [ ] 复制以下两个值：
  - Project URL: `https://xxxxx.supabase.co`
  - anon public: `eyJhbGci...`（很长的字符串）

## 2. 运行配置脚本

在终端运行：
```powershell
.\setup-env.ps1
```

- [ ] 输入 Supabase Project URL
- [ ] 输入 Supabase Anon Key
- [ ] 设置管理员密码

## 3. GitHub 设置

- [ ] 脚本会询问是否打开 GitHub，选择 Y
- [ ] 在 GitHub 创建新仓库：
  - Repository name: `pharma-recruitment`
  - Public
  - **不要**勾选任何初始化选项
- [ ] 点击 "Create repository"

## 4. 推送代码

复制 GitHub 显示的仓库地址，然后运行：

```bash
# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/pharma-recruitment.git

# 推送代码
git push -u origin master
```

如果提示输入密码，使用 GitHub token：
- [ ] Settings → Developer settings → Personal access tokens
- [ ] Generate new token (classic)
- [ ] 勾选 `repo` 权限
- [ ] 使用生成的 token 作为密码

## 5. Railway 部署

- [ ] 访问 https://railway.app
- [ ] 点击 "Login with GitHub"
- [ ] 点击 "New Project"
- [ ] 选择 "Deploy from GitHub repo"
- [ ] 搜索并选择 `pharma-recruitment`
- [ ] 等待初始部署

### 配置环境变量
- [ ] 点击部署的服务
- [ ] 点击 "Variables" 标签
- [ ] 点击 "Raw Editor"
- [ ] 粘贴配置脚本显示的环境变量
- [ ] 点击 "Save"

### 生成域名
- [ ] 点击 "Settings" 标签
- [ ] 在 "Domains" 部分点击 "Generate Domain"
- [ ] 复制生成的域名

## 6. 测试

- [ ] 访问生成的域名
- [ ] 点击右上角 "管理员"
- [ ] 使用设置的密码登录
- [ ] 尝试上传 Excel 文件

## ✅ 完成！

恭喜！您的网站已经成功部署。

记录重要信息：
- 网站地址：_______________________
- Supabase 项目：___________________
- 管理员密码：____________________
