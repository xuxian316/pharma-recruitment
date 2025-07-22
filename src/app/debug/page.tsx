'use client';

import { useEffect, useState } from 'react';
import { getJobPositions } from '@/lib/supabase';

export default function DebugPage() {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [pharmaJobs, setPharmaJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 获取所有职位
        const { data: all } = await getJobPositions();
        setAllJobs(all || []);
        
        // 获取药物行业职位
        const { data: pharma } = await getJobPositions('pharma');
        setPharmaJobs(pharma || []);
        
        console.log('所有职位数量:', all?.length);
        console.log('药物行业职位数量:', pharma?.length);
        console.log('药物行业前5个职位:', pharma?.slice(0, 5));
        
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  // 按行业统计
  const industryStats = allJobs.reduce((acc, job) => {
    acc[job.industry] = (acc[job.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 按层级统计药物行业
  const pharmaLayerStats = pharmaJobs.reduce((acc, job) => {
    acc[job.layer] = (acc[job.layer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 按nodeId统计药物行业
  const pharmaNodeStats = pharmaJobs.reduce((acc, job) => {
    acc[job.node_id] = (acc[job.node_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">数据库调试信息</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 行业统计 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">行业统计</h2>
          <div className="space-y-2">
            {Object.entries(industryStats).map(([industry, count]) => (
              <div key={industry} className="flex justify-between">
                <span>{industry}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>总计</span>
              <span className="font-mono">{allJobs.length}</span>
            </div>
          </div>
        </div>

        {/* 药物行业层级统计 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">药物行业层级统计</h2>
          <div className="space-y-2">
            {Object.entries(pharmaLayerStats).map(([layer, count]) => (
              <div key={layer} className="flex justify-between">
                <span>{layer}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>药物行业总计</span>
              <span className="font-mono">{pharmaJobs.length}</span>
            </div>
          </div>
        </div>

        {/* 药物行业节点统计 */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">药物行业节点统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(pharmaNodeStats).map(([nodeId, count]) => (
              <div key={nodeId} className="flex justify-between">
                <span className="text-sm">{nodeId}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 样本数据 */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">药物行业样本数据</h2>
          <div className="space-y-4">
            {pharmaJobs.slice(0, 5).map((job, index) => (
              <div key={index} className="p-4 border rounded">
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-gray-600">{job.company} - {job.location}</div>
                <div className="text-sm">
                  <span className="bg-blue-100 px-2 py-1 rounded mr-2">行业: {job.industry}</span>
                  <span className="bg-green-100 px-2 py-1 rounded mr-2">层级: {job.layer}</span>
                  <span className="bg-purple-100 px-2 py-1 rounded">节点: {job.node_id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
