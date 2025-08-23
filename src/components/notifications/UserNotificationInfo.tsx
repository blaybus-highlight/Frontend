'use client';

import React from 'react';
import { useMyPage } from '@/hooks/useMyPage';
import { useNotificationCenter } from '@/context/NotificationContext';
import { useProducts } from '@/hooks/useProducts';

export function UserNotificationInfo() {
  const { data: userData, loading } = useMyPage();
  const { notifications, unreadCount } = useNotificationCenter();
  const { data: productsData } = useProducts({ size: 50 });

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed top-4 right-96 bg-white p-3 rounded-lg shadow-lg border text-xs">
        <p>사용자 정보 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-96 bg-white p-3 rounded-lg shadow-lg border text-xs max-w-xs">
      <h4 className="font-bold mb-2 text-blue-600">🔍 알림 디버그 정보</h4>
      
      <div className="space-y-1">
        <p><strong>사용자 ID:</strong> {userData?.userId || '미로그인'}</p>
        <p><strong>닉네임:</strong> {userData?.nickname || '없음'}</p>
        <p><strong>등록된 상품:</strong> {productsData?.data?.content?.length || 0}개</p>
        <p><strong>총 알림:</strong> {notifications.length}개</p>
        <p><strong>읽지않은:</strong> {unreadCount}개</p>
      </div>

      {notifications.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <p className="font-semibold text-gray-600 mb-1">최근 알림 미리보기:</p>
          {notifications.slice(0, 2).map((notification) => (
            <div key={notification.id} className="text-xs text-gray-500 mb-1">
              • {notification.title} ({notification.isRead ? '읽음' : '안읽음'})
            </div>
          ))}
        </div>
      )}

      {productsData?.data?.content && productsData.data.content.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <p className="font-semibold text-gray-600 mb-1">실제 등록된 상품 (최근 3개):</p>
          {productsData.data.content.slice(0, 3).map((product: any) => (
            <div key={product.id} className="text-xs text-green-600 mb-1">
              • {product.productName}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}