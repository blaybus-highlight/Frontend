import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useBidHistory = (auctionId: number, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['bidHistory', auctionId, page, size],
    queryFn: () => productsApi.getBidHistory(auctionId, page, size),
    staleTime: 1000 * 30, // 30초 (입찰이 자주 업데이트되므로 짧게)
    refetchOnWindowFocus: true,
    enabled: !!auctionId && auctionId > 0,
  });
};