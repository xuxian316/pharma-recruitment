'use client';

import React, { useState, useMemo } from 'react';
import { batteryChainData, ChainNode, SkillTree } from '@/data/batteryChain';
import { batteryJobPositions } from '@/data/batteryJobsData';

interface BatteryChainDiagramProps {
  onNodeClick: (nodeId: string, nodeName: string) => void;
  onSkillTreeShow: (skills: SkillTree[], nodeName: string) => void;
}

const BatteryChainDiagram: React.FC<BatteryChainDiagramProps> = ({
  onNodeClick,
  onSkillTreeShow
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 计算每个节点的实际职位数量
  const nodeJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    batteryJobPositions.forEach(job => {
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
    innovation: batteryChainData.filter(node => node.layer === 'innovation'),
    engineering: batteryChainData.filter(node => node.layer === 'engineering'),
    integration: batteryChainData.filter(node => node.layer === 'integration')
  };

  const layerConfig = {
    innovation: {
      title: '材料创新层',
      subtitle: '矿物提纯→前驱体合成→分子结构设计',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      hoverColor: 'hover:bg-blue-200'
    },
    engineering: {
      title: '工艺工程层',
      subtitle: '吨级放大生产→微观结构调控→电化学测试',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      hoverColor: 'hover:bg-purple-200'
    },
    integration: {
      title: '应用集成层',
      subtitle: '电芯厂导入→Pack系统集成→终端产品应用',
      color: 'bg-green-100 border-green-300 text-green-800',
      hoverColor: 'hover:bg-green-200'
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
          🔋 锂电材料产业链三阶段架构
        </h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>材料创新层</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span>工艺工程层</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>应用集成层</span>
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
                {layer === 'innovation' && (
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-blue-600">
                      「连续流技术」→
                    </span>
                  </div>
                )}
                {layer === 'engineering' && (
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-purple-600">
                      「电芯适配数据」→
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
                      {node.id === 'tonnage-scaling' && (
                        <div className="mb-3 p-2 bg-yellow-100 rounded-md border border-yellow-300">
                          <div className="text-xs font-medium text-yellow-800">
                            ⭐ 量产核心技能
                          </div>
                          <div className="text-xs text-yellow-700">
                            晶面取向控制、粒径分布控制
                          </div>
                        </div>
                      )}
                      
                      {node.id === 'electrochemical-testing' && (
                        <div className="mb-3 p-2 bg-red-100 rounded-md border border-red-300">
                          <div className="text-xs font-medium text-red-800">
                            🔧 特有工具要求
                          </div>
                          <div className="text-xs text-red-700">
                            BTS-600测试仪操作认证
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
          <p>• 「吨级放大生产」节点突出展示量产核心技能</p>
          <p>• 「电化学测试」节点绑定特有工具要求</p>
        </div>
      </div>

      {/* 差异警示区域 */}
      <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-300 rounded-lg">
        <h4 className="font-bold text-amber-800 mb-2">⚠️ 锂电材料产业差异说明</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>• <strong>UN38.3安全认证</strong>：锂电池运输安全标准是强制要求</p>
          <p>• <strong>动力电池热失控仿真技能</strong>：安全性评估至关重要</p>
          <p>• <strong>量产工艺导向</strong>：注重连续流技术和规模化生产稳定性</p>
          <p>• <strong>电芯适配数据驱动</strong>：与下游客户紧密合作，数据驱动决策</p>
        </div>
      </div>
    </div>
  );
};

export default BatteryChainDiagram;
