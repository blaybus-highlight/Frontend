'use client';

import React, { useState } from 'react';
import { BuyItNowRequest } from '@/types/api';

interface BuyItNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (request: BuyItNowRequest) => void;
  productName: string;
  buyItNowPrice: number;
  isLoading?: boolean;
}

const BuyItNowModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  buyItNowPrice,
  isLoading = false,
}: BuyItNowModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'BANK_TRANSFER' | 'KAKAO_PAY' | 'NAVER_PAY'>('CREDIT_CARD');
  const [shippingAddressId, setShippingAddressId] = useState<number>(1); // 기본 배송지
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!confirmed) {
      alert('구매 확인을 체크해주세요.');
      return;
    }

    onConfirm({
      confirmed: true,
      paymentMethod,
      shippingAddressId,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const paymentMethods = [
    { value: 'CREDIT_CARD', label: '신용카드', icon: '💳' },
    { value: 'BANK_TRANSFER', label: '계좌이체', icon: '🏦' },
    { value: 'KAKAO_PAY', label: '카카오페이', icon: '💛' },
    { value: 'NAVER_PAY', label: '네이버페이', icon: '💚' },
  ] as const;

  // 임시 배송지 데이터 (실제로는 API에서 가져와야 함)
  const shippingAddresses = [
    { id: 1, name: '기본 배송지', address: '서울시 강남구 테헤란로 123' },
    { id: 2, name: '회사', address: '서울시 서초구 강남대로 456' },
    { id: 3, name: '집', address: '경기도 성남시 분당구 정자동 789' },
  ];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden'>
        {/* Header */}
        <div className='relative bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-white hover:text-gray-200 text-xl'
            disabled={isLoading}
          >
            ✕
          </button>
          <div className='text-4xl mb-2'>🛒</div>
          <h2 className='text-xl font-bold'>즉시구매</h2>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* 상품 정보 */}
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              {productName}
            </h3>
            <div className='p-4 bg-green-50 rounded-lg border-l-4 border-green-500'>
              <span className='text-sm text-green-600 font-medium'>즉시구매가</span>
              <div className='text-2xl font-bold text-green-700'>
                {formatPrice(buyItNowPrice)}원
              </div>
            </div>
          </div>

          {/* 결제 방법 선택 */}
          <div>
            <h4 className='text-lg font-semibold mb-3'>결제 방법</h4>
            <div className='grid grid-cols-2 gap-3'>
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type='radio'
                    name='paymentMethod'
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value as 'CREDIT_CARD' | 'BANK_TRANSFER' | 'KAKAO_PAY' | 'NAVER_PAY')}
                    className='hidden'
                  />
                  <span className='text-xl'>{method.icon}</span>
                  <span className='text-sm font-medium'>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 배송지 선택 */}
          <div>
            <h4 className='text-lg font-semibold mb-3'>배송지</h4>
            <div className='space-y-2'>
              {shippingAddresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    shippingAddressId === address.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type='radio'
                    name='shippingAddress'
                    value={address.id}
                    checked={shippingAddressId === address.id}
                    onChange={(e) => setShippingAddressId(Number(e.target.value))}
                    className='mt-1'
                  />
                  <div className='flex-1'>
                    <div className='font-medium text-sm'>{address.name}</div>
                    <div className='text-xs text-gray-600'>{address.address}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 구매 확인 */}
          <div className='p-4 bg-gray-50 rounded-lg'>
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className='mt-1'
              />
              <div className='text-sm text-gray-700'>
                <p className='font-medium mb-1'>구매 내용을 확인했습니다</p>
                <p className='text-xs text-gray-500'>
                  • 즉시구매 시 경매가 즉시 종료됩니다<br />
                  • 결제는 선택한 방법으로 진행됩니다<br />
                  • 취소/환불 정책에 동의합니다
                </p>
              </div>
            </label>
          </div>

          {/* 총 결제 금액 */}
          <div className='p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-blue-600'>총 결제 금액</span>
              <div className='text-right'>
                <div className='text-xl font-bold text-blue-700'>
                  {formatPrice(buyItNowPrice + 5000)}원
                </div>
                <div className='text-xs text-blue-600'>
                  상품가 {formatPrice(buyItNowPrice)}원 + 배송비 5,000원
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !confirmed}
              className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors ${
                isLoading || !confirmed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isLoading ? '구매 처리 중...' : '즉시구매 확정'}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className='w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors'
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyItNowModal;