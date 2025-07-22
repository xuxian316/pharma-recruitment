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
  layer: 'creation' | 'transformation' | 'service';
  skills: SkillTree[];
  connections: string[];
  jobCount: number;
}

export interface JobPosition {
  id: string;
  title: string;
  nodeId: string;
  layer: 'creation' | 'transformation' | 'service';
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  responsibilities: string[];
  urgency: 'low' | 'medium' | 'high';
}

// 农药科学产业链三层架构数据
export const pesticidesChainData: ChainNode[] = [
  // 创制分子层
  {
    id: 'target-screening',
    name: '靶标生物筛选',
    description: '筛选潜在的作用靶标以开发农药',
    layer: 'creation',
    skills: [
      {
        id: 'bioassays',
        name: '生物测定',
        category: 'technical',
        level: 'advanced',
        description: '体外和体内生物测试'
      },
      {
        id: 'molecular-biology',
        name: '分子生物学',
        category: 'research',
        level: 'expert',
        description: '分子克隆、基因编辑技术'
      }
    ],
    connections: ['lead-compound-synthesis'],
    jobCount: 18
  },
  {
    id: 'lead-compound-synthesis',
    name: '先导化合物合成',
    description: '合成具有潜力的先导化合物',
    layer: 'creation',
    skills: [
      {
        id: 'synthetic-chemistry',
        name: '合成化学',
        category: 'technical',
        level: 'advanced',
        description: '复杂有机分子的合成'
      },
      {
        id: 'chiral-synthesis',
        name: '手性合成',
        category: 'research',
        level: 'expert',
        description: '手性中心形成与拆分'
      }
    ],
    connections: ['qsar-analysis'],
    jobCount: 21
  },
  {
    id: 'qsar-analysis',
    name: '构效关系优化',
    description: '优化化合物的结构以增强活性',
    layer: 'creation',
    skills: [
      {
        id: 'computational-chemistry',
        name: '计算化学',
        category: 'technical',
        level: 'advanced',
        description: '分子模拟与动力学'
      },
      {
        id: 'admet',
        name: 'ADMET预测',
        category: 'research',
        level: 'advanced',
        description: '药物的吸收、分布、代谢、排泄及毒性'
      }
    ],
    connections: ['formulation-development'],
    jobCount: 19
  },

  // 产业转化层
  {
    id: 'formulation-development',
    name: '制剂开发',
    description: '开发能够有效传递活性成分的制剂',
    layer: 'transformation',
    skills: [
      {
        id: 'emulsification-technology',
        name: '乳化技术',
        category: 'technical',
        level: 'advanced',
        description: '开发悬浮剂和乳油制剂'
      },
      {
        id: 'controlled-release',
        name: '控释技术',
        category: 'technical',
        level: 'advanced',
        description: '缓释剂型设计'
      }
    ],
    connections: ['regulatory-documents'],
    jobCount: 22
  },
  {
    id: 'regulatory-documents',
    name: '登记资料生成',
    description: '准备产品注册所需的各种文件',
    layer: 'transformation',
    skills: [
      {
        id: 'glp-certification',
        name: 'GLP认证',
        category: 'regulatory',
        level: 'expert',
        description: '良好实验室规范认证'
      },
      {
        id: 'environmental-toxicity',
        name: '环境毒性评估',
        category: 'regulatory',
        level: 'advanced',
        description: '土壤、水生环境及非靶标生物毒性评估'
      }
    ],
    connections: ['environmental-monitoring'],
    jobCount: 27
  },
  {
    id: 'environmental-monitoring',
    name: '环境监测与安全数据',
    description: '确保使用过程中的环境安全性',
    layer: 'transformation',
    skills: [
      {
        id: 'eco-risk-assessment',
        name: '生态风险评估',
        category: 'regulatory',
        level: 'advanced',
        description: '风险评估及管理策略'
      },
      {
        id: 'resistance-management',
        name: '抗性管理',
        category: 'technical',
        level: 'advanced',
        description: '抗性发展趋势监测'
      }
    ],
    connections: ['crop-protection-design'],
    jobCount: 30
  },

  // 应用服务层
  {
    id: 'crop-protection-design',
    name: '植保方案设计',
    description: '为不同农作物和病虫害设计合适的解决方案',
    layer: 'service',
    skills: [
      {
        id: 'integrated-pest-management',
        name: '综合虫害管理',
        category: 'technical',
        level: 'expert',
        description: '综合制剂、作物管理与环境保护'
      },
      {
        id: 'field-efficacy',
        name: '田间有效性',
        category: 'research',
        level: 'advanced',
        description: '实地试验与数据分析'
      }
    ],
    connections: ['precision-application-system'],
    jobCount: 25
  },
  {
    id: 'precision-application-system',
    name: '精准施药系统',
    description: '开发提高药效及减少浪费的施药系统',
    layer: 'service',
    skills: [
      {
        id: 'drone-technology',
        name: '无人机施药技术',
        category: 'technical',
        level: 'advanced',
        description: '无人机施药系统集成'
      },
      {
        id: 'spray-optimization',
        name: '喷洒优化设计',
        category: 'technical',
        level: 'advanced',
        description: '喷雾器类型、喷雾参数设置'
      }
    ],
    connections: ['yield-enhancement'],
    jobCount: 21
  },
  {
    id: 'yield-enhancement',
    name: '增产收益保障',
    description: '保证最终农作物产量的提高',
    layer: 'service',
    skills: [
      {
        id: 'agricultural-economics',
        name: '农业经济学',
        category: 'business',
        level: 'intermediate',
        description: '收益模拟与农场管理'
      },
      {
        id: 'sustainability',
        name: '可持续发展',
        category: 'research',
        level: 'advanced',
        description: '长期环境与经济效益平衡'
      }
    ],
    connections: [],
    jobCount: 18
  }
];

// 农药科学行业警示信息
export const pesticidesIndustryAlerts = {
  fieldData: {
    title: '12个月田间数据周期',
    description: '长期田间数据收集和分析是农药科学行业的重要环节',
    impact: '需要投入大量时间和资源进行持续的田间试验'
  },
  resistanceWeighting: {
    title: '抗性监测权重>理论创新',
    description: '抗性管理比单纯化合物研发更受到重视',
    impact: '从研发到田间应用的全周期监测和调整'
  },
  industryDifferences: {
    title: '与其他化工领域差异',
    comparisons: [
      {
        field: '精细化工',
        differences: ['小规模批次', '定制化产品', '高利润率'],
        pesticidesRequirement: '农药科学更强调大规模应用和环境影响'
      },
      {
        field: '生物技术',
        differences: ['基因改造', '细胞培养', '个性化疗法'],
        pesticidesRequirement: '农药行业注重生态系统的整体平衡与作物保护'
      }
    ]
  },
  keyTechnologies: {
    title: '核心技能要求',
    technologies: [
      '田间有效性：根据实地试验结果调整策略',
      'GLP实验室认证：合规性及质量保证',
      '抗性监测：前瞻性地调整农药策略'
    ]
  }
};
