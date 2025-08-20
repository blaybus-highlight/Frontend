import { API_BASE_URL } from '@/types/api';
import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens, isTokenExpired, isTokenExpiringSoon } from './tokenUtils';
import { refreshAccessToken } from '@/api/login';

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // API 기본 URL
  timeout: 5000, // 5초 타임아웃
});

// 요청 인터셉터 (요청이 보내지기 전에 실행)
axiosInstance.interceptors.request.use(
  async (config) => {
    // 1. 토큰을 가져옵니다.
    let token = getAccessToken();

    // 2. 토큰이 있고 곧 만료될 예정이면 갱신을 시도합니다.
    if (token && isTokenExpiringSoon(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const response = await refreshAccessToken(refreshToken);
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            
            // 새로운 토큰들을 저장합니다.
            saveTokens(newAccessToken, newRefreshToken);
            token = newAccessToken;
            
            processQueue(null, newAccessToken);
          } else {
            processQueue(new Error('Refresh token not found'));
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(new Error('Refresh token not found'));
          }
        } catch (error) {
          processQueue(error);
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 이미 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          config.headers['Authorization'] = `Bearer ${token}`;
          return config;
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
    }

    // 3. 토큰이 존재하면 헤더에 추가합니다.
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

// 응답 인터셉터 (응답을 받은 후 실행)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const response = await refreshAccessToken(refreshToken);
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            
            // 새로운 토큰들을 저장합니다.
            saveTokens(newAccessToken, newRefreshToken);
            
            // 원래 요청을 새로운 토큰으로 재시도
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            
            return axiosInstance(originalRequest);
          } else {
            processQueue(new Error('Refresh token not found'));
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(new Error('Refresh token not found'));
          }
        } catch (refreshError) {
          processQueue(refreshError);
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 이미 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;