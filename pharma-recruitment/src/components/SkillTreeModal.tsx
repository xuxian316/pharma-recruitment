'use client';

import React from 'react';
import { SkillTree } from '@/data/pharmaChain';
import { X, Star, BookOpen, Briefcase, FlaskConical, Building } from 'lucide-react';

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillTree[];
  nodeName: string;
}

export default function SkillTreeModal({ isOpen, onClose, skills, nodeName }: SkillTreeModalProps) {
  if (!isOpen) return null;

  // 获取技能类别图标
  const getCategoryIcon = (category: string) => {
    const icons = {
      technical: FlaskConical,
      regulatory: Building,
      business: Briefcase,
      research: BookOpen
    };
    const IconComponent = icons[category as keyof typeof icons] || BookOpen;
    return <IconComponent className="w-5 h-5" />;
  };

  // 获取技能类别颜色
  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800 border-blue-200',
      regulatory: 'bg-purple-100 text-purple-800 border-purple-200',
      business: 'bg-green-100 text-green-800 border-green-200',
      research: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 获取技能等级样式
  const getLevelStyle = (level: string) => {
    const styles = {
      basic: 'bg-gray-100 text-gray-700',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return styles[level as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  // 获取技能等级星级
  const getLevelStars = (level: string) => {
    const levels = {
      basic: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4
    };
    const starCount = levels[level as keyof typeof levels] || 1;
    return Array.from({ length: 4 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < starCount ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  // 按类别分组技能
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillTree[]>);

  // 类别名称映射
  const categoryNames = {
    technical: '技术技能',
    regulatory: '法规合规',
    business: '商业技能',
    research: '研究能力'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{nodeName} - 核心技能树</h2>
              <p className="text-blue-100">
                该岗位所需的专业技能和能力要求
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-8">
              {/* 类别标题 */}
              <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${getCategoryColor(category)} mb-4`}>
                {getCategoryIcon(category)}
                <span className="ml-2 font-semibold">
                  {categoryNames[category as keyof typeof categoryNames]}
                </span>
                <span className="ml-2 text-sm">
                  ({categorySkills.length} 项技能)
                </span>
              </div>

              {/* 技能列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* 技能名称和等级 */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800">
                        {skill.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {getLevelStars(skill.level)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelStyle(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    {/* 技能描述 */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {skill.description}
                    </p>

                    {/* 技能标签 */}
                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}>
                        {categoryNames[category as keyof typeof categoryNames]}
                      </span>
                      <span className="text-xs text-gray-500">
                        必备技能
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 技能要求说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-bold text-blue-800 mb-3">💡 技能要求说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mt-0.5" />
                <div>
                  <p className="font-semibold">基础 (1星)</p>
                  <p>了解基本概念和原理</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold">中级 (2星)</p>
                  <p>能够独立完成相关工作</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold">高级 (3星)</p>
                  <p>具备丰富经验和深入理解</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold">专家 (4星)</p>
                  <p>行业顶尖水平，能够引领创新</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
