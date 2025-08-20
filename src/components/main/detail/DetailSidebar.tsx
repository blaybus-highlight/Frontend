"use client"

import React, { useState } from 'react';
import './DetailSidebar.css';

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

const DetailSidebar = () => {
  // 선택된 카테고리를 관리하는 state (이미지에 맞춰 '가구', '가전'을 기본값으로 설정)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '가구',
    '가전',
  ]);

  // 카테고리를 클릭했을 때 호출될 함수
  const handleCategoryClick = (category: string) => {
    // 이미 선택된 카테고리가 아니라면, 선택 목록에 추가
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // 선택된 필터 태그의 'x' 버튼을 눌렀을 때 호출될 함수
  const handleRemoveCategory = (categoryToRemove: string) => {
    setSelectedCategories(
      selectedCategories.filter((category) => category !== categoryToRemove)
    );
  };

  // 초기화 버튼을 눌렀을 때 호출될 함수
  const handleReset = () => {
    setSelectedCategories([]);
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">필터</h2>
        <button onClick={handleReset} className="reset-button">
          초기화
        </button>
      </div>

      {/* 선택된 필터 목록 */}
      <div className="selected-filters">
        {selectedCategories.map((category) => (
          <div key={category} className="filter-tag">
            {category}
            <button
              onClick={() => handleRemoveCategory(category)}
              className="remove-tag-button"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 전체 카테고리 목록 */}
      <ul className="category-list">
        {allCategories.map((category) => (
          <li
            key={category}
            className="category-item"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DetailSidebar;