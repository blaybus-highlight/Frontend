import Cookies from 'js-cookie';

// 토큰 저장
export const saveTokens = (accessToken: string, refreshToken: string) => {
  // Access Token은 30분 후 만료
  Cookies.set('accessToken', accessToken, { expires: 1/48 }); // 30분
  // Refresh Token은 7일 후 만료
  Cookies.set('refreshToken', refreshToken, { expires: 7 });
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
  // 토큰 변경 이벤트 발생
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tokenChanged'));
  }
};

// 토큰 가져오기
export const getAccessToken = (): string | null => {
  return Cookies.get('accessToken') || localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
};

// 토큰 삭제
export const clearTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // 토큰 변경 이벤트 발생
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tokenChanged'));
  }
};

// 토큰 만료 시간 확인 (JWT 디코딩)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Access Token이 곧 만료될 예정인지 확인 (10분 전)
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const tenMinutes = 10 * 60; // 10분
    return payload.exp - currentTime < tenMinutes;
  } catch (error) {
    return true;
  }
};

// 토큰의 만료 시간을 가져오기
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    return null;
  }
};

// 토큰의 남은 시간을 초 단위로 가져오기
export const getTokenRemainingTime = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return Math.max(0, payload.exp - currentTime);
  } catch (error) {
    return 0;
  }
};
