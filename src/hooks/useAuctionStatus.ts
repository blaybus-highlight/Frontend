import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useAuctionStatus = (auctionId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['auctionStatus', auctionId],
    queryFn: () => productsApi.getAuctionStatus(auctionId),
    staleTime: 1000 * 10, // 10초 (실시간성을 위해 짧게)
    refetchInterval: 1000 * 15, // 15초마다 자동 새로고침
    refetchOnWindowFocus: true,
    enabled: enabled && !!auctionId && auctionId > 0,
  });
};