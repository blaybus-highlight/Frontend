'use client';

import { useState } from 'react';
import { useNotificationCenter } from '@/context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const { unreadCount, toggleDropdown } = useNotificationCenter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative p-2 text-white hover:text-gray-300 transition-colors"
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="알림"
      >
        {/* 벨 아이콘 */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isHovered ? 'scale-110' : ''}`}
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* 읽지않은 개수 배지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 */}
      <NotificationDropdown />
    </div>
  );
}