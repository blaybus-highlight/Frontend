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
      <div className='px-4 sm:px-6 py-3'>
        <div className='flex items-center justify-between'>
          <Link
            className='text-lg sm:text-xl font-bold text-white transition-colors hover:text-gray-300'
            href='/'
          >
            Nafal
          </Link>
          <div className='hidden sm:flex items-center space-x-4'>
            <Link
              className='text-sm text-white transition-colors hover:text-gray-300'
              href='/mypage'
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
          
          {/* 모바일 햄버거 메뉴 */}
          <button className='sm:hidden text-white p-2'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>
      </div>

      <div className='px-4 sm:px-6 py-3'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0'>
          <div className='hidden sm:flex items-center space-x-8'>
            <button className='group relative text-sm text-white transition-colors hover:text-gray-300'>
              랭킹
              <span className='absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full' />
            </button>
            <button 
              className='group relative text-sm text-white transition-colors hover:text-gray-300'
              onClick={() => router.push('/category')}
            >
              카테고리
              <span className='absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full' />
            </button>
          </div>
          
          {/* 모바일 카테고리 */}
          <div className='flex sm:hidden items-center space-x-4 w-full justify-center'>
            <button className='text-xs text-white px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-700'>
              랭킹
            </button>
            <button className='text-xs text-white px-3 py-1 rounded-full border border-gray-600 hover:bg-gray-700'>
              카테고리
            </button>
          </div>

          <div className='w-full sm:max-w-md'>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 pr-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='검색어를 입력해주세요'
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                onClick={handleSearch}
                className='absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white'
              >
                <svg
                  fill='none'
                  height='20'
                  viewBox='0 0 24 24'
                  width='20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 모바일용 네비게이션 메뉴 (데스큭톱에서는 숨김) */}
        <div className='sm:hidden mt-3 pt-3 border-t border-gray-700'>
          <div className='flex items-center justify-center space-x-6'>
            <Link
              className='text-xs text-white transition-colors hover:text-gray-300'
              href='/mypage'
            >
              마이페이지
            </Link>
            <button 
              className='text-xs text-white transition-colors hover:text-gray-300'
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}