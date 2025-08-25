'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NotificationItem, NotificationContextType } from '@/types/notification';
import { useMyPage } from '@/hooks/useMyPage';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllNotifications } from '@/api/notifications';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData, error: userError } = useMyPage();

  // 초기 상태는 빈 배열로 시작


  // 알림 데이터 로드 (API만 사용, 더미 데이터 비활성화)
  const loadNotifications = async (userId: string) => {
    try {
      // 실제 API 호출 시도
      const apiNotifications = await getUserNotifications(0, 20);
      setNotifications(apiNotifications);
      console.log(`✅ 사용자 ${userId}의 API 알림 ${apiNotifications.length}개 로드됨`);
    } catch (error) {
      console.log(`⚠️ API 호출 실패: ${error}`);
      // 더미 데이터 대신 빈 배열 설정
      setNotifications([]);
    }
  };

  // 알림 로드 기능 일시적으로 비활성화
  // useEffect(() => {
  //   // 에러가 있거나 사용자 데이터가 없으면 알림 로드 건너뛰기
  //   if (userError || !userData?.userId) {
  //     console.log('사용자 데이터 없음 또는 에러로 인해 알림 로드 건너뛰기:', { userError, userId: userData?.userId });
  //     setNotifications([]); // 빈 배열로 설정
  //     return;
  //   }

  //   try {
  //     loadNotifications(userData.userId);
  //   } catch (error) {
  //     console.error('알림 로드 중 에러:', error);
  //     setNotifications([]); // 에러 시에도 빈 배열로 설정
  //   }
  // }, [userData?.userId, userError]); // productsData 의존성 제거

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    // 실제 서버 알림만 허용 (더미 데이터 필터링)
    console.log('알림 추가 요청:', notification.title, notification.type);
    
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
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