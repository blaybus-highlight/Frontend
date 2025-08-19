import axiosInstance from "@/lib/axiosInstance";
import { API_BASE_URL } from "@/types/api";
import { ProductRegistrationRequest, ProductRegistrationResponse } from '@/types/auction';

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
  limit: number = 10,
  status?: string,
  searchTerm?: string
): Promise<AuctionListResponse> => {
  try {
    const params = new URLSearchParams({
      page: (page - 1).toString(), // API는 0-based pagination 사용
      size: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    if (searchTerm) {
      params.append('search', searchTerm);
    }

    const response = await axiosInstance.get(`${API_BASE_URL}/api/admin/auctions?${params.toString()}`);
    
    // 디버깅을 위해 응답 데이터 로깅
    console.log('API Response:', response.data);
    
    const responseData = response.data;
    
    // 응답 구조 확인 및 안전한 처리
    if (!responseData || !responseData.data || !responseData.data.content) {
      console.error('Invalid API response structure:', responseData);
      throw new Error('API 응답 구조가 올바르지 않습니다.');
    }
    
    const data = responseData.data;
    
    // 필요한 필드만 추출하여 변환
    const auctions: AuctionItem[] = data.content.map((item: any) => ({
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
    console.error('경매 목록 조회 실패:', error);
    throw error;
  }
};

export const getAuctionById = async (auctionId: string): Promise<AuctionItem> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/api/admin/auctions/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error('경매 상세 조회 실패:', error);
    throw error;
  }
};

export const createAuction = async (auctionData: Partial<AuctionItem>): Promise<AuctionItem> => {
  try {
    const response = await axiosInstance.post('/auctions', auctionData);
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
    console.error('경매 수정 실패:', error);
    throw error;
  }
};

export const deleteAuction = async (auctionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/auctions/${auctionId}`);
  } catch (error) {
    console.error('경매 삭제 실패:', error);
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
    const response = await axiosInstance.post<ProductRegistrationResponse>(
      '/api/admin/products',
      productData
    );
    return response.data;
  } catch (error) {
    console.error('상품 등록 실패:', error);
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
    console.error('상품 초안 저장 실패:', error);
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
    const formData = new FormData();
    
    // 여러 파일을 files 파라미터로 추가
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    const response = await axiosInstance.post(`/api/admin/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('상품 이미지 업로드 실패:', error);
    throw error;
  }
};
