import { JobPosition } from './cosmeticsChain';

export const cosmeticsJobPositions: JobPosition[] = [
  // 数据已清空，等待管理员通过后台上传
];

export const cosmeticsJobStatsByLayer = {
  'development': {
    name: '活性成分开发层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['活性成分', '皮肤生物学', '功效验证', '配方化学']
  },
  'formulation': {
    name: '配方工艺层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['配方开发', '功效测试', '工艺优化', '质量控制']
  },
  'commercialization': {
    name: '市场转化层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['法规注册', '品牌管理', '市场营销', '消费者洞察']
  }
};
