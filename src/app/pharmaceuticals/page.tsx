'use client';

import React, { useState } from 'react';
import PharmaChainDiagram from '@/components/PharmaChainDiagram';
import SkillTreeModal from '@/components/SkillTreeModal';
import JobDatabase from '@/components/JobDatabase';
import IndustryAlerts from '@/components/IndustryAlerts';
import { SkillTree } from '@/data/pharmaChain';

export default function PharmaceuticalsPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [selectedNodeName, setSelectedNodeName] = useState<string | undefined>();
  const [skillTreeModal, setSkillTreeModal] = useState({
    isOpen: false,
    skills: [] as SkillTree[],
    nodeName: ''
  });

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
            💊 药物化学产业链分析
          </h1>
          <p className="text-gray-600 mt-2">
            结构优化导向 - 从靶点识别到患者服务的完整药物研发链条
          </p>
        </div>
      </div>

      {/* 药物产业链流程图 */}
      <PharmaChainDiagram
        onNodeClick={handleNodeClick}
        onSkillTreeShow={handleSkillTreeShow}
      />

      {/* 招聘数据库 */}
      <JobDatabase
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNodeName}
        industry="pharmaceuticals"
      />

      {/* 医药行业警示模块 */}
      <IndustryAlerts />

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
