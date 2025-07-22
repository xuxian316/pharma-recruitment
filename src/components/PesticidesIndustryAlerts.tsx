'use client';

import React from 'react';
import { pesticidesIndustryAlerts } from '@/data/pesticidesChain';
import { AlertTriangle, Clock, BarChart3, Zap, Leaf } from 'lucide-react';

export default function PesticidesIndustryAlerts() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-amber-50">
      {/* 差异警示区域 */}
      <div className="p-6 bg-amber-100 border-2 border-amber-300 rounded-lg">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 mr-3" />
          <h4 className="text-2xl font-bold text-amber-800">农药科学产业差异说明</h4>
        </div>
        
        {/* 主要警示信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-amber-200 p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h5 className="font-bold text-amber-800">{pesticidesIndustryAlerts.fieldData.title}</h5>
            </div>
            <p className="text-sm text-amber-700 mb-2">{pesticidesIndustryAlerts.fieldData.description}</p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs font-medium text-amber-800">📌 关键影响：{pesticidesIndustryAlerts.fieldData.impact}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-amber-200 p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <h5 className="font-bold text-amber-800">{pesticidesIndustryAlerts.resistanceWeighting.title}</h5>
            </div>
            <p className="text-sm text-amber-700 mb-2">{pesticidesIndustryAlerts.resistanceWeighting.description}</p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs font-medium text-amber-800">📌 关键影响：{pesticidesIndustryAlerts.resistanceWeighting.impact}</p>
            </div>
          </div>
        </div>

        {/* 核心技术要求 */}
        <div className="bg-white rounded-lg border border-amber-200 p-4 mb-6">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <Leaf className="w-6 h-6 text-amber-600" />
            </div>
            <h5 className="font-bold text-amber-800">{pesticidesIndustryAlerts.keyTechnologies.title}</h5>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {pesticidesIndustryAlerts.keyTechnologies.technologies.map((tech, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <p className="text-sm text-amber-700">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 行业差异对比 */}
        <div className="bg-white rounded-lg border border-amber-200 p-4">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <h5 className="font-bold text-amber-800">{pesticidesIndustryAlerts.industryDifferences.title}</h5>
          </div>
          <div className="space-y-4">
            {pesticidesIndustryAlerts.industryDifferences.comparisons.map((comparison, index) => (
              <div key={index} className="border-l-4 border-amber-400 pl-4">
                <h6 className="font-semibold text-amber-800 mb-2">与 {comparison.field} 对比</h6>
                <div className="text-sm text-amber-700 mb-2">
                  <span className="font-medium">传统特点：</span>
                  {comparison.differences.join('、')}
                </div>
                <div className="bg-amber-50 rounded p-2">
                  <span className="font-medium text-amber-800">农药科学要求：</span>
                  <span className="text-amber-700">{comparison.pesticidesRequirement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
