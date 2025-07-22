'use client';

import React, { useState, useCallback } from 'react';
import PesticidesChainDiagram from '@/components/PesticidesChainDiagram';
import SkillTreeModal from '@/components/SkillTreeModal';
import JobDatabase from '@/components/JobDatabase';
import PesticidesIndustryAlerts from '@/components/PesticidesIndustryAlerts';
import { SkillTree } from '@/data/pesticidesChain';
import SupabaseDataLoader from '@/components/SupabaseDataLoader';
import { UnifiedJobPosition } from '@/types/UnifiedJobPosition';

export default function PesticidesPage() {
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
      <SupabaseDataLoader industry="pesticides" onDataLoaded={handleDataLoaded} />
      
      <div className="pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← 返回产业选择
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            🌾 农药产业链分析
          </h1>
          <p className="text-gray-600 mt-2">
            创制分子、产业转化到应用服务 - 化学与生物科学的完美结合
          </p>
        </div>
      </div>

      <PesticidesChainDiagram
        onNodeClick={handleNodeClick}
        onSkillTreeShow={handleSkillTreeShow}
        jobPositions={jobPositions}
      />

      <JobDatabase
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNodeName}
        jobPositions={jobPositions}
      />

      <PesticidesIndustryAlerts />

      <SkillTreeModal
        isOpen={skillTreeModal.isOpen}
        onClose={handleSkillTreeClose}
        skills={skillTreeModal.skills}
        nodeName={skillTreeModal.nodeName}
      />
    </div>
  );
}
