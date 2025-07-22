'use client';

import React, { useState } from 'react';
import PharmaChainDiagram from '@/components/PharmaChainDiagram';
import SkillTreeModal from '@/components/SkillTreeModal';
import JobDatabase from '@/components/JobDatabase';
import IndustryAlerts from '@/components/IndustryAlerts';
import { SkillTree } from '@/data/pharmaChain';

export default function Home() {
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
    <div className="min-h-screen bg-gray-50">
      {/* 药物产业链流程图 */}
      <PharmaChainDiagram
        onNodeClick={handleNodeClick}
        onSkillTreeShow={handleSkillTreeShow}
      />

      {/* 招聘数据库 */}
      <JobDatabase
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNodeName}
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
