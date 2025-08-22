import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens } from '@/lib/tokenUtils';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // 새로운 토큰 관리 시스템 사용
        const token = getAccessToken();
        
        if (token) {
          // 토큰이 있으면 인증된 것으로 간주
          setIsAuthenticated(true);
        } else {
          // 토큰이 없어도 인증되지 않은 것으로 설정하되, 페이지는 볼 수 있음
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const requireAuth = (redirectTo: string = '/backoffice/login') => {
    if (!isLoading && !isAuthenticated) {
      // 로그인이 필요한 경우에만 리다이렉트 (선택사항)
      // router.push(redirectTo);
      // return false;
      
      // 로그인이 필요하지 않은 경우 true 반환하여 페이지 접근 허용
      return true;
    }
    return true;
  };

  const logout = () => {
    // 새로운 토큰 관리 시스템 사용
    clearTokens();
    setIsAuthenticated(false);
    // 로그아웃 시 홈페이지로 이동 (선택사항)
    // router.push('/backoffice/login');
  };

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    logout
  };
};
