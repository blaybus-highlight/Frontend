'use client';

import { ReactNode } from 'react';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

interface TokenRefreshProviderProps {
  children: ReactNode;
}

export const TokenRefreshProvider = ({ children }: TokenRefreshProviderProps) => {
  // 토큰 갱신 훅 사용
  useTokenRefresh();

  return <>{children}</>;
};
