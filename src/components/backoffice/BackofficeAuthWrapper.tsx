"use client"

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from './AuthGuard';

// 인증이 필요하지 않은 페이지들
const publicPages = ['/backoffice/login', '/backoffice/signup'];

interface BackofficeAuthWrapperProps {
  children: ReactNode;
}

export function BackofficeAuthWrapper({ children }: BackofficeAuthWrapperProps) {
  const pathname = usePathname();
  
  // 공개 페이지인지 확인
  const isPublicPage = publicPages.includes(pathname);
  
  // 공개 페이지가 아닌 경우에만 AuthGuard 적용
  if (isPublicPage) {
    return <>{children}</>;
  }
  
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
