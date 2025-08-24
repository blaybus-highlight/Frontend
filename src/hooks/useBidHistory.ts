import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/api/products';

export const useBidHistory = (auctionId: number, page: number = 0, size: number = 50) => {
  console.log('🔍 useBidHistory 호출:', { auctionId, page, size });
  console.log('🔍 enabled 조건 체크:', { 
    auctionId, 
    hasAuctionId: !!auctionId, 
    auctionIdGt0: auctionId > 0,
    enabled: !!auctionId && auctionId > 0 
  });
  
  return useQuery({
    queryKey: ['bidHistory', auctionId, page, size],
    queryFn: () => {
      console.log('🚀 getBidHistory API 호출 시작:', { auctionId, page, size });
      return productsApi.getBidHistory(auctionId, page, size, ['bidTime', 'desc']);
    },
    staleTime: 1000 * 15, // 15초 (실시간 업데이트)
    gcTime: 1000 * 60 * 5, // 5분간 캐시 유지
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!auctionId && auctionId > 0,
    meta: {
      errorMessage: '입찰 내역을 불러오는 중 오류가 발생했습니다.'
    }
  });
};