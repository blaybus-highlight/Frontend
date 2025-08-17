'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import Clock from '@/assets/clock-icon.svg';
import HeartSelected from '@/assets/heart-selected.svg';
import Info from '@/assets/info-icon.svg';
import Leaf from '@/assets/leaf-icon.svg';
import Share from '@/assets/share-icon.svg';
import { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product: productDetails }: ProductInfoProps) => {
  const [activeTab, setActiveTab] = useState('history');

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className='grid grid-cols-1 gap-[40px] md:grid-cols-2'>
      {/* Left Column: Image Only */}
      <div className='relative w-full'>
        <Image
          alt={productDetails.name}
          className='h-auto w-full rounded-2xl object-cover'
          height={676}
          src={productDetails.imageUrl}
          width={676}
        />
        {productDetails.premium && (
          <div className='absolute top-0 flex h-[40px] w-[140px] items-center justify-center gap-[4px] rounded-tl-2xl bg-black text-[12px]/[14px] font-semibold text-white'>
            <Leaf />
            Premium
          </div>
        )}
      </div>

      {/* Right Column: All Textual Information */}
      <div className='relative flex flex-col'>
        {/* Details & Bidding */}
        <div className='flex flex-col gap-[4px]'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-[4px]'>
              <p className='text-[14px] font-medium text-[#666]'>
                {productDetails.popupTitle}
              </p>
              <h1 className='text-[24px]/[28px] font-bold text-[#333]'>
                {productDetails.name}
              </h1>
            </div>
            <div className='flex items-center justify-center gap-[20px]'>
              <HeartSelected height={20} width={20} />
              <Share height={20} width={20} />
            </div>
          </div>
          <div className='mt-[12px] flex flex-col gap-[12px]'>
            <div className='flex flex-wrap gap-2'>
              <span
                className={`rounded-[8px] ${productDetails.status === '진행중' ? 'bg-[#B5F5EB]' : productDetails.status === '마감' ? 'bg-[#BDBDBD]' : productDetails.status === '예정' ? 'bg-[#E0E0E0]' : 'bg-[#FFC9C4]'} p-[8px] text-[16px]/[16px] text-[#2C2C2C]`}
              >
                {productDetails.status}
              </span>
              {productDetails.tags.map((tag) => (
                <span
                  key={tag}
                  className='rounded-[8px] bg-[#F5F5F5] p-[8px] text-[16px]/[16px] text-[#2C2C2C]'
                >
                  # {tag}
                </span>
              ))}
            </div>
            <div className='flex items-center gap-[12px] text-[16px] text-[#616161]'>
              <Clock height={20} width={20} />
              <span>입찰 {productDetails.bidCount}회</span>
            </div>
          </div>
          <p className='mt-[16px] text-[16px] text-[#666]'>
            {productDetails.description}
          </p>

          <div className='rounded[12px] mt-[16px] flex flex-col gap-[13px] bg-[#F9F9F9] p-[20px]'>
            <div className='flex items-center justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>현재가</span>
              <span className='text-[26px] font-bold text-[#333]'>
                {formatPrice(productDetails.currentPrice)}원
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>시작가</span>
              <span className='text-[16px]/[24px] font-semibold text-[#616161]'>
                {formatPrice(productDetails.startPrice)}원
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>
                즉시 구매가
              </span>
              <span className='text-[20px]/[24px] font-bold text-[#616161]'>
                {formatPrice(productDetails.buyNowPrice)}원
              </span>
            </div>

            <hr className='text-[#E9EAEB]' />

            <div className='relative flex items-start justify-between'>
              <div className='flex items-center gap-[6px]'>
                <span className='text-[16px]/[24px] text-[#666]'>
                  상품 상태
                </span>
                <div className='group'>
                  <Info height={20} width={20} />
                  <div className='absolute top-7 -left-1 hidden group-hover:block'>
                    <div className='relative rounded-[8px] bg-black px-[12px] py-[8px] text-[12px]/[18px] font-semibold text-white'>
                      NafaL의 엄격한 품질 가이드
                      <div className='absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-r-6 border-b-6 border-l-6 border-transparent border-b-black' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-[8px]'>
                <span className='text-[16px]/[24px] font-semibold'>
                  {productDetails.condition.status}
                </span>
                <span className='text-[14px]/[20px] text-[#616161]'>
                  {productDetails.condition.details}
                </span>
              </div>
            </div>
            <div className='flex items-start justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>적립</span>
              <div className='flex flex-col items-end gap-[11px]'>
                <span className='text-[16px]/[24px] font-semibold'>
                  {productDetails.rewardPoints}
                </span>
                <span className='text-[14px]/[20px] text-[#616161]'>
                  폐기 대신 재사용하여 CO2 절감
                </span>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div
              className={` ${productDetails.premium ? 'pointer-events-none opacity-50' : ''}`}
            >
              <div
                className={`mt-[36px] flex flex-col gap-[40px] ${productDetails.status === '마감' || productDetails.status === '예정' ? 'hidden' : 'block'} `}
              >
                <div className='flex flex-col gap-[8px]'>
                  <span className='text-[16px]/[24px]'>입찰가</span>
                  <div className='flex gap-[6px]'>
                    <input
                      className='w-full flex-grow border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                      placeholder='1,000원 단위로 입력해주세요.'
                      type='number'
                    />
                    <button
                      className='h-[44px] shrink-0 bg-black px-4 text-[14px] font-bold text-white'
                      type='button'
                    >
                      입찰하기
                    </button>
                  </div>
                </div>
                <button className='h-[48px] w-full bg-black text-[16px]/[22px] font-bold text-white'>
                  즉시 구매하기 ({formatPrice(productDetails.buyNowPrice)}원)
                </button>
              </div>
            </div>

            {/* Bid History Section */}
            <div
              className={`mt-[20px] ${productDetails.status === '예정' ? 'hidden' : 'block'}`}
            >
              <h3 className='mb-[16px] text-[20px] font-bold'>실시간 입찰가</h3>
              {/* Tab Buttons */}
              <div className='mb-[16px] flex rounded-[8px] bg-[#EEE] p-[4px]'>
                <button
                  className={`w-1/2 rounded-[8px] py-[8px] text-[14px]/[20px] font-semibold transition-colors ${activeTab === 'history' ? 'bg-white' : 'bg-transparent'}`}
                  onClick={() => setActiveTab('history')}
                >
                  거래 내역
                </button>
                <button
                  className={`w-1/2 rounded-[8px] py-[8px] text-[14px]/[20px] font-semibold transition-colors ${activeTab === 'graph' ? 'bg-white' : 'bg-transparent'}`}
                  onClick={() => setActiveTab('graph')}
                >
                  그래프
                </button>
              </div>
              {/* Conditional Content */}
              {activeTab === 'history' && (
                <div>
                  <table className='min-w-full text-left text-[16px]/[24px]'>
                    <thead className='text-[#757575]'>
                      <tr>
                        <th className='w-[452px] px-3 py-1 font-normal'>
                          입찰가
                        </th>
                        <th className='px-3 py-1 text-center font-normal'>
                          거래자
                        </th>
                        <th className='px-3 py-1 text-center font-normal'>
                          시간
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDetails.bidHistory.map((bid, index) => (
                        <tr
                          key={bid.price}
                          className={index % 2 === 0 ? 'bg-[#EEE]' : 'bg-white'}
                        >
                          <td className='px-3 py-1'>
                            {formatPrice(bid.price)}원
                          </td>
                          <td className='px-3 py-1 text-center'>
                            {bid.bidder}
                          </td>
                          <td className='px-3 py-1 text-center text-[#757575]'>
                            {bid.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'graph' && (
                <div className='rounded-lg border p-4'>
                  추후 데이터 생기면 구현 예정
                </div>
              )}
              {productDetails.premium && (
                <div
                  className='absolute inset-0 flex items-center justify-center'
                  style={{
                    background:
                      'linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.5) 50%, #FFF 100%)',
                  }}
                >
                  <span className='absolute top-70 left-1/2 flex h-[48px] -translate-x-1/2 items-center justify-center bg-black px-[16px] text-[16px]/[22px] font-bold text-white'>
                    30그루 지불하고 입찰하기
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product & Seller Info Section */}
        <div className='mt-[20px] flex flex-col gap-[16px] rounded-[8px] bg-[#F9F9F9] px-[15px] py-[14px]'>
          {/* Product Info */}
          <h3 className='text-[20px]/[24px] font-bold'>상품 정보</h3>
          <div className='flex flex-col gap-[8px] text-[14px] text-[#666]'>
            <div className='flex gap-[4px]'>
              <p className='w-[60px]'>• 상품명</p>
              <p>{productDetails.productInfo.name}</p>
            </div>
            <div className='flex gap-[4px]'>
              <p className='w-[60px]'>• 사이즈</p>
              <p>{productDetails.productInfo.size}</p>
            </div>
            <div className='flex gap-[4px]'>
              <p className='w-[60px]'>• 상태</p>
              <p>{productDetails.productInfo.condition}</p>
            </div>
            <div className='flex gap-[4px]'>
              <p className='w-[60px]'>• 구성</p>
              <p>{productDetails.productInfo.composition}</p>
            </div>
            <div className='flex gap-[4px]'>
              <p className='w-[60px]'>• 재질</p>
              <p>{productDetails.productInfo.material}</p>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className='mt-[20px] flex flex-col gap-[16px] rounded-[8px] bg-[#F9F9F9] px-[15px] py-[14px]'>
          <h3 className='text-[20px]/[24px] font-bold'>배송 정보</h3>
          <div className='flex gap-[4px] text-[14px]'>
            <p className='w-[60px] text-[#666]'>화물 배송</p>
            <p>5,000원</p>
          </div>
        </div>

        {/* Seller Info */}
        <div className='mt-[20px]'>
          <h3 className='py-[16px] text-[20px]/[24px] font-bold'>
            판매자 정보
          </h3>
          <div className='flex flex-col items-start'>
            <div className='flex items-end gap-[12px] py-[16px]'>
              <Image
                alt={productDetails.seller.name}
                height={80}
                src={productDetails.seller.profileImageUrl}
                width={80}
              />
              <div>
                <h4 className='text-[22px]/[28px] font-bold text-[#0D141C]'>
                  {productDetails.seller.name}
                </h4>
                <p className='text-[16px]/[24px] text-[#4A739C]'>
                  {productDetails.seller.tagline}
                </p>
              </div>
            </div>
            <p className='text-[16px]/[24px] whitespace-pre-line text-[#0D141C]'>
              {productDetails.seller.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
