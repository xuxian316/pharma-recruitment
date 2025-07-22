import { createClient } from '@supabase/supabase-js'

// Supabase 配置

// 创建 Supabase 客户端的函数，确保环境变量在运行时加载
const getClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase 环境变量未设置，请检查 Vercel 项目配置');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// 职位数据类型
export interface JobPositionDB {
  id?: string
  industry: string
  title: string
  company: string
  location: string
  salary: string
  layer: string
  node_id: string
  urgency: string
  requirements: string[]
  responsibilities: string[]
  link?: string
  created_at?: string
  updated_at?: string
}

// 获取职位数据
export async function getJobPositions(industry?: string) {
  const supabase = getClient();
  let query = supabase
    .from('job_positions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (industry) {
    query = query.eq('industry', industry)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('获取职位数据失败:', error)
    return { data: [], error }
  }
  
  return { data: data || [], error: null }
}

// 更新职位数据（合并去重）
export async function updateJobPositions(jobs: JobPositionDB[]) {
  const supabase = getClient();
  try {
    // 1. 获取所有现有职位用于去重
    const { data: existingJobs, error: fetchError } = await supabase
      .from('job_positions')
      .select('title,company,location');

    if (fetchError) {
      throw new Error(`获取现有职位失败: ${fetchError.message}`);
    }

    // 2. 创建一个用于快速查找的集合
    const existingJobKeys = new Set(
      existingJobs.map(job => `${job.title?.trim()}-${job.company?.trim()}-${job.location?.trim()}`)
    );

    // 3. 筛选出不存在于数据库中的新职位
    const newJobsToInsert = jobs.filter(job => {
      const jobKey = `${job.title?.trim()}-${job.company?.trim()}-${job.location?.trim()}`;
      return !existingJobKeys.has(jobKey);
    });

    // 4. 如果没有新职位，则直接返回
    if (newJobsToInsert.length === 0) {
      return { data: [], error: null, addedCount: 0 };
    }

    // 5. 插入新的、不重复的职位
    const { data, error: insertError } = await supabase
      .from('job_positions')
      .insert(newJobsToInsert)
      .select();

    if (insertError) {
      throw new Error(`插入新职位失败: ${insertError.message}`);
    }

    // 6. 记录更新历史
    await supabase.from('update_history').insert({
      records_count: newJobsToInsert.length,
      industry: 'all' // 因为是合并，所以行业是全部
    });

    return { data, error: null, addedCount: newJobsToInsert.length };

  } catch (error) {
    console.error('更新职位数据失败:', error);
    return { data: null, error, addedCount: 0 };
  }
}

// 获取最后更新时间
export async function getLastUpdateTime() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('update_history')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
  
  if (error) {
    console.error('获取更新时间失败:', error)
    return '暂无更新'
  }
  
  if (data && data.length > 0) {
    const date = new Date(data[0].updated_at)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
  }
  
  return '暂无更新'
}

// 搜索职位
export async function searchJobs(keyword: string, industry?: string) {
  const supabase = getClient();
  let query = supabase
    .from('job_positions')
    .select('*')
  
  if (industry) {
    query = query.eq('industry', industry)
  }
  
  // 在标题、公司名称中搜索
  query = query.or(`title.ilike.%${keyword}%,company.ilike.%${keyword}%`)
  
  const { data, error } = await query
  
  if (error) {
    console.error('搜索职位失败:', error)
    return { data: [], error }
  }
  
  return { data: data || [], error: null }
}

// 获取职位统计
export async function getJobStats(industry?: string) {
  const supabase = getClient();
  let query = supabase
    .from('job_positions')
    .select('layer, urgency', { count: 'exact' })
  
  if (industry) {
    query = query.eq('industry', industry)
  }
  
  const { data, count, error } = await query
  
  if (error) {
    console.error('获取统计数据失败:', error)
    return null
  }
  
  // 按层级统计
  const layerStats: Record<string, number> = {}
  const urgencyStats = { high: 0, medium: 0, low: 0 }
  
  data?.forEach(job => {
    // 层级统计
    if (!layerStats[job.layer]) {
      layerStats[job.layer] = 0
    }
    layerStats[job.layer]++
    
    // 紧急度统计
    if (job.urgency in urgencyStats) {
      urgencyStats[job.urgency as keyof typeof urgencyStats]++
    }
  })
  
  return {
    total: count || 0,
    byLayer: layerStats,
    byUrgency: urgencyStats
  }
}

// 上传 Excel 文件到存储
export async function uploadExcelFile(file: File, fileName: string) {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from('excel-uploads')
    .upload(`${Date.now()}-${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('上传文件失败:', error)
    return { url: null, error }
  }
  
  // 获取公开 URL
  const { data: { publicUrl } } = supabase.storage
    .from('excel-uploads')
    .getPublicUrl(data.path)
  
  return { url: publicUrl, error: null }
}

// 检查数据库连接
export async function checkDatabaseConnection() {
  const supabase = getClient();
  try {
    const { data, error } = await supabase
      .from('job_positions')
      .select('count')
      .limit(1)
    
    return !error
  } catch {
    return false
  }
}
