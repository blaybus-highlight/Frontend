'use client';

import React from 'react';
import { AuctionResult } from '@/types/api';

interface AuctionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AuctionResult | null;
  productName: string;
  onPayment?: () => void;
  onOtherAuctions?: () => void;
  onMyBids?: () => void;
}

const AuctionResultModal = ({
  isOpen,
  onClose,
  result,
  productName,
  onPayment,
  onOtherAuctions,
  onMyBids,
}: AuctionResultModalProps) => {
  if (!isOpen || !result) return null;

  const getModalContent = () => {
    switch (result.resultType) {
      case 'WON':
        return {
          emoji: '🎉',
          title: '축하합니다!',
          message: result.message,
          buttonText: result.actionButtonText,
          buttonAction: onPayment,
          buttonColor: 'bg-green-500 hover:bg-green-600',
        };
      case 'LOST':
        return {
          emoji: '😔',
          title: '아쉽게도 놓쳤습니다',
          message: result.message,
          buttonText: result.actionButtonText,
          buttonAction: onOtherAuctions,
          buttonColor: 'bg-blue-500 hover:bg-blue-600',
        };
      case 'CANCELLED':
        return {
          emoji: '❌',
          title: '경매가 취소되었습니다',
          message: result.message,
          buttonText: result.actionButtonText,
          buttonAction: onMyBids,
          buttonColor: 'bg-gray-500 hover:bg-gray-600',
        };
      case 'NOT_PARTICIPATED':
        return {
          emoji: '🤔',
          title: '참여하지 않은 경매',
          message: result.message,
          buttonText: result.actionButtonText || '다른 경매 보기',
          buttonAction: onOtherAuctions,
          buttonColor: 'bg-gray-500 hover:bg-gray-600',
        };
      default:
        return {
          emoji: '❓',
          title: '알 수 없는 상태',
          message: '경매 결과를 확인할 수 없습니다',
          buttonText: '확인',
          buttonAction: onClose,
          buttonColor: 'bg-gray-500 hover:bg-gray-600',
        };
    }
  };

  const content = getModalContent();

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden'>
        {/* Header */}
        <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-white hover:text-gray-200 text-xl'
          >
            ✕
          </button>
          <div className='text-4xl mb-2'>{content.emoji}</div>
          <h2 className='text-xl font-bold'>{content.title}</h2>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='text-center mb-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              {productName}
            </h3>
            <p className='text-gray-600 leading-relaxed mb-4'>
              {content.message}
            </p>

            {/* 입찰 정보 */}
            <div className='space-y-3'>
              {result.myFinalBid && (
                <div className='p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500'>
                  <span className='text-sm text-blue-600 font-medium'>내 최종 입찰가</span>
                  <div className='text-xl font-bold text-blue-700'>
                    {result.myFinalBid.toLocaleString('ko-KR')}원
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-lg border-l-4 ${
                result.resultType === 'WON' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-gray-50 border-gray-400'
              }`}>
                <span className={`text-sm font-medium ${
                  result.resultType === 'WON' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  최종 낙찰가
                </span>
                <div className={`text-xl font-bold ${
                  result.resultType === 'WON' ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {result.winningBid.toLocaleString('ko-KR')}원
                </div>
              </div>

              <div className='p-3 bg-gray-100 rounded-lg'>
                <span className='text-sm text-gray-500'>경매 종료 시간</span>
                <div className='text-sm font-medium text-gray-700'>
                  {new Date(result.endTime).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <button
              onClick={content.buttonAction}
              className={`w-full py-3 px-4 ${content.buttonColor} text-white font-semibold rounded-lg transition-colors`}
            >
              {content.buttonText}
            </button>
            <button
              onClick={onClose}
              className='w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors'
            >
              나중에 하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionResultModal;