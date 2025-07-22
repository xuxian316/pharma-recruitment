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
  layer: 'development' | 'formulation' | 'commercialization';
  skills: SkillTree[];
  connections: string[];
  jobCount: number;
}

export interface JobPosition {
  id: string;
  title: string;
  nodeId: string;
  layer: 'development' | 'formulation' | 'commercialization';
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  responsibilities: string[];
  urgency: 'low' | 'medium' | 'high';
}

// 功效化妆品产业链三阶段架构数据
export const cosmeticsChainData: ChainNode[] = [
  // 活性成分开发层
  {
    id: 'natural-extraction',
    name: '天然产物提取',
    description: '从植物、微生物中提取活性成分',
    layer: 'development',
    skills: [
      {
        id: 'extraction-technology',
        name: '提取技术',
        category: 'technical',
        level: 'advanced',
        description: '超临界流体、微波辅助提取技术'
      },
      {
        id: 'phytochemistry',
        name: '植物化学',
        category: 'research',
        level: 'expert',
        description: '天然产物结构鉴定、活性评价'
      }
    ],
    connections: ['synthetic-biology'],
    jobCount: 16
  },
  {
    id: 'synthetic-biology',
    name: '合成生物学改造',
    description: '通过合成生物学技术优化活性分子',
    layer: 'development',
    skills: [
      {
        id: 'metabolic-engineering',
        name: '代谢工程',
        category: 'research',
        level: 'expert',
        description: '微生物发酵生产功效成分'
      },
      {
        id: 'protein-expression',
        name: '蛋白表达',
        category: 'technical',
        level: 'advanced',
        description: '重组蛋白、酶工程技术'
      }
    ],
    connections: ['functional-modification'],
    jobCount: 14
  },
  {
    id: 'functional-modification',
    name: '功效分子修饰',
    description: '改造活性分子提高皮肤渗透性和稳定性',
    layer: 'development',
    skills: [
      {
        id: 'molecular-design',
        name: '分子设计',
        category: 'research',
        level: 'expert',
        description: '分子对接、QSAR分析'
      },
      {
        id: 'skin-penetration-design',
        name: '皮肤渗透性设计',
        category: 'technical',
        level: 'advanced',
        description: '载体设计、透皮增强剂选择'
      }
    ],
    connections: ['matrix-emulsification'],
    jobCount: 18
  },

  // 配方工艺层
  {
    id: 'matrix-emulsification',
    name: '基质复配乳化',
    description: '设计配方基质和乳化体系',
    layer: 'formulation',
    skills: [
      {
        id: 'emulsion-technology',
        name: '乳化技术',
        category: 'technical',
        level: 'advanced',
        description: 'HLB值计算、相行为研究'
      },
      {
        id: 'rheology-control',
        name: '流变控制',
        category: 'technical',
        level: 'intermediate',
        description: '粘度调节、触变性控制'
      }
    ],
    connections: ['stability-testing'],
    jobCount: 22
  },
  {
    id: 'stability-testing',
    name: '稳定性测试',
    description: '评估产品在不同条件下的稳定性',
    layer: 'formulation',
    skills: [
      {
        id: 'accelerated-testing',
        name: '加速稳定性试验',
        category: 'technical',
        level: 'advanced',
        description: '高温高湿条件下的稳定性评价'
      },
      {
        id: 'weatherability-testing',
        name: '耐候性测试',
        category: 'technical',
        level: 'intermediate',
        description: '光稳定性、氧化稳定性测试'
      }
    ],
    connections: ['sensory-evaluation'],
    jobCount: 20
  },
  {
    id: 'sensory-evaluation',
    name: '感官评价',
    description: '评估产品的使用感受和消费者体验',
    layer: 'formulation',
    skills: [
      {
        id: 'triangle-analysis',
        name: '肤感三角分析法',
        category: 'technical',
        level: 'expert',
        description: '滑腻度、清爽度、滋润度定量评价'
      },
      {
        id: 'visia-analysis',
        name: 'VISIA皮肤分析仪操作',
        category: 'technical',
        level: 'advanced',
        description: '皮肤纹理、色斑、毛孔检测'
      },
      {
        id: 'sensory-weighting',
        name: '感官评价权重',
        category: 'business',
        level: 'advanced',
        description: '感官评价在产品开发中占比40%'
      }
    ],
    connections: ['claim-support'],
    jobCount: 25
  },

  // 市场转化层
  {
    id: 'claim-support',
    name: '宣称支持',
    description: '为产品功效宣称提供科学依据',
    layer: 'commercialization',
    skills: [
      {
        id: 'efficacy-testing',
        name: '功效测试',
        category: 'research',
        level: 'advanced',
        description: '体外细胞试验、人体功效试验'
      },
      {
        id: 'eu-cosmetics-regulation',
        name: 'EC No 1223/2009合规',
        category: 'regulatory',
        level: 'expert',
        description: '欧盟化妆品法规条款应用'
      },
      {
        id: 'safety-assessment',
        name: '安全性评估',
        category: 'regulatory',
        level: 'advanced',
        description: '皮肤刺激性、致敏性评价'
      }
    ],
    connections: ['channel-customization'],
    jobCount: 28
  },
  {
    id: 'channel-customization',
    name: '渠道定制生产',
    description: '针对不同销售渠道定制产品',
    layer: 'commercialization',
    skills: [
      {
        id: 'market-segmentation',
        name: '市场细分',
        category: 'business',
        level: 'intermediate',
        description: '年龄、肤质、消费习惯细分'
      },
      {
        id: 'packaging-design',
        name: '包装设计',
        category: 'business',
        level: 'intermediate',
        description: '包装材料选择、外观设计'
      }
    ],
    connections: ['consumer-reach'],
    jobCount: 18
  },
  {
    id: 'consumer-reach',
    name: '消费者触达',
    description: '通过多渠道接触目标消费者',
    layer: 'commercialization',
    skills: [
      {
        id: 'digital-marketing',
        name: '数字化营销',
        category: 'business',
        level: 'intermediate',
        description: '社交媒体、KOL合作营销'
      },
      {
        id: 'consumer-education',
        name: '消费者教育',
        category: 'business',
        level: 'basic',
        description: '护肤知识科普、产品使用指导'
      }
    ],
    connections: [],
    jobCount: 15
  }
];

// 功效化妆品行业警示信息
export const cosmeticsIndustryAlerts = {
  sensoryImportance: {
    title: '感官评价权重占比40%',
    description: '功效化妆品中消费者体验感受占据重要地位',
    impact: '需要平衡功效与使用感受，感官评价技能至关重要'
  },
  regulatoryCompliance: {
    title: 'EC No 1223/2009合规要求',
    description: '欧盟化妆品法规对功效宣称有严格要求',
    impact: '必须具备法规解读和合规申报能力'
  },
  industryDifferences: {
    title: '与其他化工领域差异',
    comparisons: [
      {
        field: '医药行业',
        differences: ['临床试验周期长', '安全性要求极高', '监管严格'],
        cosmeticsRequirement: '化妆品注重消费者体验和快速迭代，上市周期短'
      },
      {
        field: '精细化工',
        differences: ['B2B业务模式', '技术导向', '性能指标明确'],
        cosmeticsRequirement: '化妆品面向C端消费者，需要兼顾功效、安全和感官体验'
      }
    ]
  },
  keyTechnologies: {
    title: '核心技术要求',
    technologies: [
      '皮肤渗透性设计：确保活性成分有效渗透',
      '肤感三角分析法：定量评价产品使用感受',
      'VISIA皮肤分析仪：客观评估护肤效果',
      '耐候性测试标准：确保产品稳定性'
    ]
  }
};
