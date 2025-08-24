'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuctionDetail } from '@/hooks/useAuctionDetail';
import { useViewTogetherProducts } from '@/hooks/useViewTogetherProducts';
import ProductInfo from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/main/ProductCard';

interface ProductDetailPageContentProps {
  productId: string;
}

export default function ProductDetailPageContent({ productId }: ProductDetailPageContentProps) {
  const auctionId = parseInt(productId);
  const { data, isLoading, error } = useAuctionDetail(auctionId);
  const { data: viewTogetherData, isLoading: isViewTogetherLoading } = useViewTogetherProducts(auctionId, 4);

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
        
        {isViewTogetherLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
            <span className='ml-2 text-gray-500'>함께 본 상품 로딩 중...</span>
          </div>
        ) : viewTogetherData?.data?.content && viewTogetherData.data.content.length > 0 ? (
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5'>
            {viewTogetherData.data.content.map((product) => (
              <ProductCard
                key={product.auctionId}
                id={String(product.auctionId)}
                brand={product.brand || product.auctionStatus}
                productName={product.productName}
                startPrice={product.currentHighestBid || 0}
                buyNowPrice={product.buyNowPrice || 0}
                image={product.primaryImageUrl || '/placeholder.jpg'}
                bidCount={product.bidCount}
                timeLeft={product.endTime}
                category={product.category}
                brandName={product.brand}
              />
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-500 py-8'>
            <p>함께 본 상품이 없습니다.</p>
            <p className='text-sm mt-1'>아직 충분한 사용자 데이터가 수집되지 않았습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}