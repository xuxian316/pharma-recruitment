'use client';

import React, { useState, useCallback } from 'react';
import PharmaChainDiagram from '@/components/PharmaChainDiagram';
import SkillTreeModal from '@/components/SkillTreeModal';
import JobDatabase from '@/components/JobDatabase';
import IndustryAlerts from '@/components/IndustryAlerts';
import { SkillTree } from '@/data/pharmaChain';
import SupabaseDataLoader from '@/components/SupabaseDataLoader';
import { UnifiedJobPosition } from '@/types/UnifiedJobPosition';

export default function PharmaceuticalsPage() {
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
    console.log('=== 药物行业调试信息 ===');
    console.log('总职位数量:', data.length);
    
    // 按层级统计
    const layerStats = data.reduce((acc, job) => {
      acc[job.layer] = (acc[job.layer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('层级统计:', layerStats);
    
    // 按nodeId统计
    const nodeStats = data.reduce((acc, job) => {
      acc[job.nodeId] = (acc[job.nodeId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('节点统计:', nodeStats);
    
    // 显示前5个样本
    console.log('前5个职位样本:', data.slice(0, 5));
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
      <SupabaseDataLoader industry="pharmaceuticals" onDataLoaded={handleDataLoaded} />
      
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
          
          {/* 调试信息 */}
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <h3 className="font-bold text-yellow-800">调试信息 (打开浏览器控制台查看详细)</h3>
            <div className="text-sm text-yellow-700 mt-2">
              <p>当前加载的药物行业职位数量: <span className="font-mono font-bold">{jobPositions.length}</span></p>
              {jobPositions.length > 0 && (
                <div className="mt-2">
                  <p>按层级分布:</p>
                  <div className="ml-4">
                    {Object.entries(jobPositions.reduce((acc, job) => {
                      acc[job.layer] = (acc[job.layer] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).map(([layer, count]) => (
                      <span key={layer} className="inline-block mr-4 mb-1">
                        {layer}: <span className="font-mono font-bold">{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PharmaChainDiagram
        onNodeClick={handleNodeClick}
        onSkillTreeShow={handleSkillTreeShow}
        jobPositions={jobPositions}
      />

      <JobDatabase
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNodeName}
        jobPositions={jobPositions}
      />

      <IndustryAlerts />

      <SkillTreeModal
        isOpen={skillTreeModal.isOpen}
        onClose={handleSkillTreeClose}
        skills={skillTreeModal.skills}
        nodeName={skillTreeModal.nodeName}
      />
    </div>
  );
}
