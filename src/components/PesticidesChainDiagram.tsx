'use client';

import React, { useState, useMemo } from 'react';
import { pesticidesChainData, ChainNode, SkillTree } from '@/data/pesticidesChain';
import { pesticidesJobPositions } from '@/data/pesticidesJobsData';

interface PesticidesChainDiagramProps {
  onNodeClick: (nodeId: string, nodeName: string) => void;
  onSkillTreeShow: (skills: SkillTree[], nodeName: string) => void;
}

const PesticidesChainDiagram: React.FC<PesticidesChainDiagramProps> = ({
  onNodeClick,
  onSkillTreeShow
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 计算每个节点的实际职位数量
  const nodeJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pesticidesJobPositions.forEach(job => {
      if (counts[job.nodeId]) {
        counts[job.nodeId]++;
      } else {
        counts[job.nodeId] = 1;
      }
    });
    return counts;
  }, []);

  // 按层级分组节点
  const nodesByLayer = {
    creation: pesticidesChainData.filter(node => node.layer === 'creation'),
    transformation: pesticidesChainData.filter(node => node.layer === 'transformation'),
    service: pesticidesChainData.filter(node => node.layer === 'service')
  };

  const layerConfig = {
    creation: {
      title: '创制分子层',
      subtitle: '靶标生物筛选→先导化合物合成→构效关系优化',
      color: 'bg-green-100 border-green-300 text-green-800',
      hoverColor: 'hover:bg-green-200'
    },
    transformation: {
      title: '产业转化层',
      subtitle: '制剂开发→登记资料生成→环境监测',
      color: 'bg-teal-100 border-teal-300 text-teal-800',
      hoverColor: 'hover:bg-teal-200'
    },
    service: {
      title: '应用服务层',
      subtitle: '植保方案设计→精准施药系统→增产收益保障',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      hoverColor: 'hover:bg-emerald-200'
    }
  };

  const handleNodeClick = (node: ChainNode) => {
    onNodeClick(node.id, node.name);
    // 显示技能树
    onSkillTreeShow(node.skills, node.name);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-amber-50">
      {/* 标题区域 */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🌾 农药科学产业链三层架构
        </h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>创制分子层</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
            <span>产业转化层</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <span>应用服务层</span>
          </div>
        </div>
      </div>

      {/* 产业链图表 */}
      <div className="space-y-12">
        {Object.entries(nodesByLayer).map(([layerKey, nodes]) => {
          const layer = layerKey as keyof typeof layerConfig;
          const config = layerConfig[layer];
          
          return (
            <div key={layer} className="relative">
              {/* 层级标题 */}
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {config.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {config.subtitle}
                </p>
                {/* 分叉连接指示 */}
                {layer === 'creation' && (
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-green-600">
                      「田间有效性」+「手性纯化」→
                    </span>
                  </div>
                )}
                {layer === 'transformation' && (
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-teal-600">
                      「环境安全数据」+「抗性监测数据」→
                    </span>
                  </div>
                )}
              </div>

              {/* 节点网格 */}
              <div className={`grid ${nodes.length <= 3 ? `grid-cols-${nodes.length}` : 'grid-cols-3'} gap-6`}>
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${config.color} ${config.hoverColor}
                      ${hoveredNode === node.id ? 'scale-105 shadow-lg' : 'shadow-md'}
                    `}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node)}
                  >
                    {/* 节点内容 */}
                    <div className="text-center">
                      <h4 className="font-bold text-lg mb-2">{node.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {node.description}
                      </p>
                      
                      {/* 特殊标识 */}
                      {node.id === 'crop-protection-design' && (
                        <div className="mb-3 p-2 bg-yellow-100 rounded-md border border-yellow-300">
                          <div className="text-xs font-medium text-yellow-800">
                            🌱 农艺学专属技能
                          </div>
                          <div className="text-xs text-yellow-700">
                            药效比计算、田间追溯系统操作
                          </div>
                        </div>
                      )}
                      
                      {node.id === 'regulatory-documents' && (
                        <div className="mb-3 p-2 bg-red-100 rounded-md border border-red-300">
                          <div className="text-xs font-medium text-red-800">
                            📋 强制资质
                          </div>
                          <div className="text-xs text-red-700">
                            GLP实验室认证、环境毒性评估资质
                          </div>
                        </div>
                      )}

                      {/* 岗位数量 */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {node.skills.length} 项核心技能
                        </span>
                        <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                          {nodeJobCounts[node.id] || 0} 个岗位
                        </span>
                      </div>
                    </div>

                    {/* 悬浮时显示连接线 */}
                    {hoveredNode === node.id && node.connections.length > 0 && (
                      <div className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2">
                        <div className="w-8 h-0.5 bg-gray-400"></div>
                        <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent translate-x-8 -translate-y-1"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
        <h4 className="font-bold text-gray-800 mb-2">💡 交互说明</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• 点击任意节点查看详细技能要求和相关岗位</p>
          <p>• 「植保方案设计」节点弹出农艺学专属技能</p>
          <p>• 「登记资料生成」节点绑定强制资质要求</p>
        </div>
      </div>

      {/* 左右两侧悬浮提示 */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-amber-100 border-2 border-amber-300 rounded-lg p-3 shadow-lg">
        <div className="text-xs font-bold text-amber-800 mb-1">⏰ 行业特性</div>
        <div className="text-xs text-amber-700">
          12个月田间数据周期
        </div>
      </div>

      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-amber-100 border-2 border-amber-300 rounded-lg p-3 shadow-lg">
        <div className="text-xs font-bold text-amber-800 mb-1">📊 权重导向</div>
        <div className="text-xs text-amber-700">
          抗性监测 &gt; 理论创新
        </div>
      </div>

      {/* 差异警示区域 */}
      <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-300 rounded-lg">
        <h4 className="font-bold text-amber-800 mb-2">⚠️ 行业特性提醒</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>• <strong>12个月田间数据周期</strong>：需要持续的田间试验和数据收集</p>
          <p>• <strong>抗性监测权重&gt;理论创新</strong>：实用性比理论研究更重要</p>
          <p>• <strong>GLP实验室认证</strong>：合规性是行业准入的硬性要求</p>
        </div>
      </div>
    </div>
  );
};

export default PesticidesChainDiagram;
