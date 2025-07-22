'use client';

import React, { useState, useEffect } from 'react';
import { pharmaChainData, ChainNode, SkillTree } from '@/data/pharmaChain';
import { ChevronRight, MapPin, Clock, TrendingUp } from 'lucide-react';

interface PharmaChainDiagramProps {
  onNodeClick: (nodeId: string, nodeName: string) => void;
  onSkillTreeShow: (skills: SkillTree[], nodeName: string) => void;
}

export default function PharmaChainDiagram({ onNodeClick, onSkillTreeShow }: PharmaChainDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 按层级组织节点
  const nodesByLayer = {
    discovery: pharmaChainData.filter(node => node.layer === 'discovery'),
    development: pharmaChainData.filter(node => node.layer === 'development'),
    commercialization: pharmaChainData.filter(node => node.layer === 'commercialization')
  };

  // 获取层级样式
  const getLayerStyle = (layer: string) => {
    const styles = {
      discovery: 'bg-yellow-50 border-yellow-200',
      development: 'bg-blue-50 border-blue-200',
      commercialization: 'bg-green-50 border-green-200'
    };
    return styles[layer as keyof typeof styles] || 'bg-gray-50 border-gray-200';
  };

  // 获取层级标题
  const getLayerTitle = (layer: string) => {
    const titles = {
      discovery: '上游「药物发现层」',
      development: '中游「开发与生产层」',
      commercialization: '下游「商业化层」'
    };
    return titles[layer as keyof typeof titles] || layer;
  };

  // 获取节点样式
  const getNodeStyle = (nodeId: string, layer: string) => {
    const baseStyle = "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105";
    const layerStyles = {
      discovery: hoveredNode === nodeId || selectedNode === nodeId 
        ? "bg-yellow-100 border-yellow-400 shadow-yellow-200" 
        : "bg-white border-yellow-300 hover:border-yellow-400",
      development: hoveredNode === nodeId || selectedNode === nodeId 
        ? "bg-blue-100 border-blue-400 shadow-blue-200" 
        : "bg-white border-blue-300 hover:border-blue-400",
      commercialization: hoveredNode === nodeId || selectedNode === nodeId 
        ? "bg-green-100 border-green-400 shadow-green-200" 
        : "bg-white border-green-300 hover:border-green-400"
    };
    return `${baseStyle} ${layerStyles[layer as keyof typeof layerStyles]}`;
  };

  // 处理节点点击
  const handleNodeClick = (node: ChainNode) => {
    setSelectedNode(node.id);
    onNodeClick(node.id, node.name);
    onSkillTreeShow(node.skills, node.name);
    
    // 滚动到招聘数据库区域
    setTimeout(() => {
      const element = document.getElementById('job-database');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // 绘制连接线
  const renderConnections = () => {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          {pharmaChainData.map(node => 
            node.connections.map(connectionId => {
              const sourceElement = document.getElementById(`node-${node.id}`);
              const targetElement = document.getElementById(`node-${connectionId}`);
              
              if (!sourceElement || !targetElement) return null;
              
              const sourceRect = sourceElement.getBoundingClientRect();
              const targetRect = targetElement.getBoundingClientRect();
              const containerRect = sourceElement.closest('.chain-container')?.getBoundingClientRect();
              
              if (!containerRect) return null;
              
              const startX = sourceRect.right - containerRect.left;
              const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
              const endX = targetRect.left - containerRect.left;
              const endY = targetRect.top + targetRect.height / 2 - containerRect.top;
              
              return (
                <line
                  key={`${node.id}-${connectionId}`}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  className="opacity-60"
                />
              );
            })
          )}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#94a3b8"
              />
            </marker>
          </defs>
        </svg>
      </div>
    );
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
                    <span>{nodes.reduce((sum, node) => sum + node.jobCount, 0)} 个岗位</span>
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
                          <span>{node.jobCount} 岗位</span>
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
}
