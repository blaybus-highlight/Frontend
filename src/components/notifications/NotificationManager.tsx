'use client';

import React, { useState, useEffect } from 'react';
import { useAuctionNotifications, NotificationData } from '@/hooks/useAuctionNotifications';
import { useNotificationCenter } from '@/context/NotificationContext';
import WinNotificationModal from './WinNotificationModal';
import LostNotificationModal from './LostNotificationModal';
import CancelNotificationModal from './CancelNotificationModal';
import NotificationToastContainer from './NotificationToastContainer';

interface NotificationManagerProps {
  userId?: number;
  currentAuctionId?: number;
}

const NotificationManager = ({ userId, currentAuctionId }: NotificationManagerProps) => {
  const { addNotification } = useNotificationCenter();
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [winData, setWinData] = useState<NotificationData | null>(null);
  const [lostData, setLostData] = useState<NotificationData | null>(null);
  const [cancelData, setCancelData] = useState<NotificationData | null>(null);

  const handleWinNotification = (data: NotificationData) => {
    setWinData(data);
    setShowWinModal(true);
    
    // 알림 센터에 추가
    addNotification({
      type: 'AUCTION_WON',
      title: '낙찰 성공! 🎉',
      message: `축하합니다! "${data.productName || '상품'}"을(를) 낙찰받았습니다.`,
      isRead: false,
      relatedId: data.auctionId,
      actionUrl: `/successbid?data=${encodeURIComponent(JSON.stringify(data))}`,
      productName: data.productName,
      productImage: data.productImage,
      amount: data.bidAmount || data.currentHighestBid
    });
  };

  const handleLostNotification = (data: NotificationData) => {
    setLostData(data);
    setShowLostModal(true);
    
    // 알림 센터에 추가
    addNotification({
      type: 'AUCTION_LOST',
      title: '유찰 안내',
      message: `"${data.productName || '상품'}" 경매에서 아쉽게도 낙찰받지 못했습니다.`,
      isRead: false,
      relatedId: data.auctionId,
      actionUrl: `/product/${data.auctionId}`,
      productName: data.productName,
      productImage: data.productImage,
      amount: data.bidAmount || data.currentHighestBid
    });
  };

  const handleCancelNotification = (data: NotificationData) => {
    setCancelData(data);
    setShowCancelModal(true);
    
    // 알림 센터에 추가
    addNotification({
      type: 'AUCTION_ENDED',
      title: '경매 취소',
      message: `"${data.productName || '상품'}" 경매가 취소되었습니다.`,
      isRead: false,
      relatedId: data.auctionId,
      actionUrl: `/product/${data.auctionId}`,
      productName: data.productName,
      productImage: data.productImage
    });
  };

  // 일반 알림을 알림 센터에 추가하는 함수
  const handleAddToNotificationCenter = (data: NotificationData) => {
    let notificationType: any = 'NEW_BID';
    let title = '';
    let message = data.message;

    switch (data.type) {
      case 'NEW_BID':
        notificationType = 'NEW_BID';
        title = '새로운 입찰';
        break;
      case 'BID_OUTBID':
        notificationType = 'BID_OUTBID';
        title = '입찰 경합';
        break;
      case 'AUCTION_START':
        notificationType = 'AUCTION_START';
        title = '경매 시작';
        break;
      case 'AUCTION_ENDING_SOON':
        notificationType = 'AUCTION_ENDING_SOON';
        title = '마감 임박';
        break;
      case 'AUCTION_ENDED':
        notificationType = 'AUCTION_ENDED';
        title = '경매 종료';
        break;
      case 'PRICE_DROP':
        notificationType = 'PRICE_DROP';
        title = '가격 변동';
        break;
      default:
        return; // 처리하지 않는 타입은 무시
    }

    addNotification({
      type: notificationType,
      title,
      message,
      isRead: false,
      relatedId: data.auctionId,
      actionUrl: data.auctionId ? `/product/${data.auctionId}` : undefined,
      productName: data.productName,
      productImage: data.productImage,
      amount: data.bidAmount || data.currentHighestBid
    });
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
    addNotificationToCenter: handleAddToNotificationCenter,
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

    </>
  );
};

export default NotificationManager;