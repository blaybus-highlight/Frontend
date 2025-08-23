'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NotificationItem, NotificationContextType } from '@/types/notification';
import { useMyPage } from '@/hooks/useMyPage';
import { useProducts } from '@/hooks/useProducts';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllNotifications } from '@/api/notifications';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData } = useMyPage();
  const { data: productsData } = useProducts({ size: 50 }); // 최근 50개 상품 가져오기

  // 사용자별 개인화된 알림 생성 (실제 등록된 상품만 사용)
  const generateUserSpecificNotifications = (userId: string): NotificationItem[] => {
    const userIdNum = userId ? parseInt(userId.replace(/[^0-9]/g, '') || '1') : 1;
    
    // 사용자 ID 기반으로 시드 생성
    const seed = userIdNum * 123;
    
    // 실제 등록된 상품 목록만 사용
    const realProducts = productsData?.data?.content || [];
    
    // 실제 상품이 없으면 빈 배열 반환
    if (realProducts.length === 0) {
      return [];
    }
    
    const availableProducts = realProducts;
    
    const notifications: NotificationItem[] = [];
    
    // 사용자별로 3-7개의 알림 생성
    const notificationCount = (seed % 5) + 3;
    
    for (let i = 0; i < notificationCount; i++) {
      const productIndex = (seed + i) % availableProducts.length;
      const selectedProduct = availableProducts[productIndex];
      
      // 실제 상품 데이터에서 정보 추출
      const productName = selectedProduct.productName;
      const productImage = selectedProduct.thumbnailUrl;
      const relatedId = selectedProduct.auctionId || selectedProduct.id;
      const amount = selectedProduct.currentHighestBid || ((seed + i) % 50 + 20) * 1000;
      const minutesAgo = (seed + i) % 300 + 5; // 5분 ~ 305분 전
      
      const types = ['BID_OUTBID', 'AUCTION_START', 'AUCTION_WON', 'AUCTION_ENDING_SOON', 'NEW_BID'] as const;
      const type = types[(seed + i) % types.length];
      
      let title = '';
      let message = '';
      
      switch (type) {
        case 'BID_OUTBID':
          title = '입찰 경합 발생';
          message = `${productName} 경매에서 더 높은 입찰이 들어왔습니다.`;
          break;
        case 'AUCTION_START':
          title = '경매 시작';
          message = `관심 상품 "${productName}"의 경매가 시작되었습니다.`;
          break;
        case 'AUCTION_WON':
          title = '낙찰 성공!';
          message = `축하합니다! "${productName}"을(를) ${amount.toLocaleString()}원에 낙찰받았습니다.`;
          break;
        case 'AUCTION_ENDING_SOON':
          title = '마감 임박';
          message = `"${productName}" 경매가 곧 종료됩니다.`;
          break;
        case 'NEW_BID':
          title = '새로운 입찰';
          message = `"${productName}"에 새로운 입찰이 들어왔습니다.`;
          break;
      }
      
      notifications.push({
        id: `user-${userId}-${i}`,
        type,
        title,
        message,
        isRead: (seed + i) % 3 === 0, // 약 1/3은 읽음 상태
        createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
        relatedId: productIndex + 100,
        actionUrl: type === 'AUCTION_WON' ? '/successbid' : `/product/${relatedId}`,
        productName,
        productImage,
        amount: type === 'AUCTION_START' ? undefined : amount
      });
    }
    
    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  // 알림 데이터 로드 (API 우선, 실패 시 더미 데이터)
  const loadNotifications = async (userId: string) => {
    try {
      // 실제 API 호출 시도
      const apiNotifications = await getUserNotifications(0, 20);
      
      if (apiNotifications.length > 0) {
        setNotifications(apiNotifications);
        console.log(`✅ 사용자 ${userId}의 API 알림 ${apiNotifications.length}개 로드됨`);
        return;
      }
    } catch (error) {
      console.log(`⚠️ API 호출 실패, 더미 데이터로 대체: ${error}`);
    }
    
    // API 실패 또는 데이터 없음 시 더미 데이터 사용
    const userNotifications = generateUserSpecificNotifications(userId);
    setNotifications(userNotifications);
    console.log(`📝 사용자 ${userId}의 더미 알림 ${userNotifications.length}개 생성됨`);
  };

  // 사용자 데이터 또는 상품 데이터 변경 시 알림 로드  
  useEffect(() => {
    if (userData?.userId) {
      loadNotifications(userData.userId);
    }
  }, [userData?.userId, productsData]); // productsData도 감지하여 새 상품 등록 시 알림 업데이트

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // 새 알림이 추가되면 일시적으로 드롭다운 열기 (선택사항)
    // setIsOpen(true);
    // setTimeout(() => setIsOpen(false), 3000);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // 먼저 UI 업데이트 (즉시 반영)
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // API 호출 (백그라운드)
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('알림 읽음 처리 API 실패:', error);
      // API 실패 시 UI 롤백은 하지 않음 (사용자 경험 우선)
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    // 먼저 UI 업데이트
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // API 호출 (백그라운드)
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error('전체 알림 읽음 처리 API 실패:', error);
    }
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const clearAll = useCallback(async () => {
    // 먼저 UI 업데이트 (드롭다운은 열린 상태 유지)
    setNotifications([]);
    
    // API 호출 (백그라운드)
    try {
      await deleteAllNotifications();
    } catch (error) {
      console.error('전체 알림 삭제 API 실패:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isOpen,
      addNotification,
      markAsRead,
      markAllAsRead,
      toggleDropdown,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCenter() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationCenter must be used within a NotificationProvider');
  }
  return context;
}