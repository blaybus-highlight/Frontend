"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSuperAdmin } from '@/lib/tokenUtils';

interface SuperAdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const SuperAdminGuard = ({ children, redirectTo = '/backoffice/dashboard' }: SuperAdminGuardProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSuperAdminAccess = () => {
      try {
        const hasAccess = isSuperAdmin();
        setIsAuthorized(hasAccess);
        
        if (!hasAccess) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('SUPER_ADMIN 권한 확인 중 오류:', error);
        setIsAuthorized(false);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperAdminAccess();
  }, [router, redirectTo]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">권한 확인 중...</div>
      </div>
    );
  }

  // 권한이 없는 경우
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h2>
          <p className="text-gray-600 mb-6">이 페이지는 슈퍼 관리자만 접근할 수 있습니다.</p>
          <button
            onClick={() => router.push('/backoffice/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 권한이 있는 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};