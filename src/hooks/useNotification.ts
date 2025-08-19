import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

// 알림 상태 조회
export const useNotificationStatus = (productId: number) => {
  return useQuery({
    queryKey: ['notification', productId],
    queryFn: () => productsApi.getNotificationStatus(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // 401(인증 실패) 또는 403(권한 없음) 에러는 재시도하지 않음
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// 알림 토글
export const useNotificationToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.toggleNotification,
    onSuccess: (data, productId) => {
      // 알림 상태 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['notification', productId] });
    },
    onError: (error) => {
      console.error('알림 토글 실패:', error);
    },
  });
};