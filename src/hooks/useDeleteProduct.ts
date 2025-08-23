import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';

interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number): Promise<DeleteProductResponse> => {
      const response = await axiosInstance.delete<DeleteProductResponse>(`/api/admin/products/${productId}`);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('상품 삭제 성공:', data);
      // 상품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['auction'] });
    },
    onError: (error: any) => {
      console.error('상품 삭제 실패:', error);
    },
  });
};
