import { API_BASE_URL } from "@/types/api";

// 로그인 요청에 필요한 인자 타입을 정의합니다.
interface LoginCredentials {
  userId: string;
  password: string;
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