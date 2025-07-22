'use client';

import React, { useState, useCallback } from 'react';
import BatteryChainDiagram from '@/components/BatteryChainDiagram';
import SkillTreeModal from '@/components/SkillTreeModal';
import JobDatabase from '@/components/JobDatabase';
import BatteryIndustryAlerts from '@/components/BatteryIndustryAlerts';
import { SkillTree } from '@/data/batteryChain';
import SupabaseDataLoader from '@/components/SupabaseDataLoader';
import { UnifiedJobPosition } from '@/types/UnifiedJobPosition';

export default function BatteryPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [selectedNodeName, setSelectedNodeName] = useState<string | undefined>();
  const [jobPositions, setJobPositions] = useState<UnifiedJobPosition[]>([]);
  const [skillTreeModal, setSkillTreeModal] = useState({
    isOpen: false,
    skills: [] as SkillTree[],
    nodeName: ''
  });

  const handleDataLoaded = useCallback((data: UnifiedJobPosition[]) => {
    setJobPositions(data);
  }, []);

  // 处理节点点击
  const handleNodeClick = (nodeId: string, nodeName: string) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeName(nodeName);
  };

  // 显示技能树
  const handleSkillTreeShow = (skills: SkillTree[], nodeName: string) => {
    setSkillTreeModal({
      isOpen: true,
      skills,
      nodeName
    });
  };

  // 关闭技能树弹窗
  const handleSkillTreeClose = () => {
    setSkillTreeModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <SupabaseDataLoader industry="battery" onDataLoaded={handleDataLoaded} />
      
      {/* 返回按钮和标题 */}
      <div className="pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← 返回产业选择
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            🔋 电池技术产业链分析
          </h1>
          <p className="text-gray-600 mt-2">
            材料创新、工艺工程及应用集成 - 覆盖从资源开采到终端应用的完整产业链
          </p>
        </div>
      </div>

      {/* 锂电材料产业链流程图 */}
      <BatteryChainDiagram
        onNodeClick={handleNodeClick}
        onSkillTreeShow={handleSkillTreeShow}
        jobPositions={jobPositions}
      />

      {/* 招聘数据库 */}
      <JobDatabase
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNodeName}
        jobPositions={jobPositions}
      />

      {/* 行业警示模块 */}
      <BatteryIndustryAlerts />

      {/* 技能树弹窗 */}
      <SkillTreeModal
        isOpen={skillTreeModal.isOpen}
        onClose={handleSkillTreeClose}
        skills={skillTreeModal.skills}
        nodeName={skillTreeModal.nodeName}
      />
    </div>
  );
}
