export interface Product {
  id: number;
  thumbnailUrl: string;
  productName: string;
  currentPrice: number;
  buyNowPrice: number;
  bidCount: number;
  endTime: string;
  auctionStatus: string;
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
