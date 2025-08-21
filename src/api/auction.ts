import { ProductListResponse, ProductRegistrationRequest, ProductRegistrationResponse } from '@/types/auction';
import { API_BASE_URL } from "@/types/api";
import axiosInstance from "@/lib/axiosInstance";

export interface AuctionItem {
  productId: number;
  productName: string;
  startPrice: number | null;
  currentHighestBid: number;
  scheduledEndTime: string;
  statusDescription: string;
  scheduledStartTime: string;
  actualEndTime: string | null;
}

export interface AuctionListResponse {
  auctions: AuctionItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// API 응답 인터페이스
interface ApiAuctionItem {
  id: number;
  product: {
    id: number;
    productName: string;
  };
  statusDescription: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualEndTime: string | null;
  startPrice: number | null;
  currentHighestBid: number;
}

interface ApiAuctionResponse {
  content: ApiAuctionItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const getAuctionList = async (
  page: number = 1,
  size: number = 50,
  status?: string,
  searchTerm?: string
): Promise<AuctionListResponse> => {
  try {
    const params = new URLSearchParams({
      page: (page - 1).toString(), // API는 0-based pagination 사용
      size: size.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    if (searchTerm) {
      params.append('search', searchTerm);
    }

    const response = await axiosInstance.get(`${API_BASE_URL}/api/admin/auctions?${params.toString()}`);
    
    // 디버깅을 위해 응답 데이터 로깅
    // console.log('API Response:', response.data);
    
    const responseData = response.data;
    
    // 응답 구조 확인 및 안전한 처리
    if (!responseData || !responseData.data || !responseData.data.content) {
      // console.error('Invalid API response structure:', responseData);
      throw new Error('API 응답 구조가 올바르지 않습니다.');
    }
    
    const data = responseData.data;
    
    // 필요한 필드만 추출하여 변환
    const auctions: AuctionItem[] = data.content.map((item: ApiAuctionItem) => ({
      productId: item.product?.id || 0,
      productName: item.product?.productName || '',
      startPrice: item.startPrice,
      currentHighestBid: item.currentHighestBid || 0,
      scheduledEndTime: item.scheduledEndTime || '',
      statusDescription: item.statusDescription || '',
      scheduledStartTime: item.scheduledStartTime || '',
      actualEndTime: item.actualEndTime,
    }));

    return {
      auctions,
      totalCount: data.totalElements || 0,
      currentPage: (data.number || 0) + 1, // 1-based로 변환
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    // console.error('경매 목록 조회 실패:', error);
    throw error;
  }
};

export const getAuctionById = async (auctionId: string): Promise<AuctionItem> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/api/admin/auctions/${auctionId}`);
    return response.data;
  } catch (error) {
    // console.error('경매 상세 조회 실패:', error);
    throw error;
  }
};

export interface CreateAuctionRequest {
  productId: number;
  startPrice: number;
  bidUnit: number;
  maxBid: number;
  minimumBid: number;
  buyItNowPrice: number;
  shippingFee: number;
  isPickupAvailable: boolean;
  scheduledStartTime: string;
  scheduledEndTime: string;
  description: string;
}

export const createAuction = async (auctionData: CreateAuctionRequest) => {
  try {
    const response = await axiosInstance.post('/api/admin/auctions/schedule', auctionData);
    return response.data;
  } catch (error) {
    console.error('경매 생성 실패:', error);
    throw error;
  }
};

export const updateAuction = async (
  auctionId: string,
  auctionData: Partial<AuctionItem>
): Promise<AuctionItem> => {
  try {
    const response = await axiosInstance.put(`/auctions/${auctionId}`, auctionData);
    return response.data;
  } catch (error) {
    // console.error('경매 수정 실패:', error);
    throw error;
  }
};

export const deleteAuction = async (auctionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/auctions/${auctionId}`);
  } catch (error) {
    // console.error('경매 삭제 실패:', error);
    throw error;
  }
};

/**
 * 상품 등록 API
 * @param productData - 상품 등록 데이터
 * @returns Promise<ProductRegistrationResponse>
 */
export const registerProduct = async (
  productData: ProductRegistrationRequest
): Promise<ProductRegistrationResponse> => {
  try {
    // console.log('상품 등록 요청 데이터:', productData);
    
    const response = await axiosInstance.post<ProductRegistrationResponse>(
      '/api/admin/products',
      productData
    );
    
    // console.log('상품 등록 응답:', response.data);
    return response.data;
  } catch (error) {
    // console.error('상품 등록 실패:', error);
    throw error;
  }
};

/**
 * 상품 등록 API (1단계: 임시 저장)
 * @param productData - 상품 등록 데이터
 * @returns Promise<ProductRegistrationResponse>
 */
export const createProductDraft = async (
  productData: ProductRegistrationRequest
): Promise<ProductRegistrationResponse> => {
  try {
    const draftData = { ...productData, draft: true };
    // console.log('상품 등록 요청 데이터:', draftData);
    
    const response = await axiosInstance.post<ProductRegistrationResponse>(
      '/api/admin/products',
      draftData
    );
    
    // console.log('상품 등록 응답:', response.data);
    return response.data;
  } catch (error) {
    // console.error('상품 임시 저장 실패:', error);
    throw error;
  }
};

/**
 * 상품 상태 업데이트 API (3단계: 활성화)
 * @param productId - 상품 ID
 * @param status - 상품 상태
 * @returns Promise<ProductRegistrationResponse>
 */
export const updateProductStatus = async (
  productId: number,
  status: 'ACTIVE' | 'DRAFT'
): Promise<ProductRegistrationResponse> => {
  try {
    const response = await axiosInstance.put<ProductRegistrationResponse>(
      `/api/admin/products/${productId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    // console.error('상품 상태 업데이트 실패:', error);
    throw error;
  }
};

/**
 * 상품 초안 저장 API
 * @param productData - 상품 등록 데이터 (draft: true)
 * @returns Promise<ProductRegistrationResponse>
 */
export const saveProductDraft = async (
  productData: ProductRegistrationRequest
): Promise<ProductRegistrationResponse> => {
  try {
    const draftData = { ...productData, draft: true };
    const response = await axiosInstance.post<ProductRegistrationResponse>(
      '/api/products/draft',
      draftData
    );
    return response.data;
  } catch (error) {
    // console.error('상품 초안 저장 실패:', error);
    throw error;
  }
};

/**
 * 상품 이미지 업로드 API
 * @param productId - 상품 ID
 * @param files - 업로드할 이미지 파일들
 * @returns Promise<{imageUrl: string, originalFileName: string, fileSize: number, mimeType: string}[]>
 */
export const uploadProductImages = async (productId: number, files: File[]): Promise<{
  imageUrl: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
}[]> => {
  try {
    // console.log('이미지 업로드 시작 - productId:', productId);
    // console.log('업로드할 파일들:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    // 파일 검증
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        throw new Error(`파일 크기가 너무 큽니다: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`지원하지 않는 파일 형식입니다: ${file.name} (${file.type})`);
      }
    }
    
    if (files.length > 10) {
      throw new Error('최대 10개의 파일만 업로드할 수 있습니다.');
    }
    
    // API 문서에 따르면 files는 query parameter로 전송해야 함
    // 하지만 파일 업로드는 일반적으로 FormData body로 전송
    // 두 가지 방법을 모두 시도해보겠습니다
    
    // 방법 1: FormData body로 전송 (일반적인 파일 업로드 방식)
    const formData = new FormData();
    
    // 여러 파일을 files 파라미터로 추가
    files.forEach((file, index) => {
      // console.log(`파일 ${index + 1} 추가:`, {
      //   name: file.name,
      //   size: file.size,
      //   type: file.type,
      //   lastModified: file.lastModified
      // });
      formData.append('files', file);
    });

    // console.log('FormData 내용 확인:');
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    const url = `/api/admin/products/${productId}/images`;
    // console.log('요청 URL:', url);

    try {
      // 방법 1: FormData body로 전송 (일반적인 파일 업로드 방식)
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log('이미지 업로드 응답 (FormData 방식):', response.data);
      return response.data;
    } catch (error) {
      // console.log('FormData 방식 실패, query parameter 방식으로 재시도...');
      
      // 방법 2: Query parameter 방식으로 재시도
      const queryUrl = `${url}?${files.map((_, index) => `files=${index}`).join('&')}`;
      // console.log('Query parameter URL:', queryUrl);
      
      const queryResponse = await axiosInstance.post(queryUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log('이미지 업로드 응답 (Query parameter 방식):', queryResponse.data);
      return queryResponse.data;
    }
  } catch (error) {
    // console.error('상품 이미지 업로드 실패:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number; headers?: unknown } };
      // console.error('에러 응답 데이터:', axiosError.response?.data);
      // console.error('에러 상태 코드:', axiosError.response?.status);
      // console.error('에러 헤더:', axiosError.response?.headers);
    }
    throw error;
  }
};

/**
 * 상품 목록 조회 API
 * @param page - 페이지 번호 (1부터 시작)
 * @param size - 페이지 크기
 * @param statusDescription - 상태 설명 필터 (예: "경매대기")
 * @returns Promise<ProductListResponse>
 */
export const getProductList = async (
  page: number = 1,
  size: number = 10,
  statusDescription?: string
): Promise<ProductListResponse> => {
  try {
    const params = new URLSearchParams({
      page: (page - 1).toString(), // API는 0-based pagination 사용
      size: size.toString(),
    });

    if (statusDescription) {
      params.append('statusDescription', statusDescription);
    }

    // console.log('상품 목록 조회 요청:', `/api/admin/products?${params.toString()}`);
    
    const response = await axiosInstance.get<ProductListResponse>(
      `/api/admin/products?${params.toString()}`
    );
    
    // console.log('상품 목록 조회 응답:', response.data);
    return response.data;
  } catch (error) {
    // console.error('상품 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 상품 상세 조회 API
 * @param productId - 상품 ID
 * @returns Promise<ProductRegistrationResponse>
 */
export const getProductDetail = async (productId: number): Promise<ProductRegistrationResponse> => {
  try {
    const response = await axiosInstance.get<ProductRegistrationResponse>(
      `/api/admin/products/${productId}`
    );
    return response.data;
  } catch (error) {
    // console.error('상품 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 상품 수정 API
 * @param productId - 상품 ID
 * @param productData - 상품 수정 데이터
 * @returns Promise<ProductRegistrationResponse>
 */
export const updateProduct = async (
  productId: number,
  productData: ProductRegistrationRequest
): Promise<ProductRegistrationResponse> => {
  try {
    const response = await axiosInstance.put<ProductRegistrationResponse>(
      `/api/admin/products/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    // console.error('상품 수정 실패:', error);
    throw error;
  }
};

/**
 * 경매 종료 API
 * @param auctionId - 경매 ID
 * @returns Promise<void>
 */
export const endAuction = async (auctionId: number): Promise<void> => {
  try {
    const response = await axiosInstance.post(`/api/admin/auctions/${auctionId}/cancel-now`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '경매 종료에 실패했습니다.');
    }
  } catch (error) {
    console.error('경매 종료 실패:', error);
    throw error;
  }
};

// 대시보드 관련 타입 정의
export interface DashboardStats {
  inProgress: number;
  pending: number;
  completed: number;
}

export interface DashboardItem {
  auctionId: number;
  productName: string;
  currentBid: number;
  productImageUrl: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
}

export interface DashboardItemsResponse {
  success: boolean;
  data: DashboardItem[];
  message: string;
}

// 대시보드 통계 조회
export const getDashboardStats = async (): Promise<DashboardResponse> => {
  try {
    const response = await axiosInstance.get<DashboardResponse>('/api/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error);
    throw error;
  }
};

// 대시보드 히스토리 아이템 조회
export const getDashboardItems = async (): Promise<DashboardItemsResponse> => {
  try {
    const response = await axiosInstance.get<DashboardItemsResponse>('/api/admin/dashboard/items');
    return response.data;
  } catch (error) {
    console.error('대시보드 히스토리 조회 실패:', error);
    throw error;
  }
};
