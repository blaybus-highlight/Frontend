'use client';

import { useProducts } from '@/hooks/useProducts';
import type { ProductSearchParams } from '@/types/api';

import { ProductCard } from './ProductCard';

interface ProductGridProps {
  title: string;
  searchParams?: ProductSearchParams;
}

export function ProductGrid({ title, searchParams = {} }: ProductGridProps) {
  const { data, isLoading, error } = useProducts(searchParams);

  // 종료된 경매는 메인페이지에서 제외하고, 섹션별로 적절한 상품만 표시
  const products = (data?.data?.content || []).filter((product) => {
    const status = product.auctionStatus;
    
    // 먼저 종료된 경매는 모든 섹션에서 제외
    if (status === 'ENDED' || status === 'COMPLETED' || status === 'CANCELLED') {
      return false;
    }
    
    // 섹션별 필터링
    if (searchParams.status) {
      // "오늘의 경매 상품" (IN_PROGRESS) 섹션: 진행 중 + 마감 임박 경매만
      if (searchParams.status === 'IN_PROGRESS') {
        return status === 'IN_PROGRESS' || status === 'ENDING_SOON';
      }
      // "경매 예정 상품" (SCHEDULED) 섹션: 예정 경매만
      if (searchParams.status === 'SCHEDULED') {
        return status === 'SCHEDULED';
      }
    }
    
    // status 파라미터가 없으면 모든 활성 경매 표시
    return true;
  });

  // size에 따라 그리드 레이아웃 결정
  const getGridClass = () => {
    const size = searchParams.size || 5;
    if (size === 16) {
      return 'grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4';
    } else if (size === 5) {
      return 'grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5';
    } else {
      return 'grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5';
    }
  };

  if (isLoading) {
    return (
      <section className='px-6 py-12'>
        <div className='mx-auto max-w-7xl'>
          {title && <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>}
          <div className={`grid ${getGridClass()}`}>
            {[...Array(searchParams.size || 5)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className='h-[385px] w-full animate-pulse rounded-lg bg-gray-200'
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='bg-white px-6 py-12'>
        <div className='mx-auto max-w-7xl'>
          {title && <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>}
          <div className='text-center text-red-500'>
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-white px-6 py-12'>
      <div className='mx-auto max-w-7xl'>
        {title && <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>}
        {products.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='mb-2 text-lg text-gray-400'>📦</div>
            <div className='text-gray-500'>등록된 상품이 없습니다.</div>
            <div className='mt-1 text-sm text-gray-400'>
              곧 새로운 상품이 등록될 예정입니다!
            </div>
          </div>
        ) : (
          <div className={`grid ${getGridClass()}`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                bidCount={product.bidCount}
                brand={title === '경매 예정 상품' ? 'SCHEDULED' : product.auctionStatus}
                buyNowPrice={product.buyNowPrice}
                id={String(product.id)}
                image={product.thumbnailUrl}
                productName={product.productName}
                startPrice={product.currentHighestBid || product.minimumBid}
                timeLeft={product.endTime}
                category={product.category}
                brandName={product.brand}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
