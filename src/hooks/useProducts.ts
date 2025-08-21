import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';
import type { ProductSearchParams } from '@/types/api';

export const useProducts = (params: ProductSearchParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 2, // 2분으로 단축 (더 빠른 상태 변경 반영)
    refetchOnWindowFocus: true, // 윈도우 포커스 시 새로고침 활성화
    refetchInterval: 1000 * 60 * 1, // 1분마다 자동 새로고침 (경매 상태 변경 빠른 반영)
  });
};
