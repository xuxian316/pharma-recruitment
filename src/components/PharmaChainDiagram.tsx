'use client';

import React, { useState, useMemo } from 'react';
import { pharmaChainData, ChainNode } from '@/data/pharmaChain';
import { ChevronRight, MapPin, TrendingUp, Clock } from 'lucide-react';
import { SkillTree } from '@/data/pharmaChain';
import { UnifiedJobPosition } from '@/types/UnifiedJobPosition';

interface PharmaChainDiagramProps {
  onNodeClick: (nodeId: string, nodeName: string) => void;
  onSkillTreeShow: (skills: SkillTree[], nodeName: string) => void;
  jobPositions: UnifiedJobPosition[];
}

const PharmaChainDiagram: React.FC<PharmaChainDiagramProps> = ({ onNodeClick, onSkillTreeShow, jobPositions }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 计算每个节点的实际职位数量
  const nodeJobCounts = useMemo(() => {
    console.log('[DEBUG] PharmaChainDiagram: Calculating nodeJobCounts with', jobPositions.length, 'positions');
    console.log('[DEBUG] PharmaChainDiagram: Sample job positions:', jobPositions.slice(0, 3));
    
    // 统计各个nodeId的分布
    const nodeIdDistribution = new Map<string, number>();
    const layerDistribution = new Map<string, number>();
    
    jobPositions.forEach(job => {
      // 统计nodeId分布
      nodeIdDistribution.set(job.nodeId, (nodeIdDistribution.get(job.nodeId) || 0) + 1);
      // 统计layer分布
      layerDistribution.set(job.layer, (layerDistribution.get(job.layer) || 0) + 1);
    });
    
    console.log('[DEBUG] PharmaChainDiagram: NodeId distribution:', Object.fromEntries(nodeIdDistribution));
    console.log('[DEBUG] PharmaChainDiagram: Layer distribution:', Object.fromEntries(layerDistribution));
    
    // 检查预定义的nodeId
    const predefinedNodeIds = pharmaChainData.map(node => node.id);
    console.log('[DEBUG] PharmaChainDiagram: Predefined nodeIds:', predefinedNodeIds);
    
    // 检查实际数据中的nodeId是否匹配预定义的nodeId
    const actualNodeIds = Array.from(nodeIdDistribution.keys());
    const unmatchedNodeIds = actualNodeIds.filter(id => !predefinedNodeIds.includes(id));
    console.log('[DEBUG] PharmaChainDiagram: Unmatched nodeIds:', unmatchedNodeIds);
    
    const counts: Record<string, number> = {};
    jobPositions.forEach(job => {
      if (counts[job.nodeId]) {
        counts[job.nodeId]++;
      } else {
        counts[job.nodeId] = 1;
      }
    });
    
    console.log('[DEBUG] PharmaChainDiagram: Final nodeJobCounts:', counts);
    return counts;
  }, [jobPositions]);

  // 按层级分组
  const nodesByLayer = pharmaChainData.reduce((acc, node) => {
    if (!acc[node.layer]) {
      acc[node.layer] = [];
    }
    acc[node.layer].push(node);
    return acc;
  }, {} as Record<string, ChainNode[]>);

  const layerConfig = {
    discovery: {
      title: '药物发现层',
      subtitle: '靶点识别→分子设计→化合物合成→药理筛选',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      hoverColor: 'hover:bg-yellow-200'
    },
    development: {
      title: '开发与生产层',
      subtitle: 'CMC开发→临床前研究→临床试验→GMP生产',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      hoverColor: 'hover:bg-blue-200'
    },
    commercialization: {
      title: '商业化层',
      subtitle: '市场准入→分销渠道→患者服务',
      color: 'bg-green-100 border-green-300 text-green-800',
      hoverColor: 'hover:bg-green-200'
    }
  };

  const handleNodeClick = (node: ChainNode) => {
    setSelectedNode(node.id);
    onNodeClick(node.id, node.name);
    // 显示技能树
    onSkillTreeShow(node.skills, node.name);
  };

  const getLayerStyle = (layer: string) => {
    switch (layer) {
      case 'discovery':
        return 'bg-yellow-50 border-yellow-200';
      case 'development':
        return 'bg-blue-50 border-blue-200';
      case 'commercialization':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getLayerTitle = (layer: string) => {
    const config = layerConfig[layer as keyof typeof layerConfig];
    return config?.title || layer;
  };

  const getNodeStyle = (nodeId: string, layer: string) => {
    const baseClasses = 'relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg';
    const config = layerConfig[layer as keyof typeof layerConfig];
    const isHovered = hoveredNode === nodeId;
    const isSelected = selectedNode === nodeId;
    
    let colorClasses = config?.color || 'bg-gray-100 border-gray-300 text-gray-800';
    if (isHovered || isSelected) {
      colorClasses = config?.hoverColor || 'hover:bg-gray-200';
    }
    
    const scaleClass = isHovered || isSelected ? 'scale-105' : '';
    
    return `${baseClasses} ${colorClasses} ${scaleClass}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            药物产业链招聘地图
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            点击任意环节探索岗位技能需求，深入了解药物从发现到商业化的完整流程
          </p>
        </div>

        {/* 产业链流程图 */}
        <div className="chain-container relative space-y-8">
          {Object.entries(nodesByLayer).map(([layer, nodes]) => (
            <div
              key={layer}
              className={`p-6 rounded-xl border-2 ${getLayerStyle(layer)}`}
            >
              {/* 层级标题 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {getLayerTitle(layer)}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{nodes.reduce((sum, node) => sum + (nodeJobCounts[node.id] || 0), 0)} 个岗位</span>
                  </div>
                </div>
              </div>

              {/* 节点网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    id={`node-${node.id}`}
                    className={getNodeStyle(node.id, layer)}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* 节点内容 */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {node.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {node.description}
                      </p>
                      
                      {/* 岗位统计 */}
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          <span>{nodeJobCounts[node.id] || 0} 岗位</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{node.skills.length} 技能</span>
                        </div>
                      </div>
                    </div>

                    {/* 点击提示 */}
                    {(hoveredNode === node.id || selectedNode === node.id) && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          点击查看
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 流程连接箭头 */}
              {layer !== 'commercialization' && (
                <div className="flex justify-center mt-6">
                  <ChevronRight className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {/* 流程逻辑说明 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 关键流程逻辑</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-700">合成逻辑</p>
                  <p className="text-sm text-gray-600">
                    药物发现层通过「合成逻辑」向开发层传递化合物
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-700">工艺理解</p>
                  <p className="text-sm text-gray-600">
                    开发层通过「数据解读」和「工艺理解」驱动商业化层
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmaChainDiagram;
