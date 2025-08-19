'use client';

import React from 'react';

interface CancelNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  reason?: string;
  onOtherAuctions: () => void;
  onMyBids: () => void;
}

const CancelNotificationModal = ({
  isOpen,
  onClose,
  productName,
  reason,
  onOtherAuctions,
  onMyBids,
}: CancelNotificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4">
        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            취소 알림
          </h2>

          {/* Message */}
          <div className="mb-8">
            <p className="text-gray-700 text-base leading-relaxed">
              입찰하신 찜대 한 물품에이 취소되었어요
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onOtherAuctions}
              className="w-full py-3.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              확인하러가기
            </button>
            <button
              onClick={onMyBids}
              className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelNotificationModal;