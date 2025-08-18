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

  const products = data?.data?.content || [];

  if (isLoading) {
    return (
      <section className='px-6 py-12'>
        <div className='mx-auto max-w-7xl'>
          <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5'>
            {[...Array(10)].map((_, i) => (
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
      <section className='px-6 py-12'>
        <div className='mx-auto max-w-7xl'>
          <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>
          <div className='text-center text-red-500'>
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='px-6 py-12'>
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>
        {products.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='mb-2 text-lg text-gray-400'>📦</div>
            <div className='text-gray-500'>등록된 상품이 없습니다.</div>
            <div className='mt-1 text-sm text-gray-400'>
              곧 새로운 상품이 등록될 예정입니다!
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                bidCount={product.bidCount}
                brand={title === '경매 예정 상품' ? 'SCHEDULED' : product.auctionStatus}
                buyNowPrice={product.buyNowPrice}
                id={String(product.id)}
                image={product.thumbnailUrl}
                productName={product.productName}
                startPrice={product.currentPrice}
                timeLeft={product.endTime}
                category={product.category}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
