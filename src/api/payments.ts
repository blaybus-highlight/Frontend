import axiosInstance from '@/lib/axiosInstance';

// 즉시 구매 API 응답 타입
export interface BuyItNowResponse {
  success: boolean;
  data: {
    auctionId: number;
    productName: string;
    buyItNowPrice: number;
    usedPointAmount: number;
    actualPaymentAmount: number;
    pointReward: number;
    remainingPoint: number;
    completedAt: string;
    paymentStatus?: string;
  };
  message: string;
}

// 즉시 구매 요청 타입
export interface BuyItNowRequest {
  auctionId: number;
  usePointAmount: number;
  confirmed?: boolean;
  paymentMethod?: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'KAKAO_PAY' | 'NAVER_PAY';
  shippingAddressId?: number;
}

// 결제 미리보기 응답 타입
export interface PaymentPreviewResponse {
  success: boolean;
  data: {
    auctionId: number;
    productName: string;
    productPrice: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      zipCode: string;
      memo: string;
    };
  };
  message: string;
}

// 즉시 구매 API
export const buyItNow = async (request: BuyItNowRequest): Promise<BuyItNowResponse> => {
  try {
    const response = await axiosInstance.post<BuyItNowResponse>('/api/payments/buy-it-now', request);
    return response.data;
  } catch (error) {
    console.error('즉시 구매 API 호출 실패:', error);
    throw error;
  }
};

// 결제 미리보기 API
export const getPaymentPreview = async (auctionId: number): Promise<PaymentPreviewResponse> => {
  try {
    const response = await axiosInstance.get<PaymentPreviewResponse>(`/api/payments/preview/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error('결제 미리보기 API 호출 실패:', error);
    throw error;
  }
};

// 실제 결제 API 응답 타입
export interface ProcessPaymentResponse {
  success: boolean;
  data: {
    paymentId: string;
    status: string;
    completedAt: string;
    pointReward?: number; // 포인트 보상
  };
  message: string;
}

// 실제 결제 API (포인트 최대 활용)
export const processPayment = async (auctionId: number): Promise<ProcessPaymentResponse> => {
  try {
    const response = await axiosInstance.post<ProcessPaymentResponse>(`/api/payments/process/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error('결제 API 호출 실패:', error);
    throw error;
  }
};
