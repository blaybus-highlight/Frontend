import { useEffect, useRef } from 'react';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens, getTokenRemainingTime } from '@/lib/tokenUtils';
import { refreshAccessToken } from '@/api/login';

export const useTokenRefresh = () => {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const scheduleTokenRefresh = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
      console.log('토큰이 없어서 갱신 스케줄링을 건너뜁니다.');
      return;
    }

    // 현재 토큰의 남은 시간을 계산
    const remainingTime = getTokenRemainingTime(accessToken);
    console.log(`토큰 남은 시간: ${Math.floor(remainingTime / 60)}분 ${Math.floor(remainingTime % 60)}초`);
    
    // 토큰이 이미 만료되었거나 10분 이내에 만료될 예정이면 즉시 갱신
    if (remainingTime <= 600) { // 10분 = 600초
      console.log('토큰이 곧 만료되어 즉시 갱신을 시도합니다.');
      refreshTokenNow();
      return;
    }

    // 토큰 갱신을 10분 전에 스케줄링
    const refreshTime = (remainingTime - 600) * 1000; // 밀리초로 변환
    console.log(`토큰 갱신을 ${Math.floor(refreshTime / 1000 / 60)}분 후에 스케줄링합니다.`);

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
    // 이미 갱신 중이면 중복 실행 방지
    if (isRefreshingRef.current) {
      console.log('토큰 갱신이 이미 진행 중입니다.');
      return;
    }

    try {
      isRefreshingRef.current = true;
      retryCountRef.current = 0;
      
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.warn('Refresh token not found');
        return;
      }

      console.log('토큰 갱신 시도 중...');
      const response = await refreshAccessToken(refreshToken);
      
      // 응답 구조 확인
      if (response.success && response.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // 새로운 토큰 저장
        saveTokens(newAccessToken, newRefreshToken);
        
        console.log('토큰 갱신 성공:', response.data.message);
        
        // 토큰 변경 이벤트 발생
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tokenChanged'));
        }
        
        // 새로운 토큰에 대해 다시 스케줄링
        scheduleTokenRefresh();
      } else {
        throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      
      // 재시도 로직
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // 지수 백오프: 2초, 4초, 8초
        
        console.log(`${retryDelay / 1000}초 후 토큰 갱신 재시도 (${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(() => {
          isRefreshingRef.current = false;
          refreshTokenNow();
        }, retryDelay);
        return;
      }
      
      // 최대 재시도 횟수 초과 시 토큰 삭제
      console.error('최대 재시도 횟수를 초과했습니다. 토큰을 삭제합니다.');
      clearTokens();
      
      // 사용자에게 알림
      if (typeof window !== 'undefined') {
        console.log('로그인이 필요합니다. 로그인 후 이용해주세요.');
        // 필요시 토스트 메시지나 모달 표시
      }
    } finally {
      if (retryCountRef.current >= maxRetries) {
        isRefreshingRef.current = false;
      }
    }
  };

  // 페이지 포커스 시 토큰 상태 확인
  const handlePageFocus = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      const remainingTime = getTokenRemainingTime(accessToken);
      // 토큰이 5분 이내에 만료될 예정이면 즉시 갱신
      if (remainingTime <= 300) {
        console.log('페이지 포커스 시 토큰이 곧 만료되어 갱신을 시도합니다.');
        refreshTokenNow();
      }
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 토큰 갱신 스케줄링
    scheduleTokenRefresh();

    // 토큰 변경 이벤트 리스너
    const handleTokenChange = () => {
      scheduleTokenRefresh();
    };

    // 페이지 포커스 이벤트 리스너
    const handleFocus = () => {
      handlePageFocus();
    };

    window.addEventListener('tokenChanged', handleTokenChange);
    window.addEventListener('focus', handleFocus);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      window.removeEventListener('tokenChanged', handleTokenChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return {
    refreshTokenNow,
    scheduleTokenRefresh
  };
};
