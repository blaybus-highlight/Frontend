/**
 * 시간대 관련 유틸리티 함수들
 */

/**
 * 한국 시간을 UTC로 변환
 * @param koreaDateTime - 한국 시간 문자열 (YYYY-MM-DDTHH:mm 형식)
 * @returns UTC ISO 문자열
 */
export const convertLocalToUTC = (koreaDateTime: string): string => {
  if (!koreaDateTime) return '';
  
  try {
    // 한국 시간대(+09:00)를 명시적으로 지정하여 UTC로 변환
    const koreaDate = new Date(`${koreaDateTime}:00+09:00`);
    
    // UTC로 변환하여 ISO 문자열 반환
    return koreaDate.toISOString();
  } catch (error) {
    console.error('시간 변환 오류:', error);
    return koreaDateTime;
  }
};

/**
 * UTC 시간을 한국 시간으로 변환
 * @param utcDateTime - UTC 날짜시간 문자열
 * @returns 한국 시간 문자열 (YYYY-MM-DDTHH:mm 형식)
 */
export const convertUTCToLocal = (utcDateTime: string): string => {
  if (!utcDateTime) return '';
  
  try {
    // UTC 시간을 한국 시간대로 변환
    const utcDate = new Date(utcDateTime);
    const koreaTime = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    
    // 한국 시간으로 변환하여 YYYY-MM-DDTHH:mm 형식으로 반환
    const year = koreaTime.getFullYear();
    const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreaTime.getDate()).padStart(2, '0');
    const hours = String(koreaTime.getHours()).padStart(2, '0');
    const minutes = String(koreaTime.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('시간 변환 오류:', error);
    return utcDateTime;
  }
};

/**
 * 현재 한국 시간을 반환
 * @returns 현재 한국 시간 문자열 (YYYY-MM-DDTHH:mm 형식)
 */
export const getCurrentLocalTime = (): string => {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  
  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreaTime.getDate()).padStart(2, '0');
  const hours = String(koreaTime.getHours()).padStart(2, '0');
  const minutes = String(koreaTime.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * 경매 시작/종료 시간 유효성 검사 (한국 시간 기준)
 * @param startTime - 시작 시간 (한국 시간, YYYY-MM-DDTHH:mm 형식)
 * @param endTime - 종료 시간 (한국 시간, YYYY-MM-DDTHH:mm 형식)
 * @returns 유효성 검사 결과
 */
export const validateAuctionTimes = (startTime: string, endTime: string): { isValid: boolean; message?: string } => {
  if (!startTime || !endTime) {
    return { isValid: false, message: '시작 시간과 종료 시간을 모두 입력해주세요.' };
  }
  
  try {
    // 입력된 한국 시간을 Date 객체로 변환
    const start = new Date(`${startTime}:00+09:00`);
    const end = new Date(`${endTime}:00+09:00`);
    
    // 현재 한국 시간 가져오기
    const now = new Date();
    const koreaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { isValid: false, message: '올바른 시간 형식을 입력해주세요.' };
    }
    
    if (start <= koreaNow) {
      return { isValid: false, message: '시작 시간은 현재 시간보다 이후여야 합니다.' };
    }
    
    if (end <= start) {
      return { isValid: false, message: '종료 시간은 시작 시간보다 이후여야 합니다.' };
    }
    
    // 최소 경매 시간 (1시간)
    const minDuration = 60 * 60 * 1000; // 1시간 (밀리초)
    if (end.getTime() - start.getTime() < minDuration) {
      return { isValid: false, message: '경매 시간은 최소 1시간 이상이어야 합니다.' };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('시간 유효성 검사 오류:', error);
    return { isValid: false, message: '시간 형식이 올바르지 않습니다.' };
  }
};

/**
 * 시간을 한국 시간대로 포맷팅
 * @param dateTime - 날짜시간 문자열
 * @returns 한국 시간대 포맷팅된 문자열
 */
export const formatToKoreanTime = (dateTime: string): string => {
  if (!dateTime) return '';
  
  try {
    const date = new Date(dateTime);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('시간 포맷팅 오류:', error);
    return dateTime;
  }
};
