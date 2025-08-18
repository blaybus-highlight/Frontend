import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useRecommendedProducts = (productId: number, size: number = 4) => {
  return useQuery({
    queryKey: ['recommendations', productId, size],
    queryFn: () => productsApi.getRecommendedProducts(productId, size),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    enabled: !!productId && productId > 0,
  });
};