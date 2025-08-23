'use client';

import React from 'react';
import { useNotificationCenter } from '@/context/NotificationContext';

export function NotificationTestButton() {
  const { addNotification } = useNotificationCenter();

  const testNotifications = [
    {
      type: 'BID_OUTBID' as const,
      title: '입찰 경합 발생',
      message: '빈티지 자켓 경매에서 더 높은 입찰이 들어왔습니다.',
      productName: '빈티지 자켓',
      amount: 55000,
      relatedId: 123,
      actionUrl: '/product/123'
    },
    {
      type: 'AUCTION_START' as const,
      title: '경매 시작',
      message: '관심 상품의 경매가 시작되었습니다.',
      productName: '레트로 가방',
      relatedId: 456,
      actionUrl: '/product/456'
    },
    {
      type: 'AUCTION_ENDING_SOON' as const,
      title: '마감 임박',
      message: '경매가 5분 후에 종료됩니다.',
      productName: '클래식 카메라',
      relatedId: 789,
      actionUrl: '/product/789'
    },
    {
      type: 'AUCTION_WON' as const,
      title: '낙찰 성공! 🎉',
      message: '축하합니다! 낙찰받았습니다.',
      productName: '앤틱 시계',
      amount: 75000,
      relatedId: 321,
      actionUrl: '/successbid'
    },
    {
      type: 'NEW_BID' as const,
      title: '새로운 입찰',
      message: '새로운 입찰이 들어왔습니다.',
      productName: '빈티지 램프',
      amount: 42000,
      relatedId: 654,
      actionUrl: '/product/654'
    }
  ];

  const handleTestNotification = (index: number) => {
    const notification = testNotifications[index];
    addNotification({
      ...notification,
      isRead: false
    });
  };

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h4 className="text-sm font-bold mb-2">🧪 알림 테스트</h4>
      <div className="space-y-2">
        {testNotifications.map((notification, index) => (
          <button
            key={index}
            onClick={() => handleTestNotification(index)}
            className="block w-full text-left text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {notification.title}
          </button>
        ))}
        <button
          onClick={() => {
            testNotifications.forEach((_, index) => {
              setTimeout(() => handleTestNotification(index), index * 1000);
            });
          }}
          className="block w-full text-left text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded font-medium"
        >
          🚀 전체 테스트 (1초 간격)
        </button>
      </div>
    </div>
  );
}