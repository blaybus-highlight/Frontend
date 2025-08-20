// 상품 이미지 타입
export interface ProductImage {
  id: number;
  imageUrl: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  sortOrder: number;
  primary: boolean;
  deleted: boolean;
}

// 상품 등록 요청 타입
export interface ProductRegistrationRequest {
  productName: string;
  shortDescription: string;
  history: string;
  expectedEffects: string;
  detailedInfo: string;
  category: 'PROPS' | 'FURNITURE' | 'HOME_APPLIANCES' | 'SCULPTURE' | 'FASHION' | 'CERAMICS' | 'PAINTING';
  productCount: number;
  material: string;
  size: string;
  brand: string;
  manufactureYear: number;
  condition: string;
  rank: 'BEST' | 'GREAT' | 'GOOD';
  isPremium: boolean;
  images: ProductImage[];
  draft: boolean;
}

// 상품 등록 응답 타입
export interface ProductRegistrationResponse {
  success: boolean;
  message: string;
  productId?: number;
  data?: {
    id: number;
    [key: string]: any;
  };
  id?: number;
  product?: {
    id: number;
    [key: string]: any;
  };
}

// 상품 목록 아이템 타입
export interface ProductListItem {
  id: number;
  productName: string;
  shortDescription: string;
  history: string;
  size: string;
  productCount: number;
  material: string;
  manufactureYear: number;
  brand: string;
  expectedEffects: string;
  detailedInfo: string;
  status: string;
  statusDescription: string;
  category: string;
  registeredBy: number;
  images: {
    id: number;
    imageUrl: string;
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    sortOrder: number;
    createdAt: string;
    primary: boolean;
  }[];
  primaryImageUrl: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// 상품 목록 응답 타입
export interface ProductListResponse {
  success: boolean;
  message: string;
  data: {
    content: ProductListItem[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    last: boolean;
    empty: boolean;
  };
}
