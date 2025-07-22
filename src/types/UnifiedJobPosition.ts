// 统一的JobPosition接口，支持所有行业的layer类型
export interface UnifiedJobPosition {
  id: string;
  title: string;
  nodeId: string;
  layer: string; // 支持所有行业的层级字符串
  company: string;
  location: string;
  salary: string;
  experience?: string; // 经验要求
  education?: string; // 学历要求
  companySize?: string; // 公司规模
  industryType?: string; // 行业类型
  requirements: string[];
  responsibilities: string[];
  urgency: 'low' | 'medium' | 'high';
  link?: string; // 职位详情链接
}
