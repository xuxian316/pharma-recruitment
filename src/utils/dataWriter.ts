import * as fs from 'fs-extra';
import * as path from 'path';
import { JobPosition } from '@/data/pharmaChain';

// 数据文件路径映射
const DATA_FILES = {
  pharma: 'src/data/jobsData.ts',
  battery: 'src/data/batteryJobsData.ts',
  cosmetics: 'src/data/cosmeticsJobsData.ts',
  pesticides: 'src/data/pesticidesJobsData.ts'
};

// 获取绝对路径
function getDataFilePath(industry: string): string {
  const relativePath = DATA_FILES[industry as keyof typeof DATA_FILES];
  return path.join(process.cwd(), relativePath);
}

// 更新药物化学数据
export async function updatePharmaData(jobs: JobPosition[]): Promise<void> {
  const stats = calculateLayerStats(jobs, {
    discovery: '药物发现层',
    development: '开发与生产层',
    commercialization: '商业化层'
  });

  const content = `import { JobPosition } from './pharmaChain';

// 药物化学行业职位数据（通过Excel上传自动更新）
export const jobPositions: JobPosition[] = ${JSON.stringify(jobs, null, 2)};

// 按产业链层级组织的岗位统计
export const jobStatsByLayer = ${JSON.stringify(stats, null, 2)};`;

  await fs.writeFile(getDataFilePath('pharma'), content, 'utf8');
}

// 更新电池数据
export async function updateBatteryData(jobs: JobPosition[]): Promise<void> {
  const stats = calculateLayerStats(jobs, {
    innovation: '材料创新层',
    engineering: '工艺工程层',
    integration: '应用集成层'
  });

  const content = `import { JobPosition } from './batteryChain';

export const batteryJobPositions: JobPosition[] = ${JSON.stringify(jobs, null, 2)};

export const batteryJobStatsByLayer = ${JSON.stringify(stats, null, 2)};`;

  await fs.writeFile(getDataFilePath('battery'), content, 'utf8');
}

// 更新化妆品数据
export async function updateCosmeticsData(jobs: JobPosition[]): Promise<void> {
  const stats = calculateLayerStats(jobs, {
    development: '活性成分开发层',
    formulation: '配方工艺层',
    commercialization: '市场转化层'
  });

  const content = `import { JobPosition } from './cosmeticsChain';

export const cosmeticsJobPositions: JobPosition[] = ${JSON.stringify(jobs, null, 2)};

export const cosmeticsJobStatsByLayer = ${JSON.stringify(stats, null, 2)};`;

  await fs.writeFile(getDataFilePath('cosmetics'), content, 'utf8');
}

// 更新农药数据
export async function updatePesticidesData(jobs: JobPosition[]): Promise<void> {
  const stats = calculateLayerStats(jobs, {
    creation: '创制分子层',
    transformation: '产业转化层',
    service: '应用服务层'
  });

  const content = `import { JobPosition } from './pesticidesChain';

export const pesticidesJobPositions: JobPosition[] = ${JSON.stringify(jobs, null, 2)};

export const pesticidesJobStatsByLayer = ${JSON.stringify(stats, null, 2)};`;

  await fs.writeFile(getDataFilePath('pesticides'), content, 'utf8');
}

// 计算层级统计数据
function calculateLayerStats(jobs: JobPosition[], layerNames: Record<string, string>) {
  const stats: Record<string, any> = {};
  
  // 初始化统计数据
  Object.entries(layerNames).forEach(([key, name]) => {
    stats[key] = {
      name,
      totalJobs: 0,
      avgSalary: '面议',
      hotSkills: getDefaultHotSkills(key)
    };
  });
  
  // 按层级统计职位数量
  const layerCounts: Record<string, number> = {};
  const layerSalaries: Record<string, number[]> = {};
  
  jobs.forEach(job => {
    if (stats[job.layer]) {
      layerCounts[job.layer] = (layerCounts[job.layer] || 0) + 1;
      
      // 提取薪资数字用于计算平均值
      if (job.salary && typeof job.salary === 'string') {
        const salaryMatch = job.salary.match(/(\d+)-?(\d+)?[kK万]/);
        if (salaryMatch) {
          const min = parseInt(salaryMatch[1]);
          const max = salaryMatch[2] ? parseInt(salaryMatch[2]) : min;
          const avg = (min + max) / 2;
          
          if (!layerSalaries[job.layer]) {
            layerSalaries[job.layer] = [];
          }
          layerSalaries[job.layer].push(avg);
        }
      }
    }
  });
  
  // 更新统计数据
  Object.keys(stats).forEach(layer => {
    stats[layer].totalJobs = layerCounts[layer] || 0;
    
    if (layerSalaries[layer] && layerSalaries[layer].length > 0) {
      const avgSalary = layerSalaries[layer].reduce((a, b) => a + b) / layerSalaries[layer].length;
      stats[layer].avgSalary = `${Math.round(avgSalary)}k左右`;
    }
  });
  
  return stats;
}

// 获取默认热门技能
function getDefaultHotSkills(layer: string): string[] {
  const skillsMap: Record<string, string[]> = {
    // 药物化学
    discovery: ['有机合成', '分析化学', '药物设计', '分子筛选'],
    development: ['制剂开发', '临床研究', 'GMP认证', '质量控制'],
    commercialization: ['注册申报', '市场推广', '销售管理', '商务拓展'],
    
    // 电池
    innovation: ['湿法冶金', '工艺优化', '质量控制', '设备维护'],
    engineering: ['材料合成', '电化学测试', '工艺放大', '产品开发'],
    integration: ['系统集成', 'BMS算法', '结构设计', '回收技术'],
    
    // 化妆品
    formulation: ['配方开发', '功效测试', '工艺优化', '质量控制'],
    
    // 农药
    creation: ['防抗监测', '田间试验', '数据分析', '可持续性'],
    transformation: ['制剂开发', '环境评估', '登记资料'],
    service: ['作物保护', '综合虫害管理', '农药使用']
  };
  
  return skillsMap[layer] || ['技能待更新'];
}

// 更新最后更新时间
async function updateLastUpdateTime(): Promise<void> {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
  
  const content = `// 最后更新时间
export const lastUpdateTime = '${currentDate}';`;
  
  await fs.writeFile(path.join(process.cwd(), 'src/data/lastUpdate.ts'), content, 'utf8');
}

// 更新所有行业数据
export async function updateAllIndustryData(classifiedData: {
  pharma: JobPosition[];
  battery: JobPosition[];
  cosmetics: JobPosition[];
  pesticides: JobPosition[];
}): Promise<void> {
  try {
    await Promise.all([
      updatePharmaData(classifiedData.pharma),
      updateBatteryData(classifiedData.battery),
      updateCosmeticsData(classifiedData.cosmetics),
      updatePesticidesData(classifiedData.pesticides)
    ]);
    
    // 更新最后更新时间
    await updateLastUpdateTime();
    
    console.log('所有行业数据更新完成');
  } catch (error) {
    console.error('更新数据时出错:', error);
    throw error;
  }
}

// 检查数据文件是否存在
export async function checkDataFilesExist(): Promise<boolean> {
  try {
    const checks = await Promise.all(
      Object.values(DATA_FILES).map(filePath => 
        fs.pathExists(path.join(process.cwd(), filePath))
      )
    );
    return checks.every(exists => exists);
  } catch (error) {
    console.error('检查数据文件时出错:', error);
    return false;
  }
}

// 备份当前数据
export async function backupCurrentData(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backup', timestamp);
  
  await fs.ensureDir(backupDir);
  
  for (const [industry, filePath] of Object.entries(DATA_FILES)) {
    const sourcePath = path.join(process.cwd(), filePath);
    const backupPath = path.join(backupDir, `${industry}.ts`);
    
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, backupPath);
    }
  }
  
  console.log(`数据已备份到: ${backupDir}`);
  return backupDir;
}
