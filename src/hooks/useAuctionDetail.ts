import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useAuctionDetail = (auctionId: number) => {
  return useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => productsApi.getAuctionDetail(auctionId),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    enabled: !!auctionId && auctionId > 0,
  });
};