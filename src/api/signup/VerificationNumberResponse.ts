import { API_BASE_URL } from "@/types/api";

// 로그인 요청에 필요한 인자 타입을 정의합니다.
interface VerificationNumberRequest {
  phoneNumber: string;
  verificationCode: string; // 인증번호가 필요한 경우에만 사용
}

/**
 * 인증번호와 휴대번호를 검증하는 API 함수
 * @param {VerificationNumberRequest} params - 휴대번호와 인증번호
 * @throws {Error} 로그인 실패 시 에러
 */
export const verify_number = async ({phoneNumber, verificationCode} : VerificationNumberRequest) => {

  const response = await fetch(`${API_BASE_URL}/api/public/verify-phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, verificationCode }),
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