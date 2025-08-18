'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';

// 사이드바에 표시될 메뉴 항목 배열
const navLinks = [
  { href: '/backoffice-main', label: '홈' },
  { href: '/backoffice-main/auction', label: '경매' },
  { href: '/backoffice-main/product', label: '상품' },
  { href: '/backoffice-main/customer', label: '고객' },
  { href: '/backoffice-main/permission', label: '권한' },
  { href: '/backoffice-main/settings', label: '설정' },
];

export default function BackofficeMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 현재 URL 경로를 가져오는 Next.js 훅
  const pathname = usePathname();

  return (
    <section className='flex h-screen bg-gray-100'>
      <aside className='w-52 flex-shrink-0 bg-gray-100 p-4 text-gray-800'>
        
        <nav>
          <ul>
            {navLinks.map((link) => {
              // 현재 경로와 링크의 경로가 일치하는지 확인
              const isActive = pathname === link.href;

              return (
                <li key={link.href} className='mb-2'>
                  <Link
                    href={link.href}
                    // cn 유틸리티를 사용하여 조건부 스타일링 적용
                    // isActive가 true이면 bg-[#6C918B] 클래스를, 아니면 bg-transparent를 적용
                    className={cn(
                      'block p-3 transition-colors',
                      {
                        'bg-[#F4FEFC] text-gray-800 border-r-4 border-[#6C918B]': isActive,
                        'bg-transparent rounded-md': !isActive,
                      },
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className='flex-1 overflow-y-auto p-8'>{children}</main>
    </section>
  );
}
