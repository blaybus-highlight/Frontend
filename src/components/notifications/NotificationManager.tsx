'use client';

import React, { useState, useEffect } from 'react';
import { useAuctionNotifications, NotificationData } from '@/hooks/useAuctionNotifications';
import WinNotificationModal from './WinNotificationModal';
import LostNotificationModal from './LostNotificationModal';
import CancelNotificationModal from './CancelNotificationModal';
import NotificationToastContainer from './NotificationToastContainer';
import NotificationDemo from './NotificationDemo';

interface NotificationManagerProps {
  userId?: number;
  currentAuctionId?: number;
}

const NotificationManager = ({ userId, currentAuctionId }: NotificationManagerProps) => {
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [winData, setWinData] = useState<NotificationData | null>(null);
  const [lostData, setLostData] = useState<NotificationData | null>(null);
  const [cancelData, setCancelData] = useState<NotificationData | null>(null);

  const handleWinNotification = (data: NotificationData) => {
    setWinData(data);
    setShowWinModal(true);
  };

  const handleLostNotification = (data: NotificationData) => {
    setLostData(data);
    setShowLostModal(true);
  };

  const handleCancelNotification = (data: NotificationData) => {
    setCancelData(data);
    setShowCancelModal(true);
  };

  const {
    notifications,
    unreadCount,
    isConnected,
    subscribeToUserNotifications,
    subscribeToAuction,
    unsubscribeFromAuction,
  } = useAuctionNotifications({
    userId,
    onWinNotification: handleWinNotification,
    onLostNotification: handleLostNotification,
    onCancelNotification: handleCancelNotification,
    showToasts: true,
  });

  // 개인 알림 구독
  useEffect(() => {
    if (userId && isConnected) {
      subscribeToUserNotifications();
    }
  }, [userId, isConnected, subscribeToUserNotifications]);

  // 현재 보고 있는 경매 구독
  useEffect(() => {
    if (currentAuctionId && isConnected) {
      subscribeToAuction(currentAuctionId);
      
      return () => {
        unsubscribeFromAuction(currentAuctionId);
      };
    }
  }, [currentAuctionId, isConnected, subscribeToAuction, unsubscribeFromAuction]);

  const handlePayment = () => {
    // TODO: 결제 페이지로 이동
    console.log('결제 페이지로 이동');
    setShowWinModal(false);
  };

  const handleViewLater = () => {
    // TODO: 마이페이지 또는 나중에 처리
    console.log('나중에 처리');
    setShowWinModal(false);
  };

  const handleOtherAuctions = () => {
    // TODO: 다른 경매 페이지로 이동
    console.log('다른 경매 보기');
    setShowLostModal(false);
    setShowCancelModal(false);
  };

  const handleMyBids = () => {
    // TODO: 내 입찰 목록으로 이동
    console.log('내 입찰 목록 보기');
    setShowLostModal(false);
    setShowCancelModal(false);
  };

  return (
    <>
      {/* 토스트 알림 컨테이너 */}
      <NotificationToastContainer />

      {/* 낙찰 알림 모달 */}
      <WinNotificationModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        productName={winData?.productName || ''}
        winningBid={winData?.bidAmount || 0}
        onPayment={handlePayment}
        onViewLater={handleViewLater}
      />

      {/* 유찰 알림 모달 */}
      <LostNotificationModal
        isOpen={showLostModal}
        onClose={() => setShowLostModal(false)}
        productName={lostData?.productName || ''}
        finalBid={lostData?.bidAmount}
        onOtherAuctions={handleOtherAuctions}
        onMyBids={handleMyBids}
      />

      {/* 취소 알림 모달 */}
      <CancelNotificationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        productName={cancelData?.productName || ''}
        reason={cancelData?.message}
        onOtherAuctions={handleOtherAuctions}
        onMyBids={handleMyBids}
      />

      {/* 개발용 컴포넌트들 */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* 연결 상태 표시 */}
          <div className="fixed bottom-4 right-4 z-40">
            <div className={`px-3 py-1 rounded-full text-xs ${
              isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {isConnected ? '🔔 연결됨' : '🔔 연결 끊김'}
            </div>
            {unreadCount > 0 && (
              <div className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full text-center">
                {unreadCount}개 읽지 않음
              </div>
            )}
          </div>
          
          {/* 알림 테스트 데모 */}
          <NotificationDemo />
        </>
      )}
    </>
  );
};

export default NotificationManager;