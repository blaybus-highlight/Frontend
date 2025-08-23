import { useQuery } from '@tanstack/react-query';
import  axiosInstance  from '@/lib/axiosInstance';

interface PremiumProductResponse {
  productPrice: number;
  productName: string;
  premiumImagesURL: string;
}

interface PremiumProductsApiResponse {
  success: boolean;
  data: PremiumProductResponse[];
  message: string;
}

export const usePremiumProducts = () => {
  return useQuery({
    queryKey: ['premiumProducts'],
    queryFn: async (): Promise<PremiumProductResponse[]> => {
      const response = await axiosInstance.get<PremiumProductsApiResponse>('/api/user/mypage/images');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
