'use client';

import { useState, useEffect } from 'react';
import { LoginHeader } from './LoginHeader';
import { LogoutHeader } from './LogoutHeader';
import { getAccessToken } from '@/lib/tokenUtils';

export function AuthHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      setIsAuthenticated(!!token);
    };

    // 초기 확인
    checkAuth();

    // 토큰 변경 감지를 위한 이벤트 리스너
    const handleTokenChange = () => {
      checkAuth();
    };

    // 커스텀 이벤트로 토큰 변경 감지
    window.addEventListener('tokenChanged', handleTokenChange);
    
    // localStorage 변경 감지 (다른 탭에서의 변경)
    window.addEventListener('storage', handleTokenChange);

    // 주기적으로 토큰 상태 확인 (백업)
    const interval = setInterval(checkAuth, 100);

    return () => {
      window.removeEventListener('tokenChanged', handleTokenChange);
      window.removeEventListener('storage', handleTokenChange);
      clearInterval(interval);
    };
  }, []);

  // 로딩 중이거나 아직 확인되지 않은 경우 기본 헤더 표시
  if (isAuthenticated === null) {
    return <LogoutHeader />;
  }

  return isAuthenticated ? <LoginHeader /> : <LogoutHeader />;
}
