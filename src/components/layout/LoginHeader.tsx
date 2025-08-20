// src/components/layout/LoggedInHeader.tsx

'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import Image from "next/image";
import nafalLogo from "@/assets/nafal-logo.png";

export function LoginHeader() {
  const handleLogout = () => {
    // 저장된 토큰과 쿠키를 삭제합니다.
    localStorage.removeItem('accessToken');
    Cookies.remove('accessToken');
    // 홈으로 이동하면서 페이지를 새로고침하여 상태를 초기화합니다.
    window.location.href = '/';
  };

  return (
    <header className='fixed top-0 right-0 left-0 z-50 bg-black'>
      {/* 상단 섹션 */}
      <div className='px-6 py-3'>
        <div className='flex items-center justify-between'>
            <Link href="/" className="flex items-center">
                <Image 
                  src={nafalLogo} 
                  alt="Nafal 로고" 
                  width={96} 
                  height={32} 
                  priority
                />
            </Link>
          <div className='flex items-center space-x-4'>
            {/* --- 변경된 부분 --- */}
            <Link
              className='text-sm text-white transition-colors hover:text-gray-300'
              href='/mypage' // 마이페이지로 이동
            >
              마이페이지
            </Link>
            <button
              onClick={handleLogout} // 로그아웃 함수 연결
              className='text-sm text-white transition-colors hover:text-gray-300'
            >
              로그아웃
            </button>
             {/* --- 여기까지 --- */}
            <button className='text-sm text-white transition-colors hover:text-gray-300'>
              고객센터
            </button>
          </div>
        </div>
      </div>

      {/* 하단 섹션 (검색 및 카테고리) - 동일 */}
      <div className='px-6 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <button className='group relative text-sm text-white transition-colors hover:text-gray-300'>
              추천
              <span className='absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full' />
            </button>
            <button className='group relative text-sm text-white transition-colors hover:text-gray-300'>
              카테고리
              <span className='absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full' />
            </button>
          </div>
          <div className='max-w-md'>
            <div className='relative'>
              <input
                className='w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 pr-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='검색어를 입력해주세요'
                type='text'
              />
              <button className='absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white'>
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
      </div>
    </header>
  );
}