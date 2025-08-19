'use client';

import React from 'react';

interface WinNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  winningBid: number;
  onPayment: () => void;
  onViewLater: () => void;
}

const WinNotificationModal = ({
  isOpen,
  onClose,
  productName,
  winningBid,
  onPayment,
  onViewLater,
}: WinNotificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4">
        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            낙찰 알림
          </h2>

          {/* Message */}
          <div className="mb-6 space-y-2">
            <p className="text-gray-700 text-base leading-relaxed">
              축하합니다 🎉 찜대 한 물품이 낙찰되었어요!
            </p>
            <p className="text-gray-700 text-base">
              지금 결제를 진행해 보세요
            </p>
          </div>

          {/* Warning Text */}
          <div className="mb-8">
            <p className="text-red-500 text-sm">
              *결제 후 이용해 사실 제품 직수 > 취소가
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onPayment}
              className="w-full py-3.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              결제하기
            </button>
            <button
              onClick={onViewLater}
              className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>나중에 결제하기</div>
              <div className="text-xs text-gray-500 mt-0.5">
                (경매 마감일까지 기간 2일)
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinNotificationModal;