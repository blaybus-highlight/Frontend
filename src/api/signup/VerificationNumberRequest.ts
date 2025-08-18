import { API_BASE_URL } from "@/types/api";

// 로그인 요청에 필요한 인자 타입을 정의합니다.
interface VerificationNumberRequest {
  phoneNumber: string;
}

/**
 * @throws {Error} 로그인 실패 시 에러
 */
export const verificationPhoneNumber = async ({phoneNumber} : VerificationNumberRequest) => {

  const response = await fetch(`${API_BASE_URL}/api/public/request-phone-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber }),
  });

  // 응답이 성공적이지 않을 경우
  if (!response.ok) {
    const errorData = await response.json();
    // 백엔드에서 보낸 에러 메시지를 포함하여 에러를 발생시킴
    throw new Error(errorData.message || '인증번호 발송에 실패했습니다.');
  }
  // 성공 시, JSON 데이터를 파싱하여 반환
  return response.json();
};