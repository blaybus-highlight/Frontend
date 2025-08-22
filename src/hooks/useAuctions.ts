import { useState, useEffect } from 'react';
import { getAuctionList, AuctionItem, AuctionListResponse } from '@/api/auction';

interface UseAuctionsOptions {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
}

export const useAuctions = (options: UseAuctionsOptions = {}) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(options.page || 1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuctionListResponse = await getAuctionList(
        currentPage,
        options.limit || 50,
        options.status,
        options.searchTerm
      );
      
      setAuctions(response.auctions);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '경매 목록을 불러오는데 실패했습니다.');
      console.error('경매 목록 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [currentPage, options.status, options.searchTerm]);

  const refetch = () => {
    fetchAuctions();
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    auctions,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    refetch,
    goToPage,
  };
};
