'use client';

import React from 'react';

interface AuctionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  endedAt?: string;
}

const AuctionExpiredModal = ({ isOpen, onClose, productName, endedAt }: AuctionExpiredModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            경매가 마감되었습니다
          </h3>
          
          <p className="text-sm text-gray-600 mb-1">
            <strong>{productName}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            입찰이 마감되어 더 이상 구매할 수 없습니다.
            {endedAt && <><br />마감 시간: {new Date(endedAt).toLocaleString('ko-KR')}</>}
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 font-medium"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionExpiredModal;