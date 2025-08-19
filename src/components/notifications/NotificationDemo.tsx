'use client';

import React from 'react';

const NotificationDemo = () => {
  const showNewBidToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'NEW_BID',
        message: '새로운 입찰이 들어왔습니다',
        productName: '찜대 한 물품잇',
        bidAmount: 150000,
        onAction: () => console.log('경매 보기 클릭')
      });
    }
  };

  const showBidOutbidToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'BID_OUTBID',
        message: '누군가 더 높은 금액을 제시했어요!',
        productName: '찜대 한 물품잇',
        onAction: () => console.log('재입찰하기 클릭')
      });
    }
  };

  const showEndingSoonToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'AUCTION_ENDING_SOON',
        message: '마감까지 02:53 남았습니다!',
        productName: '찜대 한 물품잇',
        timeRemaining: '02:53',
        onAction: () => console.log('확인하기 클릭')
      });
    }
  };

  const showConnectionLostToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'CONNECTION_LOST',
        message: '연결이 끊어졌어요',
        onAction: () => console.log('다시 연결 클릭')
      });
    }
  };

  const showUpdatedToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'AUCTION_UPDATED',
        message: '수정되었어요'
      });
    }
  };

  const showStartToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'AUCTION_START',
        message: '상품이 경매 등록되었어요'
      });
    }
  };

  const showScheduledToast = () => {
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        type: 'AUCTION_SCHEDULED',
        message: '경매 일정이 확정되었어요'
      });
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-bold mb-3">알림 테스트</h3>
        <div className="space-y-2">
          <button 
            onClick={showNewBidToast}
            className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새 입찰 알림
          </button>
          <button 
            onClick={showBidOutbidToast}
            className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            높은 금액 제시 알림
          </button>
          <button 
            onClick={showEndingSoonToast}
            className="w-full px-3 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            마감 임박 알림
          </button>
          <button 
            onClick={showConnectionLostToast}
            className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            연결 끊김 알림
          </button>
          <button 
            onClick={showUpdatedToast}
            className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            수정 알림
          </button>
          <button 
            onClick={showStartToast}
            className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            경매 등록 알림
          </button>
          <button 
            onClick={showScheduledToast}
            className="w-full px-3 py-2 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            일정 확정 알림
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;