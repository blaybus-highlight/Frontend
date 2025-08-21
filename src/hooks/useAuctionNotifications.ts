import { useState, useCallback, useRef } from 'react';
import { useSTOMPSocket } from './useSTOMPSocket';

export interface NotificationData {
  type: 'NEW_BID' | 'BID_OUTBID' | 'AUCTION_START' | 'AUCTION_END' | 'AUCTION_ENDED' | 'AUCTION_ENDING_SOON' | 'PRICE_DROP' | 'AUCTION_CANCELLED' | 'AUCTION_UPDATED' | 'AUCTION_SCHEDULED' | 'CONNECTION_LOST' | 'PAYMENT_REQUIRED';
  auctionId?: number;
  productName?: string;
  message: string;
  bidAmount?: number;
  endTime?: string;
  timeRemaining?: string;
  timestamp: string;
  isWon?: boolean;
  productImage?: string;
  currentHighestBid?: number;
  currentWinnerNickname?: string;
}

export interface NotificationState {
  id: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: Date;
}

interface UseAuctionNotificationsProps {
  userId?: number;
  onWinNotification?: (data: NotificationData) => void;
  onLostNotification?: (data: NotificationData) => void;
  onCancelNotification?: (data: NotificationData) => void;
  showToasts?: boolean;
}

export const useAuctionNotifications = ({
  userId,
  onWinNotification,
  onLostNotification,  
  onCancelNotification,
  showToasts = true,
}: UseAuctionNotificationsProps) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  const handleMessage = useCallback((message: any) => {
    const notificationId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const notification: NotificationState = {
      id: notificationId,
      data: message.data || message,
      isRead: false,
      createdAt: new Date(),
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // 토스트 알림 표시
    if (showToasts && (window as any).showNotificationToast) {
      const toastData = {
        type: message.type,
        message: message.data?.message || message.message,
        productName: message.data?.productName,
        bidAmount: message.data?.bidAmount,
        timeRemaining: message.data?.timeRemaining,
        onAction: () => {
          // 액션 버튼 클릭 시 처리할 로직
          console.log(`${message.type} 액션 실행`);
        }
      };
      
      (window as any).showNotificationToast(toastData);
    }

    // 특정 알림 타입별 콜백 실행
    switch (message.type) {
      case 'AUCTION_END':
      case 'AUCTION_ENDED':
        // 낙찰/유찰 판단은 추가 데이터 필요
        if (message.data?.isWon) {
          onWinNotification?.(message.data);
        } else {
          onLostNotification?.(message.data);
        }
        break;
      case 'BID_OUTBID':
        // 낙찰 성공 시 successbid 페이지로 리다이렉트
        if (message.data?.message?.includes('축하합니다! 경매에서 낙찰받으셨습니다')) {
          const params = new URLSearchParams({
            productName: message.data.productName || '',
            productImage: message.data.productImage || '',
            bidAmount: message.data.currentHighestBid?.toString() || message.data.bidAmount?.toString() || '0',
            isAutoBid: 'true',
            bidTime: new Date().toLocaleString('ko-KR')
          });
          window.location.href = `/successbid?${params.toString()}`;
        }
        break;
      case 'PAYMENT_REQUIRED':
        // 결제 필요 알림도 낙찰 성공으로 처리
        const params = new URLSearchParams({
          productName: message.data?.productName || '',
          productImage: message.data?.productImage || '',
          bidAmount: message.data?.currentHighestBid?.toString() || message.data?.bidAmount?.toString() || '0',
          isAutoBid: 'true',
          bidTime: new Date().toLocaleString('ko-KR')
        });
        window.location.href = `/successbid?${params.toString()}`;
        break;
      case 'AUCTION_CANCELLED':
        onCancelNotification?.(message.data);
        break;
    }
  }, [onWinNotification, onLostNotification, onCancelNotification, showToasts]);

  const { isConnected, subscribe, unsubscribe } = useSTOMPSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws',
    onMessage: handleMessage,
    onConnect: () => {
      console.log('🔔 알림 WebSocket 연결됨');
    },
    onDisconnect: () => {
      console.log('🔔 알림 WebSocket 연결 해제됨');
    },
  });

  // 개인 알림 구독
  const subscribeToUserNotifications = useCallback(() => {
    if (!userId || !isConnected) return;
    
    const destination = `/queue/user/${userId}/notifications`;
    if (!subscriptionsRef.current.has(destination)) {
      subscribe(destination, handleMessage);
      subscriptionsRef.current.add(destination);
    }
  }, [userId, isConnected, subscribe, handleMessage]);

  // 경매별 알림 구독
  const subscribeToAuction = useCallback((auctionId: number) => {
    if (!isConnected) return;
    
    const destination = `/topic/auction/${auctionId}`;
    if (!subscriptionsRef.current.has(destination)) {
      subscribe(destination, handleMessage);
      subscriptionsRef.current.add(destination);
    }
  }, [isConnected, subscribe, handleMessage]);

  // 경매 구독 해제
  const unsubscribeFromAuction = useCallback((auctionId: number) => {
    const destination = `/topic/auction/${auctionId}`;
    if (subscriptionsRef.current.has(destination)) {
      unsubscribe(destination);
      subscriptionsRef.current.delete(destination);
    }
  }, [unsubscribe]);

  // 알림 읽음 처리
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  // 알림 삭제
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const filtered = prev.filter(notification => notification.id !== notificationId);
      const removedNotification = prev.find(n => n.id === notificationId);
      if (removedNotification && !removedNotification.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return filtered;
    });
  }, []);

  // 모든 알림 삭제
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    subscribeToUserNotifications,
    subscribeToAuction,
    unsubscribeFromAuction,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };
};