'use client';

import React, { useEffect, useState } from 'react';

export interface NotificationToastData {
  id: string;
  type: 'NEW_BID' | 'BID_OUTBID' | 'AUCTION_ENDING_SOON' | 'CONNECTION_LOST' | 'AUCTION_UPDATED' | 'AUCTION_START' | 'AUCTION_SCHEDULED';
  message: string;
  productName?: string;
  bidAmount?: number;
  timeRemaining?: string;
  actionText?: string;
  onAction?: () => void;
}

interface NotificationToastProps {
  notification: NotificationToastData;
  onClose: (id: string) => void;
  duration?: number;
}

const NotificationToast = ({ notification, onClose, duration = 5000 }: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 애니메이션을 위해 약간의 지연 후 표시
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // 자동 닫기 타이머
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getNotificationContent = () => {
    switch (notification.type) {
      case 'NEW_BID':
        return {
          message: '새로운 입찰이 들어왔습니다',
          subtitle: notification.productName || '찜대 한 물품잇',
          actionText: '경매 보기',
          bgColor: 'bg-white',
        };
      case 'BID_OUTBID':
        return {
          message: '누군가 더 높은 금액을 제시했어요!',
          subtitle: notification.productName || '찜대 한 물품잇',
          actionText: '재입찰하기',
          bgColor: 'bg-white',
        };
      case 'AUCTION_ENDING_SOON':
        return {
          message: `마감까지 ${notification.timeRemaining || '02:53'} 남았습니다!`,
          subtitle: notification.productName || '찜대 한 물품잇',
          actionText: '확인하기',
          bgColor: 'bg-white',
        };
      case 'CONNECTION_LOST':
        return {
          message: '연결이 끊어졌어요',
          subtitle: '',
          actionText: '다시 연결',
          bgColor: 'bg-white',
        };
      case 'AUCTION_UPDATED':
        return {
          message: '수정되었어요',
          subtitle: '',
          actionText: '',
          bgColor: 'bg-white',
        };
      case 'AUCTION_START':
        return {
          message: '상품이 경매 등록되었어요',
          subtitle: '',
          actionText: '',
          bgColor: 'bg-white',
        };
      case 'AUCTION_SCHEDULED':
        return {
          message: '경매 일정이 확정되었어요',
          subtitle: '',
          actionText: '',
          bgColor: 'bg-white',
        };
      default:
        return {
          message: notification.message,
          subtitle: notification.productName || '',
          actionText: notification.actionText || '',
          bgColor: 'bg-white',
        };
    }
  };

  const content = getNotificationContent();

  return (
    <div
      className={`
        ${content.bgColor} rounded-2xl shadow-lg border border-gray-100 overflow-hidden
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        max-w-sm w-full mb-3
      `}
    >
      <div className="p-4">
        {/* Main Message */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-sm leading-tight mb-1">
              {content.message}
            </p>
            {content.subtitle && (
              <p className="text-gray-600 text-sm">
                {content.subtitle}
              </p>
            )}
          </div>
          
          {/* Action Button */}
          {content.actionText && (
            <button
              onClick={() => {
                notification.onAction?.();
                handleClose();
              }}
              className="ml-3 px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              {content.actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;