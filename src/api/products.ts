import axios from 'axios';

import type { AuctionDetailResponse, ProductSearchParams, ProductsResponse, SellerDetailResponse, RecommendedProductsResponse, BidHistoryResponse, BidCreateRequest, BidCreateApiResponse, BuyItNowRequest, BuyItNowApiResponse, AuctionResultResponse, AuctionStatusResponse, WishlistResponse, NotificationStatusResponse, ViewTogetherProductsResponse } from '@/types/api';
import { API_BASE_URL } from '@/types/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productsApi = {
  getProducts: async (
    params: ProductSearchParams = {},
  ): Promise<ProductsResponse> => {
    const requestParams = {
      ...params,
      page: params.page || 0,
      size: params.size || 20,
      sortCode: params.sortCode || 'newest',
    };

    console.log('🚀 API 호출:', { params, requestParams });

    const response = await api.get('/api/public/products/', {
      params: requestParams,
    });

    console.log('✅ API 응답 성공:', {
      status: response.status,
      dataCount: response.data?.data?.content?.length || 0,
      totalElements: response.data?.data?.totalElements,
    });

    return response.data;
  },

  getAuctionDetail: async (auctionId: number): Promise<AuctionDetailResponse> => {
    console.log('🚀 경매 상세 API 호출:', { auctionId });

    const response = await api.get(`/api/public/products/${auctionId}`);

    console.log('✅ 경매 상세 API 응답 성공:', {
      status: response.status,
      auctionId: response.data?.data?.auctionId,
      productName: response.data?.data?.productName,
    });

    return response.data;
  },

  getSellerDetail: async (sellerId: number): Promise<SellerDetailResponse> => {
    console.log('🚀 판매자 상세 API 호출:', { sellerId });

    const response = await api.get(`/api/public/sellers/${sellerId}`);

    console.log('✅ 판매자 상세 API 응답 성공:', {
      status: response.status,
      sellerId: response.data?.data?.id,
      sellerName: response.data?.data?.sellerName,
    });

    return response.data;
  },

  getRecommendedProducts: async (productId: number, size: number = 4): Promise<RecommendedProductsResponse> => {
    console.log('🚀 추천 상품 API 호출:', { productId, size });

    const response = await api.get(`/api/admin/products/${productId}/recommendations`, {
      params: { size },
    });

    console.log('✅ 추천 상품 API 응답 성공:', {
      status: response.status,
      productId,
      recommendedCount: response.data?.data?.content?.length || 0,
    });

    return response.data;
  },

  getBidHistory: async (auctionId: number, page: number = 0, size: number = 20, sort: string[] = ['bidTime', 'desc']): Promise<BidHistoryResponse> => {
    const response = await api.get(`/api/auctions/${auctionId}/bids`, {
      params: { 
        page, 
        size, 
        sort: sort // 배열 그대로 전송 (axios가 자동으로 sort=bidTime&sort=desc로 변환)
      },
    });

    console.log('📜 입찰 내역 로딩:', response.data?.data?.content?.length || 0, '개');
    
    if (response.data?.data?.content?.length > 0) {
      console.log('💰 최고가:', response.data.data.content[0].bidAmount + '원');
    }

    return response.data;
  },

  createBid: async (request: BidCreateRequest): Promise<BidCreateApiResponse> => {
    console.log('🚀 입찰하기 API 호출:', request);

    const response = await api.post('/api/bids', request);

    console.log('✅ 입찰하기 API 응답 성공:', {
      status: response.status,
      bidId: response.data?.data?.id,
      bidAmount: response.data?.data?.bidAmount,
    });

    return response.data;
  },

  buyItNow: async (auctionId: number, request: BuyItNowRequest): Promise<BuyItNowApiResponse> => {
    console.log('🚀 즉시구매 API 호출:', { auctionId, request });

    const response = await api.post(`/api/user/auctions/${auctionId}/buy-it-now`, request);

    console.log('✅ 즉시구매 API 응답 성공:', {
      status: response.status,
      auctionId: response.data?.data?.auctionId,
      productName: response.data?.data?.productName,
      buyItNowPrice: response.data?.data?.buyItNowPrice,
      paymentStatus: response.data?.data?.paymentStatus,
      auctionStatus: response.data?.data?.auctionStatus,
    });

    return response.data;
  },

  getMyAuctionResult: async (auctionId: number): Promise<AuctionResultResponse> => {
    console.log('🚀 경매 결과 API 호출:', { auctionId });

    const response = await api.get(`/api/auctions/${auctionId}/my-result`);

    console.log('✅ 경매 결과 API 응답 성공:', {
      status: response.status,
      result: response.data?.data?.status,
      message: response.data?.data?.message,
    });

    return response.data;
  },

  getAuctionStatus: async (auctionId: number): Promise<AuctionStatusResponse> => {
    const response = await api.get(`/api/auctions/${auctionId}/status`);
    
    // 실시간 데이터 로그 (간단하게)
    console.log('🔄 실시간:', response.data?.data?.currentHighestBid + '원', response.data?.data?.status);
    
    return response.data;
  },

  getWishlistStatus: async (productId: number): Promise<WishlistResponse> => {
    console.log('🚀 찜 상태 조회 API 호출:', { productId });

    const response = await api.get(`/api/user/wishlist/products/${productId}`);

    console.log('✅ 찜 상태 조회 API 응답 성공:', {
      status: response.status,
      productId,
      wishlisted: response.data?.data?.wishlisted,
    });

    return response.data;
  },

  toggleWishlist: async (productId: number): Promise<WishlistResponse> => {
    console.log('🚀 찜 토글 API 호출:', { productId });

    const response = await api.post(`/api/user/wishlist/products/${productId}/toggle`);

    console.log('✅ 찜 토글 API 응답 성공:', {
      status: response.status,
      productId,
      wishlisted: response.data?.data?.wishlisted,
      message: response.data?.message,
    });

    return response.data;
  },

  getNotificationStatus: async (productId: number): Promise<NotificationStatusResponse> => {
    console.log('🚀 알림 상태 조회 API 호출:', { productId });

    const response = await api.get(`/api/user/notifications/products/${productId}`);

    console.log('✅ 알림 상태 조회 API 응답 성공:', {
      status: response.status,
      productId,
      active: response.data?.data?.active,
    });

    return response.data;
  },

  toggleNotification: async (productId: number): Promise<NotificationStatusResponse> => {
    console.log('🚀 알림 토글 API 호출:', { productId });

    const response = await api.post(`/api/user/notifications/products/${productId}/toggle`);

    console.log('✅ 알림 토글 API 응답 성공:', {
      status: response.status,
      productId,
      active: response.data?.data?.active,
      message: response.data?.message,
    });

    return response.data;
  },

  getViewTogetherProducts: async (productId: number, size: number = 4): Promise<ViewTogetherProductsResponse> => {
    console.log('🚀 함께 본 상품 API 호출:', { productId, size });

    const response = await api.get(`/api/public/products/${productId}/viewed-together`, {
      params: { size },
    });

    console.log('✅ 함께 본 상품 API 응답 성공:', {
      status: response.status,
      productId,
      viewTogetherCount: response.data?.data?.content?.length || 0,
    });

    return response.data;
  },
};
