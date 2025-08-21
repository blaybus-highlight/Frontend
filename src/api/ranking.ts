import axiosInstance from '@/lib/axiosInstance';
import { RankingDashboardResponse, RankingParams } from '@/types/ranking';

export const getRankingDashboard = async (params: RankingParams = {}): Promise<RankingDashboardResponse> => {
  const { page = 0, size = 10 } = params;
  
  const response = await axiosInstance.get('/api/ranking/dashboard', {
    params: {
      page: page.toString(),
      size: size.toString(),
    },
  });
  
  return response.data;
};