'use client';

import { useState } from 'react';
import { ProductGrid } from '@/components/main/ProductGrid';
import DetailSidebar from '@/components/main/detail/DetailSidebar';
import type { ProductSearchParams } from '@/types/api';

export default function ProductCategory() {
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({
    size: 16,
    page: 0,
    status: 'IN_PROGRESS' // 진행중인 경매만 표시
  });

  // 사이드바에서 카테고리 필터가 변경될 때 호출되는 함수
  const handleCategoryFilterChange = (categories: string[]) => {
    setSearchParams(prev => ({
      ...prev,
      status: 'IN_PROGRESS', // 진행중인 경매만 유지
      category: categories.length > 0 ? categories[0] as any : undefined
    }));
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* 사이드바 */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200">
        <DetailSidebar onCategoryChange={handleCategoryFilterChange} />
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        <div className="px-12 py-8">
          <div className="mb-6">
          </div>
          <ProductGrid 
            title="" 
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}
