"use client"

import React, { useState } from 'react';

// 전체 필터 카테고리 목록
const allCategories: string[] = [
  '소품',
  '가구',
  '가전',
  '조형',
  '패션',
  '도예',
  '회화',
];

// 카테고리 매핑 (한글 -> API 카테고리)
const categoryMapping: Record<string, string> = {
  '소품': 'PROPS',
  '가구': 'FURNITURE',
  '가전': 'HOME_APPLIANCES',
  '조형': 'SCULPTURE',
  '패션': 'FASHION',
  '도예': 'CERAMICS',
  '회화': 'PAINTING',
};

interface DetailSidebarProps {
  onCategoryChange?: (categories: string[]) => void;
}

const DetailSidebar = ({ onCategoryChange }: DetailSidebarProps) => {
  // 선택된 카테고리를 관리하는 state (이미지에 맞춰 '가구', '가전'을 기본값으로 설정)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '가구',
    '가전',
  ]);

  // 카테고리를 클릭했을 때 호출될 함수
  const handleCategoryClick = (category: string) => {
    // 이미 선택된 카테고리가 아니라면, 선택 목록에 추가
    if (!selectedCategories.includes(category)) {
      const newSelectedCategories = [...selectedCategories, category];
      setSelectedCategories(newSelectedCategories);
      
      // API 카테고리 값으로 변환하여 부모 컴포넌트에 전달
      if (onCategoryChange) {
        const apiCategories = newSelectedCategories.map(cat => categoryMapping[cat]).filter(Boolean);
        onCategoryChange(apiCategories);
      }
    }
  };

  // 선택된 필터 태그의 'x' 버튼을 눌렀을 때 호출될 함수
  const handleRemoveCategory = (categoryToRemove: string) => {
    const newSelectedCategories = selectedCategories.filter((category) => category !== categoryToRemove);
    setSelectedCategories(newSelectedCategories);
    
    // API 카테고리 값으로 변환하여 부모 컴포넌트에 전달
    if (onCategoryChange) {
      const apiCategories = newSelectedCategories.map(cat => categoryMapping[cat]).filter(Boolean);
      onCategoryChange(apiCategories);
    }
  };

  // 초기화 버튼을 눌렀을 때 호출될 함수
  const handleReset = () => {
    setSelectedCategories([]);
    if (onCategoryChange) {
      onCategoryChange([]);
    }
  };

  return (
    <aside className="h-full bg-white p-6">
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">필터</h2>
        <button 
          onClick={handleReset} 
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          초기화
        </button>
      </div>

      {/* 선택된 필터 목록 */}
      {selectedCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div key={category} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                {category}
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 섹션 */}
      <div className="mb-6">
        <div className="space-y-2">
          {allCategories.map((category) => (
            <button
              key={category}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                selectedCategories.includes(category)
                  ? 'font-semibold text-gray-900'
                  : 'font-normal text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DetailSidebar;