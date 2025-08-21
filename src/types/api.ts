export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://ec2-52-78-128-131.ap-northeast-2.compute.amazonaws.com:8085';

export interface Product {
  id: number;
  thumbnailUrl: string;
  productName: string;
  currentPrice: number;
  buyNowPrice: number;
  minimumBid: number;
  currentHighestBid?: number;
  bidCount: number;
  endTime: string;
  auctionStatus: string;
  category?: string;
  brand?: string;
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export type ProductsResponse = ApiResponse<PageResponse<Product>>;

export interface AuctionImage {
  id: number;
  imageUrl: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  sortOrder: number;
  createdAt: string;
  primary: boolean;
}

export interface AuctionDetail {
  auctionId: number;
  productName: string;
  shortDescription: string;
  history: string;
  expectedEffects: string;
  detailedInfo: string;
  images: AuctionImage[];
  status: string;
  statusDescription: string;
  rank: string;
  category: string;
  material: string;
  size: string;
  manufactureYear: number;
  isPremium: boolean;
  sellerId: number;
  sellerName: string;
  sellerDescription: string;
  sellerProfileImageUrl: string;
  sellerPhoneNumber: string;
  sellerEmail: string;
  sellerAddress: string;
  sellerRating: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  currentHighestBid: number;
  buyItNowPrice: number;
  maxBid: number;
  minimumBid: number;
  totalBids: number;
  tags?: string[]; // 판매자가 등록한 태그들
}

export type AuctionDetailResponse = ApiResponse<AuctionDetail>;

export interface ProductSearchParams {
  category?:
    | 'PROPS'
    | 'FURNITURE'
    | 'HOME_APPLIANCES'
    | 'SCULPTURE'
    | 'FASHION'
    | 'CERAMICS'
    | 'PAINTING';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  eventName?: string;
  isPremium?: boolean;
  status?: 'IN_PROGRESS' | 'SCHEDULED' | 'ENDING_SOON';
  sortCode?: 'ending' | 'popular' | 'newest';
  page?: number;
  size?: number;
  sort?: string[];
}

export interface SellerDetail {
  id: number;
  sellerName: string;
  description: string;
  profileImageUrl: string;
  phoneNumber: string;
  email: string;
  address: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  status: string;
  businessNumber: string;
  createdAt: string;
  lastActiveAt: string;
}

export type SellerDetailResponse = ApiResponse<SellerDetail>;

export interface RecommendedProduct {
  id: number;
  productName: string;
  shortDescription: string;
  history: string;
  expectedEffects: string;
  detailedInfo: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  statusDescription: string;
  category: 'PROPS' | 'FURNITURE' | 'HOME_APPLIANCES' | 'SCULPTURE' | 'FASHION' | 'CERAMICS' | 'PAINTING';
  registeredBy: number;
  images: AuctionImage[];
  primaryImageUrl: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RecommendedProductsResponse = ApiResponse<PageResponse<RecommendedProduct>>;

export interface BidResponse {
  bidId: number;
  auctionId: number;
  productName: string;
  bidderNickname: string;
  bidAmount: number;
  status: 'WINNING' | 'OUTBID' | 'CANCELLED';
  statusDescription: string;
  isAutoBid: boolean;
  bidTime: string;
  isWinning: boolean;
  isMyBid: boolean;
}

export type BidHistoryResponse = ApiResponse<PageResponse<BidResponse>>;

export interface BidCreateRequest {
  auctionId: number;
  bidAmount: number;
  isAutoBid: boolean;
  maxAutoBidAmount?: number;
}

export interface BidCreateResponse {
  bidId: number;
  auctionId: number;
  productName: string;
  bidderNickname: string;
  bidAmount: number;
  status: 'WINNING' | 'OUTBID' | 'CANCELLED';
  statusDescription: string;
  isAutoBid: boolean;
  bidTime: string;
  isWinning: boolean;
  isMyBid: boolean;
}

// BuyItNowRequest는 src/api/payments.ts에서 정의됨

export interface BuyItNowResponse {
  auctionId: number;
  productId: number;
  productName: string;
  buyItNowPrice: number;
  buyerId: number;
  purchaseCompletedAt: string;
  auctionStatus: 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export type BidCreateApiResponse = ApiResponse<BidCreateResponse>;
export type BuyItNowApiResponse = ApiResponse<BuyItNowResponse>;

export interface AuctionResult {
  auctionId: number;
  productName: string;
  resultType: 'WON' | 'LOST' | 'CANCELLED' | 'NOT_PARTICIPATED' | 'NO_PARTICIPATION';
  myFinalBid?: number;
  winningBid: number;
  endTime: string;
  message: string;
  actionButtonText: string;
  actionUrl: string;
}

export type AuctionResultResponse = ApiResponse<AuctionResult>;

export interface AuctionStatus {
  auctionId: number;
  productId: number;
  productName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'ENDED' | 'CANCELLED';
  statusDescription: string;
  startingPrice: number;
  currentHighestBid: number;
  buyItNowPrice: number;
  totalBidders: number;
  totalBids: number;
  bidUnit: number;
  minimumBid: number;
  maxBid: number;
  shippingFee: number;
  isPickupAvailable: boolean;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  currentWinnerNickname?: string;
  lastUpdatedAt: string;
}

export type AuctionStatusResponse = ApiResponse<AuctionStatus>;

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  status: string;
  createdAt: string;
  wishlisted: boolean;
}

export type WishlistResponse = ApiResponse<WishlistItem>;

export interface SignUpRequest {
  userId: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  isOver14: boolean;
  agreedToTerms: boolean;
  marketingEnabled: boolean;
  eventSnsEnabled: boolean;
}

export interface SignUpResponse {
  userId: string;
  nickname: string;
  accessToken: string;
  refreshToken: string;
}

export interface BackOfficeSignUpRequest {
  adminId: string;
  password: string;
}

export interface BackOfficeSignUpResponse {
  data: string;
  message: string;
}



export type SignUpApiResponse = ApiResponse<SignUpResponse>;

export interface NotificationStatus {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  notificationType: string;
  notificationTypeDescription: string;
  lastNotifiedAt: string;
  createdAt: string;
  active: boolean;
}

export type NotificationStatusResponse = ApiResponse<NotificationStatus>;

export interface ViewTogetherProduct {
  id: number;
  productName: string;
  category: string;
  primaryImageUrl: string;
  startPrice: number;
  buyNowPrice: number;
  brand: string;
  auctionStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'ENDED';
  endTime: string;
  bidCount: number;
  associationScore: number;
}

export type ViewTogetherProductsResponse = ApiResponse<PageResponse<ViewTogetherProduct>>;
