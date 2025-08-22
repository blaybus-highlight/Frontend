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
    // requireAuth 함수를 호출하되, 리다이렉트는 하지 않음
    requireAuth(redirectTo);
  }, [isAuthenticated, isLoading, requireAuth, redirectTo]);

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">인증 확인 중...</div>
      </div>
    );
  }

  // 인증되지 않은 경우에도 자식 컴포넌트 렌더링 (로그인 없이도 페이지 접근 가능)
  // 필요시 로그인 상태에 따라 다른 UI를 보여줄 수 있음
  return <>{children}</>;
};
