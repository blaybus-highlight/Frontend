'use client';

import React, { useState, useCallback } from 'react';
import NotificationToast, { NotificationToastData } from './NotificationToast';

const NotificationToastContainer = () => {
  const [toasts, setToasts] = useState<NotificationToastData[]>([]);

  const addToast = useCallback((toast: Omit<NotificationToastData, 'id'>) => {
    const newToast: NotificationToastData = {
      ...toast,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    
    setToasts(prev => [newToast, ...prev]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 전역적으로 토스트를 추가할 수 있도록 window 객체에 함수 등록
  React.useEffect(() => {
    (window as any).showNotificationToast = addToast;
    (window as any).clearAllNotificationToasts = clearAllToasts;
    
    return () => {
      delete (window as any).showNotificationToast;
      delete (window as any).clearAllNotificationToasts;
    };
  }, [addToast, clearAllToasts]);

  return (
    <div className="fixed top-36 right-4 z-40 space-y-2 pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            notification={toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationToastContainer;