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
  const { data: userData, error: userError } = useMyPage();
  const { data: productsData, error: productsError } = useProducts({ size: 50 }); // 최근 50개 상품 가져오기

  // 실제 경매 상태를 정확히 분석하는 함수
  const analyzeAuctionStatus = (product: any, currentTime: Date) => {
    // 다양한 상태 속성들 확인
    const status = product.status || product.auctionStatus || '';
    
    // 시간 정보 추출 (여러 속성 체크)
    const startTime = product.scheduledStartTime || product.startTime;
    const endTime = product.scheduledEndTime || product.endTime;
    
    console.log(`🔍 상품 분석: ${product.productName}`, {
      status,
      startTime,
      endTime,
      currentTime: currentTime.toISOString()
    });
    
    // 시간 기반 실제 상태 결정
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (currentTime < start) {
        return { realStatus: 'SCHEDULED', startTime: start, endTime: end };
      } else if (currentTime > end) {
        return { realStatus: 'ENDED', startTime: start, endTime: end };
      } else {
        // 진행 중 - 마감 임박 여부 확인
        const timeToEnd = end.getTime() - currentTime.getTime();
        const hoursToEnd = timeToEnd / (1000 * 60 * 60);
        
        if (hoursToEnd <= 1) {
          return { realStatus: 'ENDING_SOON', startTime: start, endTime: end };
        } else {
          return { realStatus: 'IN_PROGRESS', startTime: start, endTime: end };
        }
      }
    }
    
    // 시간 정보가 불완전한 경우 기존 상태 사용
    const normalizedStatus = normalizeStatus(status);
    return { realStatus: normalizedStatus, startTime: null, endTime: null };
  };
  
  // 상태 정규화 함수 
  const normalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      // 한글 -> 영문
      '예정': 'SCHEDULED',
      '진행중': 'IN_PROGRESS', 
      '마감임박': 'ENDING_SOON',
      '마감': 'ENDED',
      // 영문 통일
      'IN_AUCTION': 'IN_PROGRESS',
      'ACTIVE': 'IN_PROGRESS',
      'CANCELLED': 'ENDED'
    };
    
    return statusMap[status] || status;
  };

  // 상태별 적절한 알림 생성 (시간 기반)
  const generateAppropriateNotification = (
    product: any,
    realStatus: string, 
    startTime: Date | null,
    endTime: Date | null,
    currentTime: Date,
    randomSeed: number
  ) => {
    let notificationType: string;
    let actualMinutesAgo: number;
    let amount: number;
    
    switch (realStatus) {
      case 'SCHEDULED':
        // 경매 예정 -> 시작 예고 알림만
        notificationType = 'AUCTION_START';
        if (startTime) {
          const minutesToStart = (startTime.getTime() - currentTime.getTime()) / (1000 * 60);
          actualMinutesAgo = Math.max(5, Math.floor(minutesToStart * 0.1)) + (randomSeed % 15);
        } else {
          actualMinutesAgo = randomSeed % 120; // 2시간 이내
        }
        amount = product.minimumBid || product.startPrice || 50000;
        break;
        
      case 'IN_PROGRESS':
        // 진행 중 -> 입찰 관련 알림
        const bidTypes = ['NEW_BID', 'BID_OUTBID'];
        notificationType = bidTypes[randomSeed % bidTypes.length];
        actualMinutesAgo = randomSeed % 180; // 3시간 이내
        amount = product.currentHighestBid || product.minimumBid || 50000;
        break;
        
      case 'ENDING_SOON':
        // 마감 임박 -> 마감 알림
        notificationType = 'AUCTION_ENDING_SOON';
        actualMinutesAgo = randomSeed % 45; // 45분 이내
        amount = product.currentHighestBid || product.minimumBid || 50000;
        break;
        
      case 'ENDED':
        // 종료 -> 결과 알림
        notificationType = 'AUCTION_WON';
        if (endTime) {
          const minutesSinceEnd = (currentTime.getTime() - endTime.getTime()) / (1000 * 60);
          actualMinutesAgo = Math.max(10, Math.floor(minutesSinceEnd * 0.8)) + (randomSeed % 30);
        } else {
          actualMinutesAgo = randomSeed % 240; // 4시간 이내
        }
        amount = product.currentHighestBid || product.minimumBid || 50000;
        break;
        
      default:
        // 알 수 없는 상태 -> 안전한 기본값
        notificationType = 'NEW_BID';
        actualMinutesAgo = randomSeed % 120;
        amount = product.minimumBid || product.startPrice || 50000;
    }
    
    return { notificationType, actualMinutesAgo, amount, realStatus };
  };

  // 사용자별 개인화된 알림 생성 (실제 등록된 상품만 사용)
  const generateUserSpecificNotifications = (userId: string): NotificationItem[] => {
    try {
      const userIdNum = userId ? parseInt(userId.replace(/[^0-9]/g, '') || '1') : 1;
      
      // 사용자 ID 기반으로 시드 생성
      const seed = userIdNum * 123;
      
      // 실제 등록된 상품 목록만 사용 (안전하게 접근)
      const realProducts = productsData?.data?.content || [];
      
      // 실제 상품이 없거나 에러가 있으면 빈 배열 반환
      if (realProducts.length === 0 || productsError) {
        console.log('상품 데이터 없음 또는 에러로 더미 알림 생성 건너뛰기');
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
      const relatedId = selectedProduct.productId;
      
      // 현재 시간 기준으로 경매 상태 정확히 분석
      const now = new Date();
      const { realStatus, startTime, endTime } = analyzeAuctionStatus(selectedProduct, now);
      
      // 분석된 실제 상태를 기반으로 적절한 알림 생성
      const { notificationType, actualMinutesAgo, amount } = generateAppropriateNotification(
        selectedProduct,
        realStatus,
        startTime,
        endTime,
        now,
        seed + i
      );
      
      const type = notificationType as 'BID_OUTBID' | 'AUCTION_START' | 'AUCTION_WON' | 'AUCTION_ENDING_SOON' | 'NEW_BID';
      
      console.log(`✅ 알림 생성: ${selectedProduct.productName}`, {
        realStatus,
        notificationType,
        amount: amount.toLocaleString()
      });
      
      let title = '';
      let message = '';
      
      // 실제 상태에 맞는 정확한 메시지 생성
      switch (type) {
        case 'BID_OUTBID':
          title = '입찰 경합 발생';
          message = `${productName} 경매에서 더 높은 입찰이 들어왔습니다.`;
          break;
        case 'AUCTION_START':
          if (realStatus === 'SCHEDULED') {
            title = '경매 시작 예정';
            message = `관심 상품 "${productName}"의 경매가 곧 시작됩니다.`;
          } else {
            title = '경매 시작';
            message = `관심 상품 "${productName}"의 경매가 시작되었습니다.`;
          }
          break;
        case 'AUCTION_WON':
          title = '낙찰 성공!';
          message = `축하합니다! "${productName}"을(를) ${amount.toLocaleString()}원에 낙찰받았습니다.`;
          break;
        case 'AUCTION_ENDING_SOON':
          title = '마감 임박';
          message = `"${productName}" 경매가 곧 종료됩니다. 현재가 ${amount.toLocaleString()}원`;
          break;
        case 'NEW_BID':
          title = '새로운 입찰';
          message = `"${productName}"에 ${amount.toLocaleString()}원 입찰이 들어왔습니다.`;
          break;
      }
      
      // 경매 상태에 따른 적절한 이동 경로 설정
      let actionUrl: string;
      switch (type) {
        case 'AUCTION_WON':
          // 낙찰 성공 시 - 결제/성공 페이지로
          actionUrl = '/successbid';
          break;
        case 'AUCTION_START':
          if (realStatus === 'SCHEDULED') {
            // 경매 예정 -> 경매 상세 페이지 (아직 시작 전)
            actionUrl = `/auction/${selectedProduct.auctionId}`;
          } else {
            // 경매 시작됨 -> 경매 상세 페이지 (참여 가능)
            actionUrl = `/auction/${selectedProduct.auctionId}`;
          }
          break;
        case 'AUCTION_ENDING_SOON':
        case 'NEW_BID':
        case 'BID_OUTBID':
          // 진행중인 경매 -> 경매 상세 페이지 (즉시 참여 가능)
          actionUrl = `/auction/${selectedProduct.auctionId}`;
          break;
        default:
          actionUrl = `/auction/${selectedProduct.auctionId}`;
      }

      notifications.push({
        id: `user-${userId}-${i}`,
        type,
        title,
        message,
        isRead: (seed + i) % 3 === 0, // 약 1/3은 읽음 상태
        createdAt: new Date(Date.now() - actualMinutesAgo * 60 * 1000).toISOString(),
        relatedId: selectedProduct.auctionId, // 경매 상세 페이지용 auctionId 사용
        actionUrl: actionUrl,
        productName,
        productImage,
        amount: amount
      });
    }
    
      return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('더미 알림 생성 중 에러:', error);
      return [];
    }
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
    
    try {
      // API 실패 또는 데이터 없음 시 더미 데이터 사용
      const userNotifications = generateUserSpecificNotifications(userId);
      setNotifications(userNotifications);
      console.log(`📝 사용자 ${userId}의 더미 알림 ${userNotifications.length}개 생성됨`);
    } catch (error) {
      console.error('더미 알림 생성 중 에러:', error);
      // 더미 데이터 생성도 실패하면 빈 배열로 설정
      setNotifications([]);
    }
  };

  // 사용자 데이터 또는 상품 데이터 변경 시 알림 로드  
  useEffect(() => {
    // 에러가 있거나 사용자 데이터가 없으면 알림 로드 건너뛰기
    if (userError || !userData?.userId) {
      console.log('사용자 데이터 없음 또는 에러로 인해 알림 로드 건너뛰기:', { userError, userId: userData?.userId });
      return;
    }

    try {
      loadNotifications(userData.userId);
    } catch (error) {
      console.error('알림 로드 중 에러:', error);
    }
  }, [userData?.userId, productsData, userError]); // userError도 감지

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