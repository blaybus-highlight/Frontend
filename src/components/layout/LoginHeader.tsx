// src/components/layout/LoggedInHeader.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearTokens } from '@/lib/tokenUtils';

export function LoginHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    // 새로운 토큰 관리 시스템 사용
    clearTokens();
    // 홈으로 이동하면서 페이지를 새로고침하여 상태를 초기화합니다.
    window.location.href = '/';
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className='fixed top-0 right-0 left-0 z-50 bg-black'>
      {/* 상단 섹션 */}
      <div className='px-4 sm:px-6 py-3'>
        <div className='flex items-center justify-between'>
          <Link
            className='text-lg sm:text-xl font-bold text-white transition-colors hover:text-gray-300'
            href='/'
          >
            Nafal
          </Link>
          <div className='hidden sm:flex items-center space-x-4'>
            {/* --- 변경된 부분 --- */}
            <Link
              className='text-sm text-white transition-colors hover:text-gray-300'
              href='/mypage' // 마이페이지로 이동
            >
              마이페이지
            </Link>
            <button
              className='text-sm text-white transition-colors hover:text-gray-300'
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 하단 섹션 */}
      <div className='border-t border-gray-800 px-4 sm:px-6 py-2'>
        <div className='flex items-center justify-between'>
          {/* 검색창 */}
          <div className='flex-1 max-w-md'>
            <div className='relative'>
              <input
                className='w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='상품을 검색해보세요'
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                onClick={handleSearch}
                type='button'
              >
                🔍
              </button>
            </div>
          </div>

          {/* 카테고리 버튼들 */}
          <div className='hidden md:flex items-center space-x-2 ml-4'>
            <button className='text-xs text-white px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-700'>
              랭킹
            </button>
            <button className='text-xs text-white px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-700'>
              카테고리
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}