import { useQuery } from '@tanstack/react-query';
import { getRankingDashboard } from '@/api/ranking';
import { RankingParams } from '@/types/ranking';

export const useRanking = (params: RankingParams = {}) => {
  return useQuery({
    queryKey: ['ranking', params],
    queryFn: () => getRankingDashboard(params),
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
  });
};