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
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const logout = () => {
    // 새로운 토큰 관리 시스템 사용
    clearTokens();
    setIsAuthenticated(false);
    router.push('/backoffice/login');
  };

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    logout
  };
};
