import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useSellerDetail = (sellerId: number) => {
  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => productsApi.getSellerDetail(sellerId),
    staleTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: false,
    enabled: !!sellerId && sellerId > 0,
  });
};