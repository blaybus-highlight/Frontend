export interface Product {
  id: string;
  premium: boolean;
  imageUrl: string;
  popupTitle: string;
  name: string;
  status: '진행중' | '마감' | '예정' | '마감임박';
  openDate?: string;
  deadline?: string;
  tags: string[];
  bidCount: number;
  description: string;
  currentPrice: number;
  startPrice: number;
  buyNowPrice: number;
  condition: {
    status: string;
    details: string;
  };
  rewardPoints: string;
  bidHistory: {
    bidder: string;
    price: number;
    time: string;
  }[];
  productInfo: {
    name: string;
    size: string;
    condition: string;
    composition: string;
    material: string;
  };
  seller: {
    profileImageUrl: string;
    name: string;
    tagline: string;
    description: string;
  };
}