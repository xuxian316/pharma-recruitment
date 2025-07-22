'use client';

import React, { useState } from 'react';
import CosmeticsChainDiagram from '@/components/CosmeticsChainDiagram';
import SkillTreeModal from '@/components/SkillTreeModal';
import JobDatabase from '@/components/JobDatabase';
import CosmeticsIndustryAlerts from '@/components/CosmeticsIndustryAlerts';
import { SkillTree } from '@/data/cosmeticsChain';

export default function CosmeticsPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [selectedNodeName, setSelectedNodeName] = useState<string | undefined>();
  const [skillTreeModal, setSkillTreeModal] = useState({
    isOpen: false,
    skills: [] as SkillTree[],
    nodeName: ''
  });

  const handleNodeClick = (nodeId: string, nodeName: string) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeName(nodeName);
  };

  const handleSkillTreeShow = (skills: SkillTree[], nodeName: string) => {
    setSkillTreeModal({
      isOpen: true,
      skills,
      nodeName
    });
  };

  const handleSkillTreeClose = () => {
    setSkillTreeModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← 返回产业选择
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            💄 美容化妆品产业链分析
          </h1>
          <p className="text-gray-600 mt-2">
            活性成分开发、配方工艺和市场转化 - 引领从科学到市场的美容革命
          </p>
        </div>
      </div>

      <CosmeticsChainDiagram
        onNodeClick={handleNodeClick}
        onSkillTreeShow={handleSkillTreeShow}
      />

      <JobDatabase
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNodeName}
        industry="cosmetics"
      />

      <CosmeticsIndustryAlerts />

      <SkillTreeModal
        isOpen={skillTreeModal.isOpen}
        onClose={handleSkillTreeClose}
        skills={skillTreeModal.skills}
        nodeName={skillTreeModal.nodeName}
      />
    </div>
  );
}
