import { JobPosition } from './pharmaChain';

export const jobPositions: JobPosition[] = [
  // 药物发现层岗位
  {
    id: 'target-bio-1',
    title: '生物信息学工程师',
    nodeId: 'target-identification',
    layer: 'discovery',
    company: '恒瑞医药',
    location: '上海',
    salary: '25-40万/年',
    requirements: [
      '生物信息学/计算生物学博士学位',
      '熟练掌握Python/R编程语言',
      '具有基因组学数据分析经验3年以上',
      '熟悉靶点识别和验证流程'
    ],
    responsibilities: [
      '利用多组学数据进行疾病靶点识别',
      '开发生物信息学分析流程和工具',
      '与实验团队协作验证计算预测结果',
      '撰写专利申请和学术论文'
    ],
    urgency: 'high'
  },
  {
    id: 'moldesign-cadd-1',
    title: 'CADD药物设计专家',
    nodeId: 'molecular-design',
    layer: 'discovery',
    company: '信达生物',
    location: '苏州',
    salary: '35-55万/年',
    requirements: [
      '药物化学/计算化学博士学位',
      '熟练使用Schrödinger、MOE等软件',
      '具备分子对接、药效团建模经验',
      '5年以上小分子药物设计经验'
    ],
    responsibilities: [
      '基于结构的药物设计(SBDD)',
      '先导化合物优化和构效关系分析',
      '与合成化学团队协作推进项目',
      '参与专利布局和化合物保护策略'
    ],
    urgency: 'high'
  },
  {
    id: 'synthesis-chem-1',
    title: '资深有机合成化学家',
    nodeId: 'compound-synthesis',
    layer: 'discovery',
    company: '百济神州',
    location: '北京',
    salary: '30-50万/年',
    requirements: [
      '有机化学博士学位',
      '具备复杂分子全合成经验',
      '熟悉现代有机合成方法学',
      '英文文献阅读和写作能力强'
    ],
    responsibilities: [
      '设计高效的合成路线',
      '开展关键中间体和目标化合物合成',
      '优化反应条件提高收率和纯度',
      '指导初级研究员技术开发'
    ],
    urgency: 'medium'
  },

  // 开发与生产层岗位
  {
    id: 'cmc-formulation-1',
    title: '制剂开发高级经理',
    nodeId: 'cmc-development',
    layer: 'development',
    company: '石药集团',
    location: '石家庄',
    salary: '40-65万/年',
    requirements: [
      '制药工程/药剂学硕士以上学历',
      '8年以上制剂开发和产业化经验',
      '熟悉ICH Q系列指导原则',
      'cGMP法规理解深入，具备审计经验'
    ],
    responsibilities: [
      '负责口服/注射制剂处方工艺开发',
      '制剂稳定性研究和包装材料相容性',
      'CMC技术转移和规模化生产支持',
      '参与药品注册申报技术资料撰写'
    ],
    urgency: 'high'
  },
  {
    id: 'clinical-cra-1',
    title: '临床监察员(CRA)',
    nodeId: 'clinical-trials',
    layer: 'development',
    company: '君实生物',
    location: '广州',
    salary: '20-35万/年',
    requirements: [
      '医学、药学、生命科学学士以上',
      '具备GCP培训证书',
      '2年以上CRO或制药公司CRA经验',
      '良好的沟通协调和抗压能力'
    ],
    responsibilities: [
      '临床试验现场监察和质量控制',
      '协助研究中心启动和维护',
      'CRF表格审核和数据质量保证',
      '不良事件报告和安全性评估'
    ],
    urgency: 'high'
  },
  {
    id: 'gmp-qa-1',
    title: 'GMP质量保证经理',
    nodeId: 'gmp-production',
    layer: 'development',
    company: '华海药业',
    location: '台州',
    salary: '35-50万/年',
    requirements: [
      '药学/化工相关专业本科以上',
      '10年以上制药企业QA/QC工作经验',
      '熟悉FDA、EU GMP法规要求',
      '具备国际认证审计经验优先'
    ],
    responsibilities: [
      '建立和完善GMP质量管理体系',
      '组织内审和供应商审计',
      '偏差调查和CAPA措施制定',
      '配合监管部门现场检查'
    ],
    urgency: 'medium'
  },

  // 商业化层岗位
  {
    id: 'regulatory-manager-1',
    title: '注册事务经理',
    nodeId: 'market-access',
    layer: 'commercialization',
    company: '复星医药',
    location: '上海',
    salary: '30-45万/年',
    requirements: [
      '药学、医学相关专业本科以上',
      '5年以上药品注册申报经验',
      '熟悉NMPA/FDA注册法规流程',
      '具备创新药IND/NDA申报经验优先'
    ],
    responsibilities: [
      '制定药品注册策略和时间规划',
      '准备和递交注册申报资料',
      '与监管部门沟通协调技术问题',
      '跟踪法规动态更新内部SOP'
    ],
    urgency: 'high'
  },
  {
    id: 'supply-chain-1',
    title: '药品供应链总监',
    nodeId: 'distribution-channels',
    layer: 'commercialization',
    company: '扬子江药业',
    location: '南京',
    salary: '50-80万/年',
    requirements: [
      '供应链管理、物流工程硕士优先',
      '10年以上医药行业供应链经验',
      '熟悉GSP认证和冷链运输要求',
      '具备大型制药企业管理经验'
    ],
    responsibilities: [
      '建设全国药品分销网络体系',
      '优化库存管理和物流配送效率',
      '制定供应链风险管控策略',
      '管理核心经销商关系和渠道政策'
    ],
    urgency: 'medium'
  },
  {
    id: 'pharmacovigilance-1',
    title: '药物警戒专员',
    nodeId: 'patient-services',
    layer: 'commercialization',
    company: '绿叶制药',
    location: '烟台',
    salary: '18-28万/年',
    requirements: [
      '临床医学、药学本科以上学历',
      '具备药物警戒/不良反应监测经验',
      '熟悉ICH-E2系列指导原则',
      '良好的英文读写和医学统计能力'
    ],
    responsibilities: [
      '建立药物警戒数据库和SOP',
      '收集处理药物不良反应报告',
      '编制定期安全性更新报告(PSUR)',
      '参与风险管理计划制定和更新'
    ],
    urgency: 'low'
  }
];

// 按产业链层级组织的岗位统计
export const jobStatsByLayer = {
  discovery: {
    name: '药物发现层',
    totalJobs: 67,
    avgSalary: '25-45万',
    hotSkills: ['CADD技术', '生物信息学', '有机合成', '药代动力学']
  },
  development: {
    name: '开发与生产层', 
    totalJobs: 125,
    avgSalary: '30-55万',
    hotSkills: ['cGMP认证', '制剂开发', '临床研究', 'GCP合规']
  },
  commercialization: {
    name: '商业化层',
    totalJobs: 59,
    avgSalary: '25-50万',
    hotSkills: ['注册法规', '供应链管理', '药物警戒', '市场准入']
  }
};
