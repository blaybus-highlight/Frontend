import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export interface MyPageData {
  userId: string;
  nickname: string;
  point: number;
  rank: string;
  rankDescription: string;
  participationCount: number;
  requiredParticipationForNextRank: number;
  rankProgress: number;
  maskedPhoneNumber: string;
  maskedEmail: string;
}

export const useMyPage = () => {
  const [data, setData] = useState<MyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/api/user/mypage');
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPageData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchMyPageData
  };
};
