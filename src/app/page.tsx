'use client';

import React from 'react';
import { lastUpdateTime } from '@/data/lastUpdate';

const industries = [
  {
    id: 'battery',
    name: '锂电材料',
    description: '量产工艺导向',
    thumbnail: '🔋',
    characteristics: ['连续流技术', '电芯适配数据', 'UN38.3安全认证'],
    href: '/battery'
  },
  {
    id: 'cosmetics',
    name: '功效化妆品',
    description: '护肤功效导向',
    thumbnail: '💄',
    characteristics: ['皮肤渗透性设计', '感官评价', 'EC No 1223/2009合规'],
    href: '/cosmetics'
  },
  {
    id: 'pesticides',
    name: '农药科学',
    description: '增效安全导向',
    thumbnail: '🌾',
    characteristics: ['田间有效性', 'GLP实验室认证', '抗性监测'],
    href: '/pesticides'
  },
  {
    id: 'pharmaceuticals',
    name: '药物化学',
    description: '结构优化导向',
    thumbnail: '💊',
    characteristics: ['靶点识别', 'ADME性质评估', 'GMP合规'],
    href: '/pharmaceuticals'
  }
];

export default function Home() {
  const handleCardClick = (href: string) => {
    window.location.href = href;
  };

  const handleAdminClick = () => {
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* 管理员入口 */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleAdminClick}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          管理员
        </button>
      </div>
      
      {/* 页面标题 */}
      <div className="pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          产业导向型招聘分析平台
        </h1>
        <p className="text-lg text-gray-600">
          两级界面架构，深度解析四大化工产业人才需求
        </p>
      </div>

      {/* 最后更新时间板块 */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-gray-700">
              数据最近更新时间：<span className="font-semibold text-green-700">{lastUpdateTime}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 产业卡片网格 */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-purple-100"
              onClick={() => handleCardClick(industry.href)}
            >
              {/* 卡片头部 */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{industry.thumbnail}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {industry.name}
                    </h2>
                    <p className="text-lg text-purple-600 font-medium">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 流程缩略图区域 */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  核心流程特征：
                </h3>
                <div className="space-y-2">
                  {industry.characteristics.map((char, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">{char}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 卡片底部 */}
              <div className="p-4 bg-gray-50 rounded-b-xl">
                <p className="text-xs text-gray-500 text-center">
                  点击查看完整产业链分析 →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 生化环材交流群板块 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              {/* 图标 */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              
              {/* 内容 */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🤝 生化环材交流群</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  如果您也是生化环材专业的学生或相关从业者，欢迎加入我们的交流群！
                  恳请先行者为后来者拨开迷雾，
                  共同探讨职业发展、技术进步和行业机遇。
                </p>
                
                {/* QQ群信息 */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Q</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">群号：</p>
                      <p className="text-xl font-bold text-blue-600">1005016086</p>
                    </div>
                  </div>
                </div>
                
                {/* 群特色 */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    🌱 职业发展指导
                  </span>
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                    💡 经验分享
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    🌍 行业资讯
                  </span>
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                    ❤️ 互助友爱
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 开发者联系板块 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="flex items-start gap-4">
              {/* 图标 */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              
              {/* 内容 */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-3">开发者留言</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  本人能力不足（因为我是有机佬），开发至此已经是我做的最大限度的尝试。
                  如果您有更好的建议，请联系：
                  <a 
                    href="mailto:3331484470@qq.com" 
                    className="text-blue-600 hover:text-blue-800 underline font-medium ml-1"
                  >
                    3331484470@qq.com
                  </a>
                  ，我会认真考虑您的建议，谢谢！
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    💼 有机化学
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    🚀 持续改进
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    🤝 开放合作
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
