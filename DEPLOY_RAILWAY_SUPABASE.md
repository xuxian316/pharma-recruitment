# Railway + Supabase 部署指南

这个方案将使用 Railway 托管应用，Supabase 存储数据，完美支持文件上传功能。

## 第一步：设置 Supabase

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 注册账号（可用 GitHub 登录）
3. 创建新项目，记住：
   - Project URL
   - API Key (anon/public)
   - Database Password

### 2. 创建数据表

在 Supabase SQL 编辑器中执行：

```sql
-- 创建职位表
CREATE TABLE job_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  layer TEXT NOT NULL,
  node_id TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium',
  requirements TEXT[],
  responsibilities TEXT[],
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建更新记录表
CREATE TABLE update_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  updated_at TIMESTAMP DEFAULT NOW(),
  file_name TEXT,
  records_count INTEGER
);

-- 创建索引提高查询性能
CREATE INDEX idx_job_positions_industry ON job_positions(industry);
CREATE INDEX idx_job_positions_layer ON job_positions(layer);
```

### 3. 创建存储桶（用于Excel文件）

1. 在 Supabase Dashboard 中选择 Storage
2. 创建新 Bucket：`excel-uploads`
3. 设置为 Private（仅管理员可访问）

## 第二步：修改项目代码

### 1. 安装 Supabase 客户端

```bash
npm install @supabase/supabase-js
```

### 2. 创建 Supabase 配置文件

创建 `src/lib/supabase.ts`：

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 职位数据操作
export async function getJobPositions(industry?: string) {
  let query = supabase.from('job_positions').select('*')
  
  if (industry) {
    query = query.eq('industry', industry)
  }
  
  const { data, error } = await query
  return { data, error }
}

export async function updateJobPositions(jobs: any[]) {
  // 清空旧数据
  await supabase.from('job_positions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  // 插入新数据
  const { data, error } = await supabase
    .from('job_positions')
    .insert(jobs)
  
  // 记录更新历史
  await supabase
    .from('update_history')
    .insert({ records_count: jobs.length })
  
  return { data, error }
}

export async function getLastUpdateTime() {
  const { data, error } = await supabase
    .from('update_history')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
  
  if (data && data.length > 0) {
    return new Date(data[0].updated_at).toLocaleDateString('zh-CN')
  }
  
  return '暂无更新'
}
```

### 3. 修改上传 API

更新 `src/app/api/admin/upload-jobs/route.ts`：

```typescript
import { supabase, updateJobPositions } from '@/lib/supabase'

// ... 其他代码保持不变 ...

// 替换原来的 updateJobsData 函数
async function updateJobsDataToSupabase(jobs: ExcelJob[]): Promise<number> {
  const supabaseJobs = jobs.map(job => ({
    industry: job.industry,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    layer: job.layer,
    node_id: job.nodeId,
    urgency: job.urgency,
    requirements: job.requirements?.split(';') || [],
    responsibilities: job.responsibilities?.split(';') || [],
    link: job.link
  }))
  
  const { error } = await updateJobPositions(supabaseJobs)
  
  if (error) {
    throw new Error(`Supabase error: ${error.message}`)
  }
  
  return supabaseJobs.length
}

// 在 POST 函数中使用新函数
const updatedCount = await updateJobsDataToSupabase(validJobs)
```

### 4. 环境变量配置

创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 第三步：部署到 Railway

### 1. 准备项目

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin your-github-repo
git push -u origin main
```

### 2. 部署到 Railway

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 创建新项目
railway new

# 关联 GitHub 仓库
railway link

# 设置环境变量
railway variables set NEXT_PUBLIC_SUPABASE_URL=your-url
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# 部署
railway up
```

### 3. 获取部署 URL

```bash
railway domain
```

## 优势总结

1. **数据持久化**：所有上传的数据存储在 Supabase 数据库中
2. **文件存储**：Excel 文件可以保存在 Supabase Storage
3. **实时更新**：数据更新立即生效，无需重新部署
4. **免费额度充足**：对于中小型项目完全够用
5. **自动备份**：Supabase 自动备份数据

## 其他功能建议

### 1. 添加数据导出功能

```typescript
export async function exportToExcel() {
  const { data } = await supabase
    .from('job_positions')
    .select('*')
    .csv()
  
  return data
}
```

### 2. 添加搜索功能

```typescript
export async function searchJobs(keyword: string) {
  const { data } = await supabase
    .from('job_positions')
    .select('*')
    .ilike('title', `%${keyword}%`)
  
  return data
}
```

### 3. 添加分页功能

```typescript
export async function getJobsPaginated(page: number = 1, limit: number = 20) {
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  const { data, count } = await supabase
    .from('job_positions')
    .select('*', { count: 'exact' })
    .range(from, to)
  
  return { data, count, page, limit }
}
```

## 费用估算

- **Railway**：$5/月免费额度，一般够用
- **Supabase**：免费版完全够用
- **总计**：$0/月

## 注意事项

1. Railway 免费额度用完后会暂停服务，需要添加信用卡继续使用
2. Supabase 免费版有 500MB 数据库限制，但对于职位数据足够
3. 建议定期备份数据到本地
