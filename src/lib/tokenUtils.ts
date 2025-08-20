import Cookies from 'js-cookie';

// 토큰 저장
export const saveTokens = (accessToken: string, refreshToken: string) => {
  // Access Token은 30분 후 만료
  Cookies.set('accessToken', accessToken, { expires: 1/48 }); // 30분
  // Refresh Token은 7일 후 만료
  Cookies.set('refreshToken', refreshToken, { expires: 7 });
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
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

// Access Token이 곧 만료될 예정인지 확인 (5분 전)
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const fiveMinutes = 5 * 60; // 5분
    return payload.exp - currentTime < fiveMinutes;
  } catch (error) {
    return true;
  }
};
