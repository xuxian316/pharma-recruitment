'use client';

import React from 'react';
import { pharmaIndustryAlerts } from '@/data/pharmaChain';
import { AlertTriangle, Clock, Shield, Zap, Beaker, Palette } from 'lucide-react';

export default function IndustryAlerts() {
  return (
    <div className="w-full bg-gradient-to-br from-red-50 to-orange-50 border-t-4 border-red-500">
      <div className="max-w-7xl mx-auto p-8">
        {/* 警示标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">医药领域职业警示</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            进入药物行业前，了解这些关键特点和要求，做出明智的职业决策
          </p>
        </div>

        {/* 主要警示信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 12年研发周期 */}
          <div className="bg-white rounded-xl border border-red-200 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {pharmaIndustryAlerts.developmentCycle.title}
                </h3>
                <p className="text-red-600 font-medium">长期投资 · 耐心必备</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {pharmaIndustryAlerts.developmentCycle.description}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {pharmaIndustryAlerts.developmentCycle.impact}
              </p>
            </div>
            
            {/* 时间线示意 */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">典型药物研发时间线：</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-yellow-200 h-2 rounded-full relative">
                  <span className="absolute -top-6 left-0 text-xs text-gray-600">发现 (2-4年)</span>
                </div>
                <div className="flex-1 bg-blue-200 h-2 rounded-full relative">
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">开发 (6-8年)</span>
                </div>
                <div className="flex-1 bg-green-200 h-2 rounded-full relative">
                  <span className="absolute -top-6 right-0 text-xs text-gray-600">商业化 (2-3年)</span>
                </div>
              </div>
            </div>
          </div>

          {/* FDA/GMP强制合规 */}
          <div className="bg-white rounded-xl border border-red-200 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {pharmaIndustryAlerts.regulatoryCompliance.title}
                </h3>
                <p className="text-purple-600 font-medium">零容错 · 高标准</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {pharmaIndustryAlerts.regulatoryCompliance.description}
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800 font-medium flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {pharmaIndustryAlerts.regulatoryCompliance.impact}
              </p>
            </div>

            {/* 合规要求图标 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold text-sm">FDA</span>
                </div>
                <span className="text-xs text-gray-600">美国药监局</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold text-xs">EMA</span>
                </div>
                <span className="text-xs text-gray-600">欧洲药管局</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold text-xs">NMPA</span>
                </div>
                <span className="text-xs text-gray-600">国家药监局</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold text-xs">GMP</span>
                </div>
                <span className="text-xs text-gray-600">生产质量</span>
              </div>
            </div>
          </div>
        </div>

        {/* 与其他化工领域对比 */}
        <div className="bg-white rounded-xl border border-orange-200 shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {pharmaIndustryAlerts.industryDifferences.title}
              </h3>
              <p className="text-orange-600 font-medium">深度对比 · 谨慎选择</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pharmaIndustryAlerts.industryDifferences.comparisons.map((comparison, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {comparison.field === '电子材料' ? (
                    <Beaker className="w-6 h-6 text-blue-500 mr-3" />
                  ) : (
                    <Palette className="w-6 h-6 text-pink-500 mr-3" />
                  )}
                  <h4 className="text-lg font-bold text-gray-800">{comparison.field} 领域</h4>
                </div>

                {/* 其他领域特点 */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">行业特点：</p>
                  <div className="flex flex-wrap gap-2">
                    {comparison.differences.map((diff, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 药物行业要求 */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    药物行业相比之下：
                  </p>
                  <p className="text-sm text-red-700">{comparison.pharmaRequirement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 职业建议 */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">💡 给求职者的建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">长期规划</h4>
                <p className="text-sm text-blue-100">
                  制定5-10年职业发展计划，做好长期深耕准备
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">合规意识</h4>
                <p className="text-sm text-blue-100">
                  培养严谨的质量意识，熟悉相关法规要求
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">专业深度</h4>
                <p className="text-sm text-blue-100">
                  持续学习专业知识，建立扎实的理论基础
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部免责声明 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            以上信息仅供参考，具体职业选择请结合个人情况和市场环境综合考虑
          </p>
        </div>
      </div>
    </div>
  );
}
