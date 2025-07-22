'use client';

import React, { useState, useMemo } from 'react';
import { cosmeticsChainData, ChainNode, SkillTree } from '@/data/cosmeticsChain';
import { cosmeticsJobPositions } from '@/data/cosmeticsJobsData';

interface CosmeticsChainDiagramProps {
  onNodeClick: (nodeId: string, nodeName: string) => void;
  onSkillTreeShow: (skills: SkillTree[], nodeName: string) => void;
}

const CosmeticsChainDiagram: React.FC<CosmeticsChainDiagramProps> = ({
  onNodeClick,
  onSkillTreeShow
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 计算每个节点的实际职位数量
  const nodeJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cosmeticsJobPositions.forEach(job => {
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
    development: cosmeticsChainData.filter(node => node.layer === 'development'),
    formulation: cosmeticsChainData.filter(node => node.layer === 'formulation'),
    commercialization: cosmeticsChainData.filter(node => node.layer === 'commercialization')
  };

  const layerConfig = {
    development: {
      title: '活性成分开发层',
      subtitle: '天然产物提取→合成生物学改造→功效分子修饰',
      color: 'bg-pink-100 border-pink-300 text-pink-800',
      hoverColor: 'hover:bg-pink-200'
    },
    formulation: {
      title: '配方工艺层',
      subtitle: '基质复配乳化→稳定性测试→感官评价',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      hoverColor: 'hover:bg-purple-200'
    },
    commercialization: {
      title: '市场转化层',
      subtitle: '宣称支持→渠道定制生产→消费者触达',
      color: 'bg-rose-100 border-rose-300 text-rose-800',
      hoverColor: 'hover:bg-rose-200'
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
          💄 功效化妆品产业链三阶段架构
        </h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <span>活性成分开发层</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>配方工艺层</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
            <span>市场转化层</span>
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
                {/* 连接箭头指示 */}
                {layer === 'development' && (
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-pink-600">
                      「皮肤渗透性设计」→
                    </span>
                  </div>
                )}
                {layer === 'formulation' && (
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-purple-600">
                      「消费体验数据」→
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
                      {node.id === 'sensory-evaluation' && (
                        <div className="mb-3 p-2 bg-yellow-100 rounded-md border border-yellow-300">
                          <div className="text-xs font-medium text-yellow-800">
                            ⭐ 特色评估模型
                          </div>
                          <div className="text-xs text-yellow-700">
                            肤感三角分析法、VISIA皮肤分析仪
                          </div>
                        </div>
                      )}
                      
                      {node.id === 'claim-support' && (
                        <div className="mb-3 p-2 bg-blue-100 rounded-md border border-blue-300">
                          <div className="text-xs font-medium text-blue-800">
                            📋 合规技能
                          </div>
                          <div className="text-xs text-blue-700">
                            EC No 1223/2009法规应用
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
          <p>• 「感官评价」节点展开特色评估模型</p>
          <p>• 「宣称支持」节点强调合规技能要求</p>
        </div>
      </div>

      {/* 差异警示区域 */}
      <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-300 rounded-lg">
        <h4 className="font-bold text-amber-800 mb-2">⚠️ 行业特性提醒</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>• <strong>感官评价权重占比40%</strong>：消费者体验感受至关重要</p>
          <p>• <strong>耐候性测试标准</strong>：光稳定性和氧化稳定性要求严格</p>
          <p>• <strong>EC No 1223/2009合规</strong>：欧盟化妆品法规必须严格遵循</p>
        </div>
      </div>
    </div>
  );
};

export default CosmeticsChainDiagram;
