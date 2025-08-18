'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuctionDetail } from '@/hooks/useAuctionDetail';
import { useRecommendedProducts } from '@/hooks/useRecommendedProducts';
import ProductInfo from '@/components/product/ProductInfo';

interface ProductDetailPageContentProps {
  productId: string;
}

export default function ProductDetailPageContent({ productId }: ProductDetailPageContentProps) {
  const auctionId = parseInt(productId);
  const { data, isLoading, error } = useAuctionDetail(auctionId);
  const { data: recommendedData, isLoading: isRecommendedLoading } = useRecommendedProducts(auctionId, 4);

  if (isLoading) {
    return (
      <div className='mx-auto px-[100px] py-[64px]'>
        <div className='flex h-96 items-center justify-center'>
          <div className='text-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-500'>상품 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto px-[100px] py-[64px]'>
        <div className='text-center'>
          <div className='text-red-500 text-lg mb-4'>오류가 발생했습니다.</div>
          <p className='text-gray-500'>상품 정보를 불러올 수 없습니다.</p>
          <p className='text-gray-400 text-sm mt-2'>
            에러: {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='mx-auto px-[100px] py-[64px]'>
        <div className='text-center'>
          <div className='text-gray-500'>상품을 찾을 수 없습니다.</div>
          <p className='text-gray-400 text-sm mt-2'>경매 ID: {auctionId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto px-[100px] py-[64px]'>
      <section>
        <ProductInfo auction={data.data} />
      </section>

      {/* Related Products Section */}
      <section className='mt-[40px]'>
        <h2 className='mb-[40px] text-[20px] font-bold text-[#333]'>
          📦 다른 고객이 함께 본 상품
        </h2>
        
        {isRecommendedLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
            <span className='ml-2 text-gray-500'>추천 상품 로딩 중...</span>
          </div>
        ) : recommendedData?.data?.content && recommendedData.data.content.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {recommendedData.data.content.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className='group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md'
              >
                <div className='aspect-square relative overflow-hidden'>
                  <Image
                    src={product.primaryImageUrl || '/placeholder.jpg'}
                    alt={product.productName}
                    fill
                    className='object-cover transition-transform group-hover:scale-105'
                  />
                  {product.isPremium && (
                    <div className='absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded'>
                      Premium
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-[#333] text-sm mb-1 line-clamp-2'>
                    {product.productName}
                  </h3>
                  <p className='text-gray-500 text-xs mb-2 line-clamp-2'>
                    {product.shortDescription}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-400'>
                      {product.category}
                    </span>
                    <span className='text-xs font-medium text-blue-600'>
                      자세히 보기
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-500 py-8'>
            <p>추천 상품이 없습니다.</p>
            <p className='text-sm mt-1'>DB에 관련 상품 데이터가 부족합니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}