import { JobPosition } from './pesticidesChain';

export const pesticidesJobPositions: JobPosition[] = [
  // 数据已清空，等待管理员通过后台上传
];

export const pesticidesJobStatsByLayer = {
  'creation': {
    name: '创制分子层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['防抗监测', '田间试验', '数据分析', '可持续性']
  },
  'transformation': {
    name: '产业转化层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['制剂开发', '环境评估', '登记资料']
  },
  'service': {
    name: '应用服务层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['作物保护', '综合虫害管理', '农药使用']
  }
};
