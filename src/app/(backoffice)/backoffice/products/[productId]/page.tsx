'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';

interface ProductDetail {
  id: number;
  productName: string;
  shortDescription: string;
  history: string;
  size: string;
  productCount: number;
  material: string;
  manufactureYear: number;
  brand: string;
  expectedEffects: string;
  detailedInfo: string;
  status: string;
  statusDescription: string;
  category: string;
  registeredBy: number;
  images: Array<{
    id: number;
    imageUrl: string;
    originalFileName: string;
  }>;
  primaryImageUrl: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchProductDetail = async (productId: string): Promise<{ success: boolean; data: ProductDetail; message: string }> => {
  const response = await axiosInstance.get(`/api/admin/products/${productId}`);
  return response.data;
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => fetchProductDetail(productId),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">오류가 발생했습니다.</div>
          <p className="text-gray-500">상품 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500">상품을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const product = data.data;

  // 카테고리 한국어 변환
  const getCategoryDisplay = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'PROPS': '소품',
      'FURNITURE': '가구',
      'HOME_APPLIANCES': '가전',
      'SCULPTURE': '조형',
      'FASHION': '패션',
      'CERAMICS': '도예',
      'PAINTING': '회화'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* 상품 정보 섹션 */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h1 className="text-2xl font-bold text-black mb-6">상품 정보</h1>
          <div className="space-y-4">
            {/* 판매 분류, 카테고리 - 같은 행 */}
            <div className="grid grid-cols-2 gap-16">
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">판매 분류</span>
                <span className="text-black ml-4">일반</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">카테고리</span>
                <span className="text-black ml-4">{getCategoryDisplay(product.category)}</span>
              </div>
            </div>

            {/* 상품명 - 따로 */}
            <div className="flex">
              <span className="w-32 font-medium text-gray-400">상품명</span>
              <span className="text-black ml-4">{product.productName}</span>
            </div>

            {/* 사이즈, 개수 - 같은 행 */}
            <div className="grid grid-cols-2 gap-16">
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">사이즈</span>
                <span className="text-black ml-4">{product.size || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">개수</span>
                <span className="text-black ml-4">{product.productCount || 1}</span>
              </div>
            </div>

            {/* 재질, 생산년도 - 같은 행 */}
            <div className="grid grid-cols-2 gap-16">
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">재질</span>
                <span className="text-black ml-4">{product.material || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">생산년도</span>
                <span className="text-black ml-4">{product.manufactureYear || '-'}</span>
              </div>
            </div>

            {/* 브랜드명, 상품 상태 등급 - 같은 행 */}
            <div className="grid grid-cols-2 gap-16">
              <div className="flex">
                <span className="w-32 font-medium text-gray-400">브랜드명</span>
                <span className="text-black ml-4">{product.brand || '-'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-400">상품 상태 등급</span>
                <span className="text-black ml-4 mr-2">상</span>
                <div className="relative group">
                  <span className="text-sm cursor-help bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">ⓘ</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    상품 상태 등급 기준 가이드
                  </div>
                </div>
              </div>
            </div>

            {/* 상품 상태 설명 - 따로 */}
            <div className="flex">
              <span className="w-32 font-medium text-gray-400">상품 상태 설명</span>
              <span className="text-black ml-4">{product.shortDescription || '상품 상태 설명이 없습니다.'}</span>
            </div>
          </div>
        </div>

        {/* 상품 소개 섹션 */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-base font-medium text-gray-400 mb-4">상품 소개</h2>
          <p className="text-black leading-relaxed">{product.shortDescription || '상품 소개가 없습니다.'}</p>
        </div>

        {/* 상품 히스토리 소개 섹션 */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-base font-medium text-gray-400 mb-4">상품 히스토리 소개</h2>
          <p className="text-black leading-relaxed">{product.history || '상품 히스토리 정보가 없습니다.'}</p>
        </div>

        {/* 기대효과 섹션 */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-base font-medium text-gray-400 mb-4">기대효과</h2>
          <p className="text-black leading-relaxed">{product.expectedEffects || '기대효과 정보가 없습니다.'}</p>
        </div>

        {/* 추가 설명 섹션 */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-base font-medium text-gray-400 mb-4">추가 설명</h2>
          <p className="text-black leading-relaxed">{product.detailedInfo || '추가 설명이 없습니다.'}</p>
        </div>

        {/* 상품 이미지 섹션 */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-base font-bold text-black mb-4">상품 이미지</h2>
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={image.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 border border-gray-300 rounded overflow-hidden bg-gray-100">
                    <img
                      src={image.imageUrl || '/placeholder.jpg'}
                      alt={image.originalFileName || '상품 이미지'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-black">{image.originalFileName || `이미지 ${index + 1}`}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border border-gray-300 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">이미지 없음</span>
                </div>
                <span className="text-gray-500">등록된 이미지가 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        {/* 상품 수정하기 버튼 */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium"
          >
            상품 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
