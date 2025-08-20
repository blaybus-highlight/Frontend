import { API_BASE_URL } from "@/types/api";
import { saveTokens } from "@/lib/tokenUtils";

interface LoginCredentials {
  adminId: string;
  password: string;
}

/**
 * 관리자 로그인을 처리하는 API 함수
 * @param {LoginCredentials} credentials - 관리자 ID와 비밀번호
 * @returns {Promise<string>} 로그인 성공 시 access token
 * @throws {Error} 로그인 실패 시 에러
 */
export const loginAdmin = async ({ adminId, password }: LoginCredentials) => {

  const response = await fetch(`${API_BASE_URL}/api/admin-auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adminId, password }),
  });

  // 응답이 성공적이지 않을 경우
  if (!response.ok) {
    const errorData = await response.json();
    // 백엔드에서 보낸 에러 메시지를 포함하여 에러를 발생시킴
    throw new Error(errorData.message || '로그인에 실패했습니다.');
  }
  const data = await response.json();
  
  const { accessToken, refreshToken } = data.data;
  
  if (accessToken && refreshToken) {
    // 새로운 토큰 관리 시스템 사용
    saveTokens(accessToken, refreshToken);
  } else {
    throw new Error('토큰이 응답에 포함되지 않았습니다.');
  }

  // 성공 시, access token을 반환
  return accessToken;
};