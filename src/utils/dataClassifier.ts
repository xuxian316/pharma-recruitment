import { readExcelFile } from '@/utils/excelHandler';
import { JobPosition } from '@/data/pharmaChain';

// 行业识别规则
export const industryClassifier = {
  // 药物化学关键词
  pharma: [
    '药物', '制药', '医药', '化学合成', '有机合成', '药理', '临床', 
    'NMPA', 'FDA', '新药', '原料药', '制剂', '药代', '毒理',
    '化合物', '分子设计', '药效', '安全性', '质量控制'
  ],
  
  // 电池行业关键词
  battery: [
    '电池', '锂电', '储能', '正极', '负极', '电解液', '隔膜',
    '电芯', '电池包', 'BMS', 'PACK', '充电', '放电', '循环寿命',
    '能量密度', '功率密度', '电化学', '材料合成'
  ],
  
  // 化妆品行业关键词
  cosmetics: [
    '化妆品', '护肤', '美容', '配方', '功效', '皮肤', '美白', '抗衰',
    '防晒', '保湿', '敏感肌', '活性成分', '乳化', '稳定性',
    '感官评价', '消费者', '品牌', 'NMPA化妆品'
  ],
  
  // 农药行业关键词
  pesticides: [
    '农药', '杀虫剂', '除草剂', '杀菌剂', '植保', '作物保护',
    '田间试验', '抗性', '环境评估', '残留', '登记证', '制剂开发',
    '生物农药', '绿色防控', '综合防治'
  ]
};

// 层级识别规则
export const layerClassifier = {
  pharma: {
    discovery: ['发现', '筛选', '设计', '合成', '化合物', '分子', '靶点'],
    development: ['开发', '临床', '制剂', '工艺', '生产', '质控', '注册'],
    commercialization: ['商业化', '市场', '销售', '推广', '商务', '品牌']
  },
  
  battery: {
    innovation: ['创新', '材料', '研发', '基础研究', '原理', '机理'],
    engineering: ['工程', '工艺', '制造', '生产', '放大', '优化'],
    integration: ['集成', '应用', '系统', 'BMS', 'PACK', '终端', '回收']
  },
  
  cosmetics: {
    development: ['开发', '研发', '成分', '活性', '生物学', '机理'],
    formulation: ['配方', '工艺', '制剂', '稳定性', '测试', '评价'],
    commercialization: ['商业化', '注册', '法规', '品牌', '市场', '消费者']
  },
  
  pesticides: {
    creation: ['创制', '发现', '筛选', '设计', '合成', '新化合物'],
    transformation: ['转化', '开发', '制剂', '工艺', '登记', '产业化'],
    service: ['服务', '应用', '推广', '技术服务', '植保', '田间']
  }
};

// 根据职位信息自动识别行业
export function classifyIndustry(jobData: any): string {
  const searchText = `${jobData.title || ''} ${jobData.company || ''} ${(jobData.requirements || []).join(' ')} ${(jobData.responsibilities || []).join(' ')}`.toLowerCase();
  
  let scores = {
    pharma: 0,
    battery: 0,
    cosmetics: 0,
    pesticides: 0
  };
  
  // 计算每个行业的匹配分数
  Object.entries(industryClassifier).forEach(([industry, keywords]) => {
    keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        scores[industry as keyof typeof scores]++;
      }
    });
  });
  
  // 返回得分最高的行业
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'pharma'; // 默认归类为药物化学
  
  return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'pharma';
}

// 根据职位信息自动识别层级
export function classifyLayer(jobData: any, industry: string): string {
  const searchText = `${jobData.title || ''} ${(jobData.requirements || []).join(' ')} ${(jobData.responsibilities || []).join(' ')}`.toLowerCase();
  
  const layerRules = layerClassifier[industry as keyof typeof layerClassifier];
  if (!layerRules) return Object.keys(layerClassifier.pharma)[0]; // 默认值
  
  let scores: Record<string, number> = {};
  Object.keys(layerRules).forEach(layer => {
    scores[layer] = 0;
  });
  
  // 计算每个层级的匹配分数
  Object.entries(layerRules).forEach(([layer, keywords]) => {
    keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        scores[layer]++;
      }
    });
  });
  
  // 返回得分最高的层级
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return Object.keys(layerRules)[0]; // 默认为第一个层级
  
  return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || Object.keys(layerRules)[0];
}

// 生成nodeId（基于title和layer）
export function generateNodeId(title: string, layer: string): string {
  const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').toLowerCase();
  return `${cleanTitle}-${layer}`.substring(0, 30);
}

// 解析Excel文件并自动分类
export async function parseAndClassifyExcel(buffer: Buffer): Promise<{
  pharma: JobPosition[];
  battery: JobPosition[];
  cosmetics: JobPosition[];
  pesticides: JobPosition[];
}> {
  const rawData = await readExcelFile(buffer);
  
  const classifiedData = {
    pharma: [] as JobPosition[],
    battery: [] as JobPosition[],
    cosmetics: [] as JobPosition[],
    pesticides: [] as JobPosition[]
  };
  
  rawData.forEach((row: any, index: number) => {
    try {
      // 标准化字段名
      const jobData = {
        title: row['职位名称'] || row['title'] || row['岗位名称'] || '',
        company: row['公司'] || row['company'] || row['公司名称'] || '',
        location: row['地点'] || row['location'] || row['工作地点'] || '',
        salary: row['薪资'] || row['salary'] || row['薪酬'] || '',
        experience: row['经验要求'] || row['experience'] || row['工作经验'] || '',
        education: row['学历要求'] || row['education'] || row['学历'] || '',
        companySize: row['公司规模'] || row['companySize'] || row['企业规模'] || '',
        industryType: row['行业类型'] || row['industryType'] || row['所属行业'] || '',
        requirements: parseArrayField(row['岗位要求'] || row['requirements'] || row['职位要求'] || ''),
        responsibilities: parseArrayField(row['工作职责'] || row['responsibilities'] || row['岗位职责'] || ''),
        urgency: row['紧急程度'] || row['urgency'] || 'medium',
        link: row['链接'] || row['link'] || row['职位链接'] || ''
      };
      
      // 自动分类
      const industry = classifyIndustry(jobData);
      const layer = classifyLayer(jobData, industry);
      const nodeId = generateNodeId(jobData.title, layer);
      
      // 创建完整的职位对象
      const jobPosition: JobPosition = {
        id: `${industry}-${Date.now()}-${index}`,
        title: jobData.title,
        nodeId: nodeId,
        layer: layer,
        company: jobData.company,
        location: jobData.location,
        salary: jobData.salary,
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        urgency: jobData.urgency as 'low' | 'medium' | 'high',
        ...(jobData.experience && { experience: jobData.experience }),
        ...(jobData.education && { education: jobData.education }),
        ...(jobData.companySize && { companySize: jobData.companySize }),
        ...(jobData.industryType && { industryType: jobData.industryType }),
        ...(jobData.link && { link: jobData.link })
      };
      
      // 分配到对应行业
      classifiedData[industry as keyof typeof classifiedData].push(jobPosition);
    } catch (error) {
      console.error(`处理第${index + 1}行数据时出错:`, error);
    }
  });
  
  return classifiedData;
}

// 解析数组字段（支持多种分隔符）
function parseArrayField(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  
  // 支持多种分隔符
  const separators = ['\n', ';', '；', '|', ',', '，'];
  let result = [value];
  
  for (const separator of separators) {
    if (value.includes(separator)) {
      result = value.split(separator).map((item: string) => item.trim()).filter((item: string) => item.length > 0);
      break;
    }
  }
  
  return result;
}

// 计算统计数据
export function calculateStats(jobs: JobPosition[]) {
  if (jobs.length === 0) {
    return {
      totalJobs: 0,
      avgSalary: '面议',
      layerStats: {}
    };
  }
  
  // 按层级统计
  const layerStats: Record<string, number> = {};
  jobs.forEach(job => {
    layerStats[job.layer] = (layerStats[job.layer] || 0) + 1;
  });
  
  // 计算平均薪资（简化处理）
  const salaries = jobs
    .map(job => job.salary)
    .filter(salary => salary && salary.includes('k'))
    .map(salary => {
      const match = salary.match(/(\d+)-?(\d+)?k/);
      if (match) {
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : min;
        return (min + max) / 2;
      }
      return 0;
    })
    .filter(salary => salary > 0);
  
  const avgSalary = salaries.length > 0 
    ? `${Math.round(salaries.reduce((a, b) => a + b) / salaries.length)}k左右`
    : '面议';
  
  return {
    totalJobs: jobs.length,
    avgSalary,
    layerStats
  };
}
