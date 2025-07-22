import React from 'react';
import { useRouter } from 'next/navigation';

const industries = [
  { id: 'battery', name: '锂电材料', description: '量产工艺导向' },
  { id: 'cosmetics', name: '功效化妆品', description: '护肤功效导向' },
  { id: 'pesticides', name: '农药科学', description: '增效安全导向' },
  { id: 'pharmaceuticals', name: '药物化学', description: '结构优化导向' }
];

const IndustryCards = () => {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {industries.map((industry) => (
        <div
          key={industry.id}
          className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
          onClick={() => handleCardClick(industry.id)}
        >
          <h3 className="text-xl font-bold">{industry.name}</h3>
          <p className="text-gray-600">{industry.description}</p>
        </div>
      ))}
    </div>
  );
};

export default IndustryCards;
