'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationCenter } from '@/context/NotificationContext';
import { NotificationConfig } from '@/types/notification';

export function NotificationDropdown() {
  const { notifications, isOpen, markAsRead, markAllAsRead, toggleDropdown, clearAll } = useNotificationCenter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 드롭다운 외부 클릭시 닫기 - 임시로 비활성화
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       if (isOpen) {
  //         console.log('외부 클릭으로 드롭다운 닫힘');
  //         toggleDropdown();
  //       }
  //     }
  //   }

  //   if (isOpen) {
  //     document.addEventListener('click', handleClickOutside);
  //   }
    
  //   return () => document.removeEventListener('click', handleClickOutside);
  // }, [isOpen, toggleDropdown]);

  // 상대 시간 계산
  const getRelativeTime = (createdAt: string) => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffMs = now.getTime() - notificationTime.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: typeof notifications[0]) => {
    console.log('알림 클릭됨:', notification);
    console.log('actionUrl:', notification.actionUrl);
    console.log('isRead:', notification.isRead);
    
    // 읽음 처리
    if (!notification.isRead) {
      console.log('읽음 처리 중...');
      markAsRead(notification.id);
    }

    // 해당 페이지로 이동 (이동할 URL이 있을 때만 드롭다운 닫기)
    if (notification.actionUrl) {
      console.log('페이지 이동 중:', notification.actionUrl);
      toggleDropdown();
      router.push(notification.actionUrl);
    } else {
      console.log('actionUrl이 없어서 페이지 이동하지 않음');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            알림 ({notifications.filter(n => !n.isRead).length}개)
          </h3>
          <div className="flex items-center space-x-2">
            {notifications.filter(n => !n.isRead).length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('전체읽음 버튼 클릭됨');
                  markAllAsRead();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                전체읽음
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('전체삭제 버튼 클릭됨');
                clearAll();
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              전체삭제
            </button>
          </div>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">🔔</div>
            <p className="text-gray-500 text-sm">새로운 알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = NotificationConfig[notification.type];
            return (
              <div
                key={notification.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotificationClick(notification);
                }}
                className={`
                  p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50
                  ${!notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* 아이콘 */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}>
                    <span className="text-sm">{config.icon}</span>
                  </div>
                  
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className={`text-xs mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                        {notification.productName && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            📦 {notification.productName}
                          </p>
                        )}
                        {notification.amount && (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            💰 {notification.amount.toLocaleString()}원
                          </p>
                        )}
                      </div>
                      
                      {/* 읽지않음 표시 */}
                      {!notification.isRead && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* 시간 */}
                    <p className="text-xs text-gray-400 mt-2">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 푸터 */}
      {notifications.length > 5 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              toggleDropdown();
              router.push('/notifications');
            }}
          >
            모든 알림 보기
          </button>
        </div>
      )}
    </div>
  );
}