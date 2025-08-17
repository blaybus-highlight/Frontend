import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';
import type { ProductSearchParams } from '@/types/api';

export const useProducts = (params: ProductSearchParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};
