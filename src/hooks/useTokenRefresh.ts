import { useEffect, useRef } from 'react';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens, getTokenRemainingTime } from '@/lib/tokenUtils';
import { refreshAccessToken } from '@/api/login';

export const useTokenRefresh = () => {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleTokenRefresh = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
      return;
    }

    // 현재 토큰의 남은 시간을 계산
    const remainingTime = getTokenRemainingTime(accessToken);
    
    // 토큰이 이미 만료되었거나 5분 이내에 만료될 예정이면 즉시 갱신
    if (remainingTime <= 300) { // 5분 = 300초
      refreshTokenNow();
      return;
    }

    // 토큰 갱신을 5분 전에 스케줄링
    const refreshTime = (remainingTime - 300) * 1000; // 밀리초로 변환

    // 기존 타이머가 있으면 제거
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // 새로운 타이머 설정
    refreshTimerRef.current = setTimeout(() => {
      refreshTokenNow();
    }, refreshTime);
  };

  const refreshTokenNow = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.warn('Refresh token not found');
        return;
      }

      const response = await refreshAccessToken(refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      
      // 새로운 토큰 저장
      saveTokens(newAccessToken, newRefreshToken);
      
      console.log('Token refreshed successfully');
      
      // 새로운 토큰에 대해 다시 스케줄링
      scheduleTokenRefresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // 토큰 갱신 실패 시 로그아웃 처리
      clearTokens();
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 토큰 갱신 스케줄링
    scheduleTokenRefresh();

    // 토큰 변경 이벤트 리스너
    const handleTokenChange = () => {
      scheduleTokenRefresh();
    };

    window.addEventListener('tokenChanged', handleTokenChange);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  return {
    refreshTokenNow,
    scheduleTokenRefresh
  };
};
