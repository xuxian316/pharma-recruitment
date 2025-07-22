import { JobPosition } from './batteryChain';

export const batteryJobPositions: JobPosition[] = [
  // 数据已清空，等待管理员通过后台上传
];

export const batteryJobStatsByLayer = {
  'innovation': {
    name: '材料创新层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['湿法冶金', '工艺优化', '质量控制', '设备维护']
  },
  'engineering': {
    name: '工艺工程层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['材料合成', '电化学测试', '工艺放大', '产品开发']
  },
  'integration': {
    name: '应用集成层',
    totalJobs: 0,
    avgSalary: '面议',
    hotSkills: ['系统集成', 'BMS算法', '结构设计', '回收技术']
  }
};
