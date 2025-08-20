'use client';

import Link from 'next/link';
import Image from "next/image";
import nafalLogo from "@/assets/nafal-logo.png";

export function LogoutHeader() {
  return (
    <header className='fixed top-0 right-0 left-0 z-50 bg-black'>
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
            <Link
              className='text-sm text-white transition-colors hover:text-gray-300'
              href='/login'
            >
              로그인
            </Link>
            <Link
              className='text-sm text-white transition-colors hover:text-gray-300'
              href='/signup'
            >
              회원가입
            </Link>
            <button className='text-sm text-white transition-colors hover:text-gray-300'>
              고객센터
            </button>
          </div>
        </div>
      </div>

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
