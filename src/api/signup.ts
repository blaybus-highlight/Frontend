import { API_BASE_URL, SignUpApiResponse, SignUpRequest } from '@/types/api';

/**
 * 사용자 회원가입을 처리하는 API 함수
 * @param {SignUpRequest} credentials - 회원가입 정보
 * @returns {Promise<SignUpApiResponse>} 회원가입 성공 시 서버로부터 받은 데이터
 * @throws {Error} 회원가입 실패 시 에러
 */
export const signUpUser = async (credentials: SignUpRequest): Promise<SignUpApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/public/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  // 응답이 성공적이지 않을 경우
  if (!response.ok) {
    const errorData = await response.json();
    // 백엔드에서 보낸 에러 메시지를 포함하여 에러를 발생시킴
    throw new Error(errorData.message || '회원가입에 실패했습니다.');
  }

  // 성공 시, JSON 데이터를 파싱하여 반환
  return response.json();
};
