import { API_BASE_URL } from "@/types/api";
import axiosInstance from "@/lib/axiosInstance";

// 로그인 요청에 필요한 인자 타입을 정의합니다.
interface LoginCredentials {
  userId: string;
  password: string;
}

interface TokenRefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    adminId: string;
    adminName: string;
    message: string;
  };
  message: string;
}

/**
 * 사용자 로그인을 처리하는 API 함수
 * @param {LoginCredentials} credentials - 이메일과 비밀번호
 * @returns {Promise<any>} 로그인 성공 시 서버로부터 받은 데이터
 * @throws {Error} 로그인 실패 시 에러
 */
export const loginUser = async ({ userId, password }: LoginCredentials) => {

  const response = await fetch(`${API_BASE_URL}/api/public/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  // 응답이 성공적이지 않을 경우
  if (!response.ok) {
    const errorData = await response.json();
    // 백엔드에서 보낸 에러 메시지를 포함하여 에러를 발생시킴
    throw new Error(errorData.message || '로그인에 실패했습니다.');
  }

  // 성공 시, JSON 데이터를 파싱하여 반환
  return response.json();
};

/**
 * Refresh Token을 사용하여 새로운 Access Token을 발급받는 API 함수
 * @param {string} refreshToken - 현재 저장된 refresh token
 * @returns {Promise<TokenRefreshResponse>} 토큰 갱신 성공 시 새로운 토큰들
 * @throws {Error} 토큰 갱신 실패 시 에러
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
  try {
    // axiosInstance 대신 일반 fetch 사용하여 순환 참조 방지
    const response = await fetch(`${API_BASE_URL}/api/public/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refreshToken })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '토큰 갱신에 실패했습니다.');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || '토큰 갱신에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw new Error('토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
  }
};