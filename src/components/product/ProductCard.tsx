'use client';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import React from 'react';

import Bell from '@/assets/bell-icon.svg';
import HeartSelected from '@/assets/heart-selected.svg';
import Leaf from '@/assets/leaf-icon.svg';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const calculateDDay = (openDateString: string) => {
    // Assuming openDateString is in "YYYY년 MM월 DD일 오픈 예정" format
    const parts = openDateString.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
    if (!parts) return null;

    const year = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[3], 10);

    const openDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate day comparison

    const diffTime = openDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `D-${diffDays}`;
    } else if (diffDays === 0) {
      return `D-Day`;
    } else {
      return `D+${Math.abs(diffDays)}`;
    }
  };

  return (
    <Link passHref href={`/product/${product.id}`}>
      <div className='relative min-h-[385px] w-full min-w-[278px] cursor-pointer'>
        {/* Product Image */}
        <div className='relative h-[200px] w-full'>
          <Image
            alt={product.name}
            layout='fill'
            objectFit='cover'
            src={product.imageUrl}
          />
          {/* Bids Count Overlay */}
          <div className='absolute top-0 right-0 px-[12px] py-[4px] text-[12px]/[16px] font-semibold text-[#212121]'>
            {product.bidCount}건 입찰
          </div>
          {product.premium && (
            <div className='absolute top-0 flex h-[25px] w-[84px] items-center justify-center gap-[4px] bg-black text-[12px]/[14px] font-semibold text-white'>
              <Leaf />
              Premium
            </div>
          )}
          <div className='absolute right-0 bottom-0 flex gap-[2px]'>
            <Bell className='size-[32px] p-[6px]' />
            <HeartSelected className='size-[32px] p-[6px]' />
          </div>
        </div>

        {/* Product Details */}
        <div className='flex flex-col gap-[12px] p-[16px]'>
          <div className='flex flex-col gap-[4px]'>
            <p className='text-[16px]/[24px] font-semibold text-[#9E9E9E]'>
              {product.seller.name}
            </p>
            <h3 className='text-[16px]/[20px] font-medium text-[#404040]'>
              {product.name}
            </h3>
          </div>
          <div className='flex flex-col gap-[8px]'>
            <div className='flex justify-between'>
              <p className='text-[16px]/[24px] text-[#525252]'>시작가</p>
              <p className='text-[24px]/[28px] font-bold text-[#171717]'>
                {formatPrice(product.startPrice)} 원
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-[16px]/[24px] text-[#525252]'>즉시 구매가</p>
              <p className='text-[20px]/[24px] font-bold text-[#9E9E9E]'>
                {formatPrice(product.buyNowPrice)} 원
              </p>
            </div>
          </div>
        </div>
        {product.status === '예정' && product.openDate && (
          <div className='border-t border-[#E0E0E0] bg-[#E8FCF9] py-[4px] text-center text-[12px]/[16px] font-semibold text-[#6C918B]'>
            오픈 예정: {calculateDDay(product.openDate)}
          </div>
        )}
        {product.status === '마감' && (
          <div className='border-t border-[#E0E0E0] bg-[#EEE] py-[4px] text-center text-[12px]/[16px] font-semibold text-[#9E9E9E]'>
            마감
          </div>
        )}
        {product.status === '진행중' && (
          <div className='border-t border-[#E0E0E0] bg-[#F4FEFC] py-[4px] text-center text-[12px]/[16px] font-semibold text-[#212121]'>
            15시간 남음
          </div>
        )}
        {product.status === '마감임박' && (
          <div className='border-t border-[#E0E0E0] bg-[#FFEEEC] py-[4px] text-center text-[12px]/[16px] font-semibold text-[#FF5142]'>
            01시간 남음
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
