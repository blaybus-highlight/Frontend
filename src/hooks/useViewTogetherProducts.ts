import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';

export function useViewTogetherProducts(productId: number, size: number = 4) {
  return useQuery({
    queryKey: ['viewTogetherProducts', productId, size],
    queryFn: () => productsApi.getViewTogetherProducts(productId, size),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2,
  });
}