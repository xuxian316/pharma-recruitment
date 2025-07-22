'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Building2, MapPin, DollarSign, ChevronDown, Star, Zap, Users, TrendingUp, Search, ExternalLink } from 'lucide-react';
import { UnifiedJobPosition } from '@/types/UnifiedJobPosition';

// 工作数据统计类型
type StatsType = Record<string, { name: string; totalJobs: number; avgSalary: string; hotSkills: string[] }>;

// 临时统计数据类型
type TempStatsType = Record<string, { 
  name: string; 
  totalJobs: number; 
  avgSalary: string; 
  hotSkills: string[];
  salaries?: string[];
  requirements?: string[][];
}>;

interface JobDatabaseProps {
  selectedNodeId?: string;
  selectedNodeName?: string;
  jobPositions: UnifiedJobPosition[];
}

export default function JobDatabase({ selectedNodeId, selectedNodeName, jobPositions }: JobDatabaseProps) {

  // 层级名称映射
  const layerNames = {
    discovery: '药物发现层',
    development: '开发与生产层',
    commercialization: '商业化层',
    creation: '原料创制层',
    transformation: '材料转化层',
    service: '配套服务层',
    innovation: '技术创新层',
    engineering: '工程应用层',
    integration: '系统集成层',
    formulation: '配方研发层'
  } as const;

  // 动态计算统计信息
  const stats = useMemo(() => {
    const tempStats: TempStatsType = {};
    
    // 计算薪资平均值的辅助函数
    const calculateAvgSalary = (salaries: string[]) => {
      if (salaries.length === 0) return '面议';
      
      const validSalaries = salaries.filter(salary => {
        const match = salary.match(/(\d+)-(\d+)k/);
        return match !== null;
      });
      
      if (validSalaries.length === 0) return '面议';
      
      const avgSalary = validSalaries.reduce((sum, salary) => {
        const match = salary.match(/(\d+)-(\d+)k/);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          return sum + (min + max) / 2;
        }
        return sum;
      }, 0) / validSalaries.length;
      
      return `${Math.round(avgSalary)}k左右`;
    };

    // 提取技能热词的辅助函数
    const extractHotSkills = (requirements: string[][]) => {
      const skillCount = new Map<string, number>();
      const commonSkills = ['有机合成', '分析化学', '药物设计', '分子筛选', '制剂开发', '临床研究', 'GMP认证', '质量控制', '注册申报', '市场推广', '销售管理', '商务拓展', '化学', '生物', '医学', '药学', '研发', '实验', '技术', '管理'];
      
      requirements.flat().forEach(req => {
        commonSkills.forEach(skill => {
          if (req.includes(skill)) {
            skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
          }
        });
      });
      
      return Array.from(skillCount.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([skill]) => skill);
    };

    jobPositions.forEach((job) => {
      const layer = job.layer;
      if (!tempStats[layer]) {
        tempStats[layer] = {
          name: layerNames[layer as keyof typeof layerNames] || layer,
          totalJobs: 0,
          avgSalary: '面议',
          hotSkills: [],
          salaries: [],
          requirements: []
        };
      }
      tempStats[layer].totalJobs++;
      tempStats[layer].salaries!.push(job.salary);
      tempStats[layer].requirements!.push(job.requirements);
    });

    // 计算每个层级的平均薪资和热门技能
    Object.keys(tempStats).forEach(layer => {
      const layerData = tempStats[layer];
      layerData.avgSalary = calculateAvgSalary(layerData.salaries || []);
      layerData.hotSkills = extractHotSkills(layerData.requirements || []);
      
      // 如果没有提取到技能，使用默认技能
      if (layerData.hotSkills.length === 0) {
        switch (layer) {
          case 'discovery':
            layerData.hotSkills = ['有机合成', '分析化学', '药物设计', '分子筛选'];
            break;
          case 'development':
            layerData.hotSkills = ['制剂开发', '临床研究', 'GMP认证', '质量控制'];
            break;
          case 'commercialization':
            layerData.hotSkills = ['注册申报', '市场推广', '销售管理', '商务拓展'];
            break;
          default:
            layerData.hotSkills = ['技术研发', '项目管理', '质量控制', '团队协作'];
        }
      }
      
      // 清理临时数据
      delete layerData.salaries;
      delete layerData.requirements;
    });
    
    // 转换为最终类型
    const finalStats: StatsType = {};
    Object.keys(tempStats).forEach(layer => {
      finalStats[layer] = {
        name: tempStats[layer].name,
        totalJobs: tempStats[layer].totalJobs,
        avgSalary: tempStats[layer].avgSalary,
        hotSkills: tempStats[layer].hotSkills
      };
    });
    
    return finalStats;
  }, [jobPositions]);
  
  // 状态管理
  const [filteredJobs, setFilteredJobs] = useState<UnifiedJobPosition[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 样式配置
  const urgencyConfig = {
    low: { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: '普通', icon: '●' },
    medium: { style: 'bg-amber-50 text-amber-700 border-amber-200', text: '紧急', icon: '◐' },
    high: { style: 'bg-rose-50 text-rose-700 border-rose-200', text: '急招', icon: '◆' }
  };

  const layerConfig = {
    discovery: { style: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300', color: 'text-yellow-800' },
    development: { style: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300', color: 'text-blue-800' },
    commercialization: { style: 'bg-gradient-to-br from-green-50 to-teal-50 border-green-300', color: 'text-green-800' },
    creation: { style: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300', color: 'text-purple-800' },
    transformation: { style: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300', color: 'text-cyan-800' },
    service: { style: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300', color: 'text-emerald-800' },
    innovation: { style: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-300', color: 'text-violet-800' },
    engineering: { style: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300', color: 'text-orange-800' },
    integration: { style: 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300', color: 'text-teal-800' },
    formulation: { style: 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-300', color: 'text-indigo-800' }
  };

  // 过滤和搜索逻辑
  useEffect(() => {
    console.log('[DEBUG] JobDatabase: Filtering jobs. Input positions:', jobPositions.length);
    console.log('[DEBUG] JobDatabase: Filter conditions:', { selectedNodeId, selectedLayer, searchTerm });
    
    let jobs: UnifiedJobPosition[] = jobPositions;
    
    if (selectedNodeId) {
      jobs = jobs.filter(job => job.nodeId === selectedNodeId);
      console.log('[DEBUG] JobDatabase: After nodeId filter:', jobs.length);
    }
    
    if (selectedLayer) {
      jobs = jobs.filter(job => job.layer === selectedLayer);
      console.log('[DEBUG] JobDatabase: After layer filter:', jobs.length);
    }
    
    if (searchTerm) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('[DEBUG] JobDatabase: After search filter:', jobs.length);
    }
    
    console.log('[DEBUG] JobDatabase: Final filtered jobs:', jobs.length);
    console.log('[DEBUG] JobDatabase: Sample filtered job:', jobs[0]);
    setFilteredJobs(jobs);
  }, [jobPositions, selectedNodeId, selectedLayer, searchTerm]);

  // 优化的事件处理函数
  const handleLayerToggle = useCallback((layer: string) => {
    setSelectedLayer(prev => prev === layer ? null : layer);
  }, []);

  const handleJobToggle = useCallback((jobId: string) => {
    setExpandedJob(prev => prev === jobId ? null : jobId);
  }, []);

  const getUrgencyConfig = useCallback((urgency: string) => {
    return urgencyConfig[urgency as keyof typeof urgencyConfig] || 
           { style: 'bg-gray-50 text-gray-700 border-gray-200', text: '普通', icon: '●' };
  }, []);

  const getLayerConfig = useCallback((layer: string) => {
    return layerConfig[layer as keyof typeof layerConfig] || 
           { style: 'bg-gray-50 border-gray-200', color: 'text-gray-800' };
  }, []);

  return (
    <div id="job-database" className="w-full bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 优化的头部区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            {selectedNodeName ? `${selectedNodeName} - 相关职位` : '智能招聘平台'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {selectedNodeName ? 
              `为您精准匹配 ${selectedNodeName} 领域的优质职位` :
              '基于产业链智能分层的专业人才招聘解决方案'
            }
          </p>
        </div>

        {/* 搜索和过滤区域 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索职位、公司或地点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredJobs.length} 个职位</span>
            </div>
          </div>
        </div>

        {/* 优化的层级统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(stats).map(([layer, layerStats]) => {
            const layerConfig = getLayerConfig(layer);
            const isSelected = selectedLayer === layer;
            return (
              <div
                key={layer}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? `${layerConfig.style} border-2 shadow-lg scale-105`
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg hover:scale-102'
                } rounded-2xl overflow-hidden`}
                onClick={() => handleLayerToggle(layer)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${isSelected ? layerConfig.color : 'text-gray-800'}`}>
                      {layerStats.name}
                    </h3>
                    <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-current' : 'bg-gray-300'}`}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{layerStats.totalJobs}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">{layerStats.avgSalary}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {layerStats.hotSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100/70 text-gray-700 text-xs font-medium rounded-full border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 优化的职位列表 */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">暂无匹配职位</h3>
              <p className="text-gray-500 max-w-md mx-auto">请尝试调整搜索条件或选择其他行业层级</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const urgencyConfig = getUrgencyConfig(job.urgency);
              const layerConfig = getLayerConfig(job.layer);
              const isExpanded = expandedJob === job.id;
              
              return (
                <div
                  key={job.id}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border inline-flex items-center gap-1 ${urgencyConfig.style}`}>
                                <span className="text-current">{urgencyConfig.icon}</span>
                                {urgencyConfig.text}
                              </span>
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${layerConfig.style} ${layerConfig.color}`}>
                                {(stats as StatsType)[job.layer]?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{job.company}</p>
                              <p className="text-xs text-gray-500">公司</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{job.location}</p>
                              <p className="text-xs text-gray-500">地点</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-emerald-600">{job.salary}</p>
                              <p className="text-xs text-gray-500">薪资</p>
                            </div>
                          </div>
                          
                          {(job as any).experience && (
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{(job as any).experience}</p>
                                <p className="text-xs text-gray-500">经验要求</p>
                              </div>
                            </div>
                          )}
                          
                          {(job as any).education && (
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                <Star className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{(job as any).education}</p>
                                <p className="text-xs text-gray-500">学历要求</p>
                              </div>
                            </div>
                          )}
                          
                          {(job as any).companySize && (
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-cyan-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{(job as any).companySize}</p>
                                <p className="text-xs text-gray-500">公司规模</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.requirements.slice(0, 4).map((req, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-200"
                            >
                              {req}
                            </span>
                          ))}
                          {job.requirements.length > 4 && (
                            <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl">
                              +{job.requirements.length - 4} 项要求
                            </span>
                          )}
                        </div>
                        
                        {/* 岗位详情按钮 */}
                        <div className="mt-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const link = (job as any).link;
                              if (link && link.trim() !== '') {
                                window.open(link, '_blank', 'noopener,noreferrer');
                              } else {
                                alert('该职位暂无详情链接，请直接联系公司');
                              }
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            岗位详情
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJobToggle(job.id)}
                        className="ml-6 p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <ChevronDown 
                          className={`w-6 h-6 transform transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Star className="w-4 h-4 text-blue-600" />
                            </div>
                            岗位要求
                          </h4>
                          <div className="space-y-3">
                            {job.requirements.map((req, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Zap className="w-4 h-4 text-green-600" />
                            </div>
                            工作职责
                          </h4>
                          <div className="space-y-3">
                            {job.responsibilities.map((resp, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">{resp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">职位编号:</span> {job.id} | 
                          <span className="font-medium">发布时间:</span> 2024-01-15
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              const link = (job as any).link;
                              if (link && link.trim() !== '') {
                                window.open(link, '_blank', 'noopener,noreferrer');
                              } else {
                                alert('该职位暂无详情链接，请直接联系公司');
                              }
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            岗位详情
                          </button>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                            立即申请
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {filteredJobs.length > 0 && (
          <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <p className="text-lg font-semibold text-blue-900 mb-2">
              🎯 共找到 {filteredJobs.length} 个精选职位
            </p>
            <p className="text-blue-700">
              点击职位卡片下方箭头查看详细信息，找到最适合您的机会
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
