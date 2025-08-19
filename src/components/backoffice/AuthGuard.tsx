"use client"

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = '/backoffice/login' }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth(redirectTo);
  }, [isAuthenticated, isLoading, requireAuth, redirectTo]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">인증 확인 중...</div>
      </div>
    );
  }

  // 인증되지 않은 경우 null 반환 (리다이렉트 처리됨)
  if (!isAuthenticated) {
    return null;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};
