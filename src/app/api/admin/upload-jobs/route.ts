import { NextRequest, NextResponse } from 'next/server';
import { readExcelFile } from '@/utils/excelHandler';
import { updateJobPositions, uploadExcelFile, JobPositionDB } from '@/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

interface ExcelJob {
  industry: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  layer: string;
  nodeId: string;
  urgency: 'low' | 'medium' | 'high';
  requirements?: string;
  responsibilities?: string;
  link?: string;
}

interface ProcessResult {
  success: boolean;
  message: string;
  updatedJobs?: number;
  errors?: string[];
}

// 验证行业是否有效
function validateIndustry(industry: string): boolean {
  return ['battery', 'cosmetics', 'pesticides', 'pharmaceuticals'].includes(industry);
}

// 验证紧急程度是否有效
function validateUrgency(urgency: string): boolean {
  return ['low', 'medium', 'high'].includes(urgency);
}

// 处理Excel行数据
function processExcelRow(row: any, rowIndex: number): { job: ExcelJob | null; error: string | null } {
  const errors: string[] = [];
  
  // 检查必需字段（基于猎聘Excel格式）
  const requiredFields = ['职位名称', '薪资范围', '公司名称', '工作地点'];
  
  for (const field of requiredFields) {
    if (!row[field] || String(row[field]).trim() === '') {
      errors.push(`第${rowIndex + 2}行: 缺少必需字段 "${field}"`);
    }
  }
  
  if (errors.length > 0) {
    return { job: null, error: errors.join('; ') };
  }
  
  // 根据职位名称推断层级和节点（简化版本）
  function inferLayerAndNode(title: string) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('合成') || titleLower.includes('化学')) {
      return { layer: 'discovery', nodeId: 'compound-synthesis' };
    }
    if (titleLower.includes('研发') || titleLower.includes('设计')) {
      return { layer: 'discovery', nodeId: 'molecular-design' };
    }
    if (titleLower.includes('分析') || titleLower.includes('检测')) {
      return { layer: 'development', nodeId: 'cmc-development' };
    }
    return { layer: 'discovery', nodeId: 'compound-synthesis' }; // 默认值
  }
  
  // 根据薪资推断紧急程度
  function inferUrgency(salary: string): 'low' | 'medium' | 'high' {
    const salaryStr = salary.toLowerCase();
    const numbers = salaryStr.match(/\d+/g);
    if (numbers) {
      const maxSalary = Math.max(...numbers.map(n => parseInt(n)));
      if (maxSalary >= 30) return 'high';
      if (maxSalary >= 15) return 'medium';
    }
    return 'low';
  }
  
  const layerNode = inferLayerAndNode(row['职位名称']);
  const urgency = inferUrgency(row['薪资范围']);
  
  // 生成基础要求和职责
  const requirements = [
    `${row['学历要求'] || '本科'}学历，化学相关专业`,
    `${row['经验要求'] || '1年以上'}工作经验`
  ];
  const responsibilities = [
    '负责相关技术工作',
    '参与项目技术讨论',
    '撰写技术报告'
  ];
  
  const job: ExcelJob = {
    industry: 'pharmaceuticals', // 默认为药物化学行业
    title: String(row['职位名称']).trim(),
    company: String(row['公司名称']).trim(),
    location: String(row['工作地点']).trim(),
    salary: String(row['薪资范围']).trim(),
    layer: layerNode.layer,
    nodeId: layerNode.nodeId,
    urgency: urgency,
    requirements: requirements.join(';'),
    responsibilities: responsibilities.join(';'),
    link: row['岗位详情链接'] ? String(row['岗位详情链接']).trim() : undefined,
  };
  
  return { job, error: null };
}

// 更新职位数据到 Supabase
async function updateJobsDataToSupabase(jobs: ExcelJob[]): Promise<number> {
  try {
    // 转换为 Supabase 格式
    const supabaseJobs: JobPositionDB[] = jobs.map(job => ({
      industry: job.industry,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      layer: job.layer,
      node_id: job.nodeId,
      urgency: job.urgency,
      requirements: job.requirements ? job.requirements.split(';').map(r => r.trim()) : [],
      responsibilities: job.responsibilities ? job.responsibilities.split(';').map(r => r.trim()) : [],
      link: job.link
    }));
    
    // 更新到 Supabase
    const { error } = await updateJobPositions(supabaseJobs);
    
    if (error) {
      throw new Error(`Supabase 错误: ${error.message}`);
    }
    
    return supabaseJobs.length;
  } catch (error) {
    console.error('写入文件时出错:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: '未找到上传的文件' },
        { status: 400 }
      );
    }
    
    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, message: '文件类型不正确，请上传Excel文件 (.xlsx 或 .xls)' },
        { status: 400 }
      );
    }
    
    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let jsonData;
    try {
      jsonData = await readExcelFile(buffer);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Excel文件读取失败: ' + (error as Error).message },
        { status: 400 }
      );
    }
    
    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Excel文件中没有数据' },
        { status: 400 }
      );
    }
    
    // 处理每一行数据
    const validJobs: ExcelJob[] = [];
    const errors: string[] = [];
    
    jsonData.forEach((row, index) => {
      const { job, error } = processExcelRow(row, index);
      if (job) {
        validJobs.push(job);
      } else if (error) {
        errors.push(error);
      }
    });
    
    // 如果有错误且没有有效数据，返回错误
    if (validJobs.length === 0 && errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: '没有有效的数据可以导入',
        errors: errors
      }, { status: 400 });
    }
    
    // 更新数据到 Supabase
    const updatedCount = await updateJobsDataToSupabase(validJobs);
    
    const result: ProcessResult = {
      success: true,
      message: `成功处理了 ${jsonData.length} 行数据，导入了 ${updatedCount} 个职位`,
      updatedJobs: updatedCount,
      errors: errors.length > 0 ? errors : undefined
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Excel处理错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '处理文件时发生错误: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}
