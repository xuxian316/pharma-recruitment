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
  layer: 'innovation' | 'engineering' | 'integration';
  skills: SkillTree[];
  connections: string[];
  jobCount: number;
}

export interface JobPosition {
  id: string;
  title: string;
  nodeId: string;
  layer: 'innovation' | 'engineering' | 'integration';
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  responsibilities: string[];
  urgency: 'low' | 'medium' | 'high';
}

// 锂电材料产业链三阶段架构数据
export const batteryChainData: ChainNode[] = [
  // 材料创新层
  {
    id: 'mineral-purification',
    name: '矿物提纯',
    description: '锂矿石开采和精炼，获得高纯度锂盐',
    layer: 'innovation',
    skills: [
      {
        id: 'extraction-chemistry',
        name: '提取化学',
        category: 'technical',
        level: 'advanced',
        description: '湿法冶金、电解提取技术'
      },
      {
        id: 'mineral-processing',
        name: '选矿工艺',
        category: 'technical',
        level: 'intermediate',
        description: '浮选、磁选等物理选矿方法'
      }
    ],
    connections: ['precursor-synthesis'],
    jobCount: 12
  },
  {
    id: 'precursor-synthesis',
    name: '前驱体合成',
    description: '制备三元前驱体材料，控制形貌和结构',
    layer: 'innovation',
    skills: [
      {
        id: 'coprecipitation',
        name: '共沉淀法',
        category: 'technical',
        level: 'advanced',
        description: '控制pH值、温度、搅拌速度的精密合成'
      },
      {
        id: 'morphology-control',
        name: '形貌控制',
        category: 'research',
        level: 'expert',
        description: '球形度、粒径分布、表面积控制'
      }
    ],
    connections: ['molecular-structure-design'],
    jobCount: 18
  },
  {
    id: 'molecular-structure-design',
    name: '分子结构设计',
    description: '设计和优化正极材料的晶体结构',
    layer: 'innovation',
    skills: [
      {
        id: 'crystal-structure',
        name: '晶体结构学',
        category: 'research',
        level: 'expert',
        description: '层状、尖晶石、橄榄石结构设计'
      },
      {
        id: 'dft-calculation',
        name: 'DFT计算',
        category: 'technical',
        level: 'advanced',
        description: '第一性原理计算，预测材料性能'
      }
    ],
    connections: ['tonnage-scaling'],
    jobCount: 15
  },

  // 工艺工程层
  {
    id: 'tonnage-scaling',
    name: '吨级放大生产',
    description: '将实验室工艺放大到工业化生产规模',
    layer: 'engineering',
    skills: [
      {
        id: 'crystalline-orientation-control',
        name: '晶面取向控制',
        category: 'technical',
        level: 'expert',
        description: '(003)面择优取向，提高倍率性能'
      },
      {
        id: 'particle-size-distribution',
        name: '粒径分布控制',
        category: 'technical',
        level: 'advanced',
        description: 'D50控制在8-12μm，分布窄化'
      },
      {
        id: 'continuous-flow-technology',
        name: '连续流技术',
        category: 'technical',
        level: 'expert',
        description: '反应器设计、传质传热优化'
      }
    ],
    connections: ['microstructure-tuning'],
    jobCount: 25
  },
  {
    id: 'microstructure-tuning',
    name: '微观结构调控',
    description: '精确控制材料的微观结构和表面性质',
    layer: 'engineering',
    skills: [
      {
        id: 'surface-coating',
        name: '表面包覆',
        category: 'technical',
        level: 'advanced',
        description: 'Al2O3、ZrO2包覆提高稳定性'
      },
      {
        id: 'doping-modification',
        name: '掺杂改性',
        category: 'research',
        level: 'advanced',
        description: 'Ti、Mg、Al等元素掺杂优化'
      }
    ],
    connections: ['electrochemical-testing'],
    jobCount: 20
  },
  {
    id: 'electrochemical-testing',
    name: '电化学测试',
    description: '全面评估材料的电化学性能指标',
    layer: 'engineering',
    skills: [
      {
        id: 'bts-600-operation',
        name: 'BTS-600测试仪操作',
        category: 'technical',
        level: 'advanced',
        description: '电池测试系统操作认证'
      },
      {
        id: 'impedance-spectroscopy',
        name: '阻抗谱分析',
        category: 'technical',
        level: 'expert',
        description: 'EIS测试和等效电路拟合'
      },
      {
        id: 'thermal-runaway-simulation',
        name: '热失控仿真',
        category: 'technical',
        level: 'expert',
        description: '动力电池热失控模拟和安全评估'
      }
    ],
    connections: ['cell-factory-import'],
    jobCount: 30
  },

  // 应用集成层
  {
    id: 'cell-factory-import',
    name: '电芯厂导入',
    description: '材料在电芯厂的工艺适配和性能验证',
    layer: 'integration',
    skills: [
      {
        id: 'coating-process-optimization',
        name: '涂布工艺优化',
        category: 'technical',
        level: 'advanced',
        description: '浆料流变性、涂布厚度控制'
      },
      {
        id: 'cell-matching-data',
        name: '电芯适配数据',
        category: 'business',
        level: 'advanced',
        description: '与不同电解液、负极的匹配性数据库'
      }
    ],
    connections: ['pack-system-integration'],
    jobCount: 22
  },
  {
    id: 'pack-system-integration',
    name: 'Pack系统集成',
    description: '电池包的系统集成和管理系统开发',
    layer: 'integration',
    skills: [
      {
        id: 'bms-design',
        name: 'BMS设计',
        category: 'technical',
        level: 'advanced',
        description: '电池管理系统硬件和软件开发'
      },
      {
        id: 'thermal-management',
        name: '热管理系统',
        category: 'technical',
        level: 'intermediate',
        description: '液冷、风冷系统设计'
      },
      {
        id: 'un38-3-certification',
        name: 'UN38.3安全认证',
        category: 'regulatory',
        level: 'expert',
        description: '锂电池运输安全标准认证'
      }
    ],
    connections: ['terminal-application'],
    jobCount: 18
  },
  {
    id: 'terminal-application',
    name: '终端产品应用',
    description: '在电动汽车、储能等终端产品中的应用',
    layer: 'integration',
    skills: [
      {
        id: 'automotive-integration',
        name: '车规级集成',
        category: 'technical',
        level: 'advanced',
        description: 'IATF16949体系，车用电池标准'
      },
      {
        id: 'energy-storage-application',
        name: '储能应用',
        category: 'business',
        level: 'intermediate',
        description: '电网储能、家用储能系统设计'
      }
    ],
    connections: [],
    jobCount: 14
  }
];

// 锂电材料行业警示信息
export const batteryIndustryAlerts = {
  productionCycle: {
    title: '量产导向特性',
    description: '锂电材料注重量产工艺的连续性和稳定性',
    impact: '需要具备工程化思维和规模化生产经验'
  },
  safetyRequirements: {
    title: 'UN38.3强制认证',
    description: '锂电池必须通过联合国运输安全测试',
    impact: '安全认证是行业准入的硬性要求'
  },
  industryDifferences: {
    title: '与其他化工领域差异',
    comparisons: [
      {
        field: '传统化工',
        differences: ['连续生产', '化学反应为主', '产品单一'],
        batteryRequirement: '锂电材料需要精确的材料学控制和电化学性能优化'
      },
      {
        field: '精细化工',
        differences: ['小批量生产', '高附加值', '技术密集'],
        batteryRequirement: '锂电材料要求大规模制造与精密控制的平衡'
      }
    ]
  },
  keyTechnologies: {
    title: '核心技术要求',
    technologies: [
      '连续流技术：确保大规模生产的稳定性',
      '晶面取向控制：影响电池的倍率性能',
      '电芯适配数据：与下游客户的紧密合作',
      '热失控仿真技能：动力电池安全性保障'
    ]
  }
};
