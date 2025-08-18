import { API_BASE_URL } from '@/types/api';
import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // API 기본 URL
  timeout: 5000, // 5초 타임아웃
});

// 요청 인터셉터 (요청이 보내지기 전에 실행)
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem('accessToken');

    // 2. 토큰이 존재하면 헤더에 추가합니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터도 유사하게 설정할 수 있습니다. (예: 401 에러 공통 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리 또는 토큰 갱신 로직
      console.error('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;