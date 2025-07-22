'use client';

import { useEffect, useState } from 'react';
import { getJobPositions, getLastUpdateTime, JobPositionDB } from '@/lib/supabase';
// 使用统一的JobPosition接口
import { UnifiedJobPosition as JobPosition } from '@/types/UnifiedJobPosition';

interface DataLoaderProps {
  industry?: string;
  onDataLoaded: (data: JobPosition[]) => void;
  onUpdateTimeLoaded?: (time: string) => void;
}

export default function SupabaseDataLoader({ industry, onDataLoaded, onUpdateTimeLoaded }: DataLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 加载职位数据
        const { data, error: fetchError } = await getJobPositions(industry);
        
        if (fetchError) {
          throw new Error(fetchError.message);
        }

        // 转换为应用格式
        const jobPositions: JobPosition[] = (data || []).map((job: JobPositionDB) => ({
          id: job.id || '',
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          layer: job.layer,
          nodeId: job.node_id,
          urgency: job.urgency as 'low' | 'medium' | 'high',
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          link: job.link || undefined
        }));

        onDataLoaded(jobPositions);

        // 如果需要，加载更新时间
        if (onUpdateTimeLoaded) {
          const updateTime = await getLastUpdateTime();
          onUpdateTimeLoaded(updateTime);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
        setError(err instanceof Error ? err.message : '未知错误');
        // 传递空数组，让应用继续运行
        onDataLoaded([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [industry, onDataLoaded, onUpdateTimeLoaded]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="flex-1">
            <p className="text-red-800 font-medium">数据加载失败</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return null;
}
