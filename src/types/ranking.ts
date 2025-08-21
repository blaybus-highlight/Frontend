export interface RankingUser {
  userId: number;
  nickname: string;
  auctionCount: number;
  ranking: number;
}

export interface RankingDashboardResponse {
  success: boolean;
  message: string;
  data: {
    rankings: RankingUser[];
    totalUsers: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface RankingParams {
  page?: number;
  size?: number;
}