export interface SkillTree {
  id: string;
  name: string;
  category: 'technical' | 'regulatory' | 'business' | 'research';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  description: string;
}

export interface ChainNode {
  id: string;
  name: string;
  description: string;
  layer: 'discovery' | 'development' | 'commercialization';
  skills: SkillTree[];
  connections: string[];
  jobCount: number;
}

export interface JobPosition {
  id: string;
  title: string;
  nodeId: string;
  layer: 'discovery' | 'development' | 'commercialization';
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  responsibilities: string[];
  urgency: 'low' | 'medium' | 'high';
}

// 药物产业链三层结构数据
export const pharmaChainData: ChainNode[] = [
  // 上游：药物发现层
  {
    id: 'target-identification',
    name: '靶点识别',
    description: '通过生物信息学和分子生物学技术识别疾病相关靶点',
    layer: 'discovery',
    skills: [
      {
        id: 'bioinformatics',
        name: '生物信息学',
        category: 'technical',
        level: 'advanced',
        description: '掌握基因组学、蛋白质组学数据分析'
      },
      {
        id: 'molecular-biology',
        name: '分子生物学',
        category: 'research',
        level: 'expert',
        description: '细胞信号传导、基因表达调控机制'
      }
    ],
    connections: ['molecular-design'],
    jobCount: 15
  },
  {
    id: 'molecular-design',
    name: '分子设计',
    description: '基于靶点结构进行先导化合物设计',
    layer: 'discovery',
    skills: [
      {
        id: 'cadd',
        name: 'CADD技术',
        category: 'technical',
        level: 'expert',
        description: '计算机辅助药物设计，分子对接模拟'
      },
      {
        id: 'medicinal-chemistry',
        name: '药物化学',
        category: 'research',
        level: 'advanced',
        description: '结构-活性关系分析，化合物优化'
      }
    ],
    connections: ['compound-synthesis'],
    jobCount: 22
  },
  {
    id: 'compound-synthesis',
    name: '化合物合成',
    description: '合成目标化合物并进行结构确证',
    layer: 'discovery',
    skills: [
      {
        id: 'organic-synthesis',
        name: '有机合成',
        category: 'technical',
        level: 'advanced',
        description: '多步合成路线设计，反应条件优化'
      },
      {
        id: 'analytical-chemistry',
        name: '分析化学',
        category: 'technical',
        level: 'intermediate',
        description: 'NMR、MS、HPLC等结构表征技术'
      }
    ],
    connections: ['pharmacological-screening'],
    jobCount: 18
  },
  {
    id: 'pharmacological-screening',
    name: '药理筛选',
    description: '评估化合物的生物活性和安全性',
    layer: 'discovery',
    skills: [
      {
        id: 'in-vitro-assay',
        name: '体外试验',
        category: 'research',
        level: 'advanced',
        description: '细胞培养、酶活性检测、受体结合试验'
      },
      {
        id: 'pharmacokinetics',
        name: '药代动力学',
        category: 'research',
        level: 'intermediate',
        description: 'ADME性质评估，代谢稳定性分析'
      }
    ],
    connections: ['cmc-development'],
    jobCount: 12
  },

  // 中游：开发与生产层
  {
    id: 'cmc-development',
    name: 'CMC开发',
    description: '化学、制造和控制开发，确保药物质量',
    layer: 'development',
    skills: [
      {
        id: 'pharmaceutical-development',
        name: '制剂开发',
        category: 'technical',
        level: 'expert',
        description: '剂型设计、稳定性研究、工艺开发'
      },
      {
        id: 'quality-control',
        name: '质量控制',
        category: 'regulatory',
        level: 'advanced',
        description: 'ICH指导原则、分析方法验证'
      }
    ],
    connections: ['preclinical-research'],
    jobCount: 28
  },
  {
    id: 'preclinical-research',
    name: '临床前研究',
    description: '动物模型中的药效学和毒理学评估',
    layer: 'development',
    skills: [
      {
        id: 'toxicology',
        name: '毒理学',
        category: 'research',
        level: 'advanced',
        description: '安全性评估、毒代动力学、致癌性研究'
      },
      {
        id: 'animal-models',
        name: '动物模型',
        category: 'research',
        level: 'intermediate',
        description: '疾病模型建立、实验动物管理'
      }
    ],
    connections: ['clinical-trials'],
    jobCount: 20
  },
  {
    id: 'clinical-trials',
    name: '临床试验',
    description: '人体临床研究，验证药物安全性和有效性',
    layer: 'development',
    skills: [
      {
        id: 'clinical-research',
        name: '临床研究',
        category: 'research',
        level: 'expert',
        description: '试验设计、数据管理、统计分析'
      },
      {
        id: 'gcp-compliance',
        name: 'GCP合规',
        category: 'regulatory',
        level: 'advanced',
        description: '良好临床实践规范、伦理审查'
      }
    ],
    connections: ['gmp-production'],
    jobCount: 35
  },
  {
    id: 'gmp-production',
    name: 'GMP生产',
    description: '符合药品生产质量管理规范的商业化生产',
    layer: 'development',
    skills: [
      {
        id: 'gmp-certification',
        name: 'cGMP认证',
        category: 'regulatory',
        level: 'expert',
        description: '现行药品生产质量管理规范认证'
      },
      {
        id: 'manufacturing-processes',
        name: '生产工艺',
        category: 'technical',
        level: 'advanced',
        description: '规模化生产、工艺验证、设备维护'
      }
    ],
    connections: ['market-access'],
    jobCount: 42
  },

  // 下游：商业化层
  {
    id: 'market-access',
    name: '市场准入',
    description: '药品注册申报和市场准入策略',
    layer: 'commercialization',
    skills: [
      {
        id: 'regulatory-affairs',
        name: '注册法规',
        category: 'regulatory',
        level: 'expert',
        description: 'FDA、EMA、NMPA注册申报流程'
      },
      {
        id: 'health-economics',
        name: '卫生经济学',
        category: 'business',
        level: 'advanced',
        description: '药物经济学评估、定价策略'
      }
    ],
    connections: ['distribution-channels'],
    jobCount: 25
  },
  {
    id: 'distribution-channels',
    name: '分销渠道',
    description: '药品分销网络建设和渠道管理',
    layer: 'commercialization',
    skills: [
      {
        id: 'supply-chain',
        name: '供应链管理',
        category: 'business',
        level: 'advanced',
        description: '冷链物流、库存管理、质量追溯'
      },
      {
        id: 'channel-management',
        name: '渠道管理',
        category: 'business',
        level: 'intermediate',
        description: '经销商网络、终端覆盖、价格体系'
      }
    ],
    connections: ['patient-services'],
    jobCount: 18
  },
  {
    id: 'patient-services',
    name: '患者服务',
    description: '患者教育、用药指导和不良反应监测',
    layer: 'commercialization',
    skills: [
      {
        id: 'pharmacovigilance',
        name: '药物警戒',
        category: 'regulatory',
        level: 'advanced',
        description: '不良反应监测、风险管理计划'
      },
      {
        id: 'patient-education',
        name: '患者教育',
        category: 'business',
        level: 'intermediate',
        description: '用药依从性、疾病管理、健康咨询'
      }
    ],
    connections: [],
    jobCount: 16
  }
];

// 医药行业警示信息
export const pharmaIndustryAlerts = {
  developmentCycle: {
    title: '12年研发周期',
    description: '药物从发现到上市平均需要12-15年，投资回报周期长',
    impact: '需要极强的耐心和长期规划能力'
  },
  regulatoryCompliance: {
    title: 'FDA/GMP强制合规',
    description: '药品必须严格遵守FDA、EMA、NMPA等监管机构要求',
    impact: '零容错率，合规成本高昂'
  },
  industryDifferences: {
    title: '与其他化工领域差异',
    comparisons: [
      {
        field: '电子材料',
        differences: ['创新周期短(1-2年)', '技术迭代快', '市场驱动型'],
        pharmaRequirement: '药物研发需要深度生物学背景，注重安全性验证'
      },
      {
        field: '日化品',
        differences: ['消费者导向', '营销驱动', '成本敏感'],
        pharmaRequirement: '药物开发以临床需求为导向，科学严谨性要求极高'
      }
    ]
  }
};
