'use client';

import React from 'react';
import { cosmeticsIndustryAlerts } from '@/data/cosmeticsChain';
import { AlertTriangle, Heart, Shield, Zap, Sparkles } from 'lucide-react';

export default function CosmeticsIndustryAlerts() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-amber-50">
      {/* 差异警示区域 */}
      <div className="p-6 bg-amber-100 border-2 border-amber-300 rounded-lg">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 mr-3" />
          <h4 className="text-2xl font-bold text-amber-800">功效化妆品产业差异说明</h4>
        </div>
        
        {/* 主要警示信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-amber-200 p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <h5 className="font-bold text-amber-800">{cosmeticsIndustryAlerts.sensoryImportance.title}</h5>
            </div>
            <p className="text-sm text-amber-700 mb-2">{cosmeticsIndustryAlerts.sensoryImportance.description}</p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs font-medium text-amber-800">📌 关键影响：{cosmeticsIndustryAlerts.sensoryImportance.impact}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-amber-200 p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h5 className="font-bold text-amber-800">{cosmeticsIndustryAlerts.regulatoryCompliance.title}</h5>
            </div>
            <p className="text-sm text-amber-700 mb-2">{cosmeticsIndustryAlerts.regulatoryCompliance.description}</p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs font-medium text-amber-800">📌 关键影响：{cosmeticsIndustryAlerts.regulatoryCompliance.impact}</p>
            </div>
          </div>
        </div>

        {/* 核心技术要求 */}
        <div className="bg-white rounded-lg border border-amber-200 p-4 mb-6">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h5 className="font-bold text-amber-800">{cosmeticsIndustryAlerts.keyTechnologies.title}</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cosmeticsIndustryAlerts.keyTechnologies.technologies.map((tech, index) => (
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
            <h5 className="font-bold text-amber-800">{cosmeticsIndustryAlerts.industryDifferences.title}</h5>
          </div>
          <div className="space-y-4">
            {cosmeticsIndustryAlerts.industryDifferences.comparisons.map((comparison, index) => (
              <div key={index} className="border-l-4 border-amber-400 pl-4">
                <h6 className="font-semibold text-amber-800 mb-2">与 {comparison.field} 对比</h6>
                <div className="text-sm text-amber-700 mb-2">
                  <span className="font-medium">传统特点：</span>
                  {comparison.differences.join('、')}
                </div>
                <div className="bg-amber-50 rounded p-2">
                  <span className="font-medium text-amber-800">功效化妆品要求：</span>
                  <span className="text-amber-700">{comparison.cosmeticsRequirement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
