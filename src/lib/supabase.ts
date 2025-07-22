import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// 更新职位数据（替换所有）
export async function updateJobPositions(jobs: JobPositionDB[], industry?: string) {
  try {
    // 如果指定了行业，只删除该行业的数据
    if (industry) {
      const { error: deleteError } = await supabase
        .from('job_positions')
        .delete()
        .eq('industry', industry)
      
      if (deleteError) throw deleteError
    } else {
      // 否则删除所有数据
      const { error: deleteError } = await supabase
        .from('job_positions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 删除所有记录
      
      if (deleteError) throw deleteError
    }
    
    // 插入新数据
    if (jobs.length > 0) {
      const { data, error: insertError } = await supabase
        .from('job_positions')
        .insert(jobs)
        .select()
      
      if (insertError) throw insertError
      
      // 记录更新历史
      await supabase
        .from('update_history')
        .insert({ 
          records_count: jobs.length,
          industry: industry || 'all'
        })
      
      return { data, error: null }
    }
    
    return { data: [], error: null }
  } catch (error) {
    console.error('更新职位数据失败:', error)
    return { data: null, error }
  }
}

// 获取最后更新时间
export async function getLastUpdateTime() {
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
