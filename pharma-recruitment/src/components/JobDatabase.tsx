'use client';

import React, { useState, useEffect } from 'react';
import { jobPositions, jobStatsByLayer } from '@/data/jobsData';
import { JobPosition } from '@/data/pharmaChain';
import { Building2, MapPin, DollarSign, Clock, AlertCircle, ChevronRight, Star } from 'lucide-react';

interface JobDatabaseProps {
  selectedNodeId?: string;
  selectedNodeName?: string;
}

export default function JobDatabase({ selectedNodeId, selectedNodeName }: JobDatabaseProps) {
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>(jobPositions);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // 当选中节点变化时，过滤相关职位
  useEffect(() => {
    if (selectedNodeId) {
      const nodeJobs = jobPositions.filter(job => job.nodeId === selectedNodeId);
      setFilteredJobs(nodeJobs);
      // 自动选择对应层级
      if (nodeJobs.length > 0) {
        setSelectedLayer(nodeJobs[0].layer);
      }
    } else {
      setFilteredJobs(jobPositions);
    }
  }, [selectedNodeId]);

  // 按层级过滤工作
  const handleLayerFilter = (layer: string) => {
    if (selectedLayer === layer) {
      setSelectedLayer(null);
      setFilteredJobs(selectedNodeId ? 
        jobPositions.filter(job => job.nodeId === selectedNodeId) : 
        jobPositions
      );
    } else {
      setSelectedLayer(layer);
      const layerJobs = jobPositions.filter(job => job.layer === layer);
      setFilteredJobs(selectedNodeId ? 
        layerJobs.filter(job => job.nodeId === selectedNodeId) : 
        layerJobs
      );
    }
  };

  // 获取紧急程度样式
  const getUrgencyStyle = (urgency: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[urgency as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 获取紧急程度文本
  const getUrgencyText = (urgency: string) => {
    const texts = {
      low: '普通招聘',
      medium: '紧急招聘',
      high: '急招'
    };
    return texts[urgency as keyof typeof texts] || '普通';
  };

  // 获取层级颜色
  const getLayerColor = (layer: string) => {
    const colors = {
      discovery: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      development: 'bg-blue-50 border-blue-200 text-blue-800',
      commercialization: 'bg-green-50 border-green-200 text-green-800'
    };
    return colors[layer as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div id="job-database" className="w-full bg-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* 头部标题 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {selectedNodeName ? `${selectedNodeName} - 相关职位` : '分层招聘数据库'}
          </h2>
          <p className="text-lg text-gray-600">
            {selectedNodeName ? 
              `为您推荐 ${selectedNodeName} 领域的热门职位` :
              '按药物产业链三层架构分类的专业招聘信息'
            }
          </p>
        </div>

        {/* 层级统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(jobStatsByLayer).map(([layer, stats]) => (
            <div
              key={layer}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedLayer === layer 
                  ? getLayerColor(layer) 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleLayerFilter(layer)}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{stats.name}</h3>
                <div className="flex items-center justify-center space-x-4 text-sm mb-3">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{stats.totalJobs} 个职位</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{stats.avgSalary}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {stats.hotSkills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 职位列表 */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无相关职位</h3>
              <p className="text-gray-500">请尝试选择其他筛选条件或环节</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* 职位基本信息 */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyStyle(job.urgency)}`}>
                          {getUrgencyText(job.urgency)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLayerColor(job.layer)}`}>
                          {jobStatsByLayer[job.layer]?.name}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Building2 className="w-4 h-4 mr-2" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="font-semibold text-green-600">{job.salary}</span>
                        </div>
                      </div>

                      {/* 关键要求预览 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            +{job.requirements.length - 3} 项要求
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 展开按钮 */}
                    <button
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronRight 
                        className={`w-5 h-5 transform transition-transform ${
                          expandedJob === job.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* 展开的详细信息 */}
                {expandedJob === job.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* 岗位要求 */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Star className="w-5 h-5 mr-2 text-blue-500" />
                          岗位要求
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 工作职责 */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-green-500" />
                          工作职责
                        </h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 申请按钮 */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        职位编号: {job.id} | 发布时间: 2024-01-15
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        立即申请
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 底部提示 */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-8 py-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 font-medium">
              共找到 {filteredJobs.length} 个相关职位
            </p>
            <p className="text-sm text-blue-600 mt-1">
              点击职位卡片右侧箭头查看详细要求和职责描述
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
