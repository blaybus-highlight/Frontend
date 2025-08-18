import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useWishlistStatus = (productId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['wishlist', productId],
    queryFn: () => productsApi.getWishlistStatus(productId),
    enabled: enabled && !!productId && productId > 0,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: (failureCount, error) => {
      // 404 에러는 찜하지 않은 상태로 간주하고 재시도하지 않음
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useWishlistToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => productsApi.toggleWishlist(productId),
    onSuccess: (data, productId) => {
      // 찜 상태 캐시 업데이트
      queryClient.setQueryData(['wishlist', productId], data);
      
      // 찜 목록 캐시 무효화 (다른 페이지에서 찜 목록을 보여주는 경우)
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : '찜 기능 처리 중 오류가 발생했습니다';
      console.error('찜 토글 실패:', errorMessage);
    },
  });
};