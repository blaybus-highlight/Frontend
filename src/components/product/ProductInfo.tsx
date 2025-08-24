'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Clock from '@/assets/clock-icon.svg';
import Info from '@/assets/info-icon.svg';
import Leaf from '@/assets/leaf-icon.svg';
import Share from '@/assets/share-icon.svg';
import { Product } from '@/types/product';
import { AuctionDetail, AuctionResult } from '@/types/api';
import { useBidHistory } from '@/hooks/useBidHistory';
import { useSTOMPSocket } from '@/hooks/useSTOMPSocket';
import { useAuctionStatus } from '@/hooks/useAuctionStatus';
import { useWishlistStatus, useWishlistToggle } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { productsApi } from '@/api/products';
import { buyItNow, BuyItNowRequest, getPaymentPreview } from '@/api/payments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationCenter } from '@/context/NotificationContext';
import AuctionResultModal from './AuctionResultModal';
import BuyItNowModal from './BuyItNowModal';
import AuctionExpiredModal from './AuctionExpiredModal';
import LoginModal from '@/components/auth/LoginModal';

interface ProductInfoProps {
  product?: Product;
  auction?: AuctionDetail;
}

const ProductInfo = ({ product, auction }: ProductInfoProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('history');
  const [bidAmount, setBidAmount] = useState('');
  const [isAutoBid, setIsAutoBid] = useState(false);
  const [maxAutoBidAmount, setMaxAutoBidAmount] = useState('');
  const [liveNotification, setLiveNotification] = useState<string | null>(null);
  const [activeBidders, setActiveBidders] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [endingSoonTimeLeft, setEndingSoonTimeLeft] = useState<string>('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [auctionResult, setAuctionResult] = useState<AuctionResult | null>(null);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bidError, setBidError] = useState<string>('');

  // 찜 상태 조회
  const { data: wishlistData, isLoading: isWishlistLoading } = useWishlistStatus(
    auction?.auctionId || 0
  );
  const wishlistToggle = useWishlistToggle();

  // 인증 상태 확인
  const { isAuthenticated } = useAuth();
  
  // 알림 센터 접근
  const { addNotification } = useNotificationCenter();

  // Use auction data if available, otherwise fall back to product data
  // const productDetails = auction || product;

  // React Query client for cache invalidation
  const queryClient = useQueryClient();

  // 판매자 정보는 auction 데이터에 이미 포함되어 있음
  
  // 입찰 내역 조회
  const { data: bidHistoryData, isLoading: isBidHistoryLoading, error: bidHistoryError, isError: isBidHistoryError, status: bidHistoryStatus } = useBidHistory(auction?.auctionId || 0);
  
  // Debug: 입찰 내역 데이터 확인 (한 번만 로그)
  useEffect(() => {
    if (!isBidHistoryLoading) {
      console.log('📊 입찰 내역 데이터 로딩 완료:', {
        bidHistoryData,
        auctionId: auction?.auctionId,
        content: bidHistoryData?.data?.content,
        contentLength: bidHistoryData?.data?.content?.length,
        success: bidHistoryData?.success,
        queryStatus: bidHistoryStatus,
        isError: isBidHistoryError,
        queryError: bidHistoryError
      });
      
      // 입찰 내역이 있는데 표시되지 않는 경우 상세 디버깅
      if (bidHistoryData?.data?.content && bidHistoryData.data.content.length > 0) {
        console.log('🔍 입찰 내역 상세:', bidHistoryData.data.content.map(bid => ({
          bidId: bid.bidId,
          bidAmount: bid.bidAmount,
          bidderNickname: bid.bidderNickname,
          bidTime: bid.bidTime,
          isMyBid: bid.isMyBid,
          isWinning: bid.isWinning,
          isAutoBid: bid.isAutoBid
        })));
      } else {
        console.log('⚠️ 입찰 내역이 비어있음 또는 로딩되지 않음');
        
      }
    }
  }, [bidHistoryData, isBidHistoryLoading, auction?.auctionId]);

  // 실시간 경매 상태 조회
  const { data: auctionStatusData } = useAuctionStatus(auction?.auctionId || 0);
  const liveStatus = auctionStatusData?.data;

  // 경매 결과 조회 (페이지 진입 시 한 번만)
  useEffect(() => {
    const checkAuctionResult = async () => {
      if (!auction?.auctionId) return;
      
      try {
        // brand 정보와 함께 경매 결과 조회
        const requestData = {
          auctionId: auction.auctionId,
          brand: auction.brand || product?.brand || ''
        };
        console.log('경매 결과 조회 요청 (브랜드 포함):', requestData);
        
        const result = await productsApi.getMyAuctionResult(auction.auctionId);
        if (result.data) {
          setAuctionResult(result.data);
          setShowResultModal(true);
        }
      } catch (error) {
        // 결과가 없거나 접근 권한이 없는 경우 무시
        console.log('경매 결과 없음:', error);
      }
    };

    checkAuctionResult();
  }, [auction?.auctionId]);

  // STOMP WebSocket 연결
  const { isConnected: isWebSocketConnected, subscribe, unsubscribe } = useSTOMPSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'http://ec2-52-78-128-131.ap-northeast-2.compute.amazonaws.com:8085/ws',
    onMessage: (message) => {
      if (message.data?.auctionId !== auction?.auctionId) return;

      switch (message.type) {
        case 'NEW_BID':
          console.log('🔔 새로운 입찰:', message.data);
          // 모든 관련 데이터 새로고침 - 거래내역과 그래프 즉시 업데이트
          queryClient.invalidateQueries({ queryKey: ['bidHistory', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auction', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auctionStatus', auction?.auctionId] });
          
          // 즉시 refetch 실행
          queryClient.refetchQueries({ queryKey: ['bidHistory', auction?.auctionId] });
          
          setLiveNotification(`🔔 새로운 입찰: ${formatPrice(message.data.bidAmount || 0)}원`);
          setTimeout(() => setLiveNotification(null), 5000);
          break;

        case 'BID_OUTBID':
          console.log('🔥 입찰 경합:', message.data);
          // 거래내역과 그래프 즉시 업데이트
          queryClient.invalidateQueries({ queryKey: ['bidHistory', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auction', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auctionStatus', auction?.auctionId] });
          
          // 즉시 refetch 실행
          queryClient.refetchQueries({ queryKey: ['bidHistory', auction?.auctionId] });
          
          setLiveNotification(`🔥 입찰 경합: ${formatPrice(message.data.bidAmount || 0)}원으로 갱신!`);
          setTimeout(() => setLiveNotification(null), 5000);
          break;

        case 'AUCTION_ENDING_SOON':
          console.log('⏰ 경매 마감 임박:', message.data);
          const timeString = message.data.timeLeft || '곧';
          setLiveNotification(`⏰ 마감까지 ${timeString} 남았습니다!`);
          setTimeout(() => setLiveNotification(null), 10000);
          break;

        case 'AUCTION_ENDED':
          console.log('🏁 경매 종료:', message.data);
          setLiveNotification('🏁 경매가 종료되었습니다');
          setTimeout(() => setLiveNotification(null), 8000);
          // 경매 종료 시 모든 관련 데이터 새로고침
          queryClient.invalidateQueries({ queryKey: ['bidHistory', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auction', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auctionStatus', auction?.auctionId] });
          // 메인페이지에서 종료된 경매 제거
          queryClient.invalidateQueries({ queryKey: ['products'] });
          break;

        case 'AUCTION_STARTED':
          console.log('🚀 경매 시작:', message.data);
          setLiveNotification('🚀 경매가 시작되었습니다!');
          setTimeout(() => setLiveNotification(null), 5000);
          // 경매 시작 시 모든 관련 데이터 새로고침
          queryClient.invalidateQueries({ queryKey: ['auction', auction?.auctionId] });
          queryClient.invalidateQueries({ queryKey: ['auctionStatus', auction?.auctionId] });
          // 메인페이지 섹션 이동 반영 (경매 예정 → 오늘의 경매)
          queryClient.invalidateQueries({ queryKey: ['products'] });
          break;

        case 'CONNECTION_LOST':
          console.log('📡 연결 끊김:', message.data);
          setLiveNotification('📡 연결이 끊어졌어요');
          setTimeout(() => setLiveNotification(null), 8000);
          break;

        case 'BIDDER_COUNT':
          console.log('👥 실시간 입찰자 수:', message.data.count);
          setActiveBidders(message.data.count);
          break;

        case 'AUCTION_STATUS_UPDATE':
          // 상태 업데이트는 자주 오므로 로그 생략
          // 실시간 상태 업데이트를 위해 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ['auctionStatus', auction?.auctionId] });
          // 경매 상태가 변경되면 메인페이지 상품 목록도 업데이트
          // 모든 섹션의 상품 목록을 새로고침 (SCHEDULED → IN_PROGRESS 이동 반영)
          queryClient.invalidateQueries({ queryKey: ['products'] });
          break;

        default:
          console.log('📨 기타 메시지:', message);
      }
    },
    onConnect: () => {
      console.log('🔌 STOMP 연결 성공, 경매 채널 구독 시작');
      // 특정 경매 채널 구독
      if (auction?.auctionId) {
        setTimeout(() => {
          subscribe(`/topic/auction/${auction.auctionId}`, (message) => {
            // 메시지 처리는 onMessage에서 함
          });
        }, 500); // 연결 안정화 후 구독
      }
    },
  });

  // 입찰하기 mutation
  const bidMutation = useMutation({
    mutationFn: (request: any) => {
      console.log('🚀 입찰 API 호출 시작:', request);
      // brand 정보 추가
      const requestWithBrand = {
        ...request,
        brand: auction?.brand || product?.brand || ''
      };
      console.log('브랜드 정보가 추가된 요청:', requestWithBrand);
      return productsApi.createBid(requestWithBrand);
    },
    onSuccess: (data) => {
      console.log('✅ 입찰 성공:', data);
      const bidResult = data.data;
      if (bidResult?.isAutoBid) {
        alert(`자동입찰이 설정되었습니다! (${formatPrice(bidResult.bidAmount)}원)`);
      } else {
        alert(`입찰 완료! ${bidResult?.statusDescription || '입찰이 등록되었습니다.'}`);
      }
      setBidAmount('');
      setMaxAutoBidAmount('');
      setIsAutoBid(false);
      // 모든 관련 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['bidHistory', auction?.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auction', auction?.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctionStatus', auction?.auctionId] });
      
      // 즉시 refetch 실행하여 최신 데이터 확보
      queryClient.refetchQueries({ queryKey: ['bidHistory', auction?.auctionId] });
      queryClient.refetchQueries({ queryKey: ['auction', auction?.auctionId] });
      
      // 메인페이지 상품 목록도 새로고침 (입찰가 업데이트 반영)
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('❌ 입찰 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '입찰 중 오류가 발생했습니다';
      alert(`입찰 실패: ${errorMessage}`);
    },
    onSettled: () => {
      console.log('🏁 입찰 mutation 완료 (성공/실패 관계없이)');
      // 성공/실패 관계없이 로딩 상태를 확실히 해제
      queryClient.invalidateQueries({ queryKey: ['bidMutation'] });
    },
  });

  // 즉시구매 mutation (현재 사용하지 않음 - 새로운 흐름으로 대체됨)
  // const buyNowMutation = useMutation({ ... });

  // 입찰하기 핸들러
  const handleBid = () => {
    console.log('🎯 입찰하기 핸들러 호출:', { auctionId: auction?.auctionId, bidAmount, isAutoBid });
    
    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!auction?.auctionId) {
      alert('경매 정보를 찾을 수 없습니다.');
      return;
    }

    // 경매 상태 확인
    const currentStatus = liveStatus?.status || auction?.status;
    if (currentStatus === 'ENDED' || currentStatus === 'CANCELLED' || timeLeft === '경매 종료') {
      setShowExpiredModal(true);
      return;
    }

    const amount = parseInt(bidAmount.replace(/,/g, ''));
    if (!amount || amount <= 0) {
      alert('올바른 입찰가를 입력해주세요.');
      return;
    }

         const currentPrice = liveStatus?.currentHighestBid || auction.currentHighestBid || auction.startPrice || 0;
    if (amount <= currentPrice) {
      alert('현재가보다 높은 금액을 입찰해주세요.');
      return;
    }

    // 입찰 단위 검증
    const bidUnit = liveStatus?.bidUnit || 1000; // 기본 1000원 단위
    if (bidUnit > 0 && amount % bidUnit !== 0) {
      alert(`입찰 단위 ${formatPrice(bidUnit)}원의 배수로 입찰해주세요.`);
      return;
    }

    // 자동입찰인 경우 최대 금액 검증
    if (isAutoBid) {
      const maxAmount = parseInt(maxAutoBidAmount.replace(/,/g, ''));
      if (!maxAmount || maxAmount <= amount) {
        alert('자동입찰 최대 금액은 입찰가보다 높아야 합니다.');
        return;
      }

      console.log('🔄 자동입찰 mutation 상태 리셋 및 새 요청 시작');
      // 이전 mutation 상태 리셋 후 새 요청
      bidMutation.reset();
      setTimeout(() => {
        console.log('⏰ 자동입찰 setTimeout 실행 - mutation 호출');
        bidMutation.mutate({
          auctionId: auction.auctionId,
          bidAmount: amount,
          isAutoBid: true,
          maxAutoBidAmount: maxAmount,
        });
      }, 100);
    } else {
      console.log('🔄 일반입찰 mutation 상태 리셋 및 새 요청 시작');
      // 이전 mutation 상태 리셋 후 새 요청
      bidMutation.reset();
      setTimeout(() => {
        console.log('⏰ 일반입찰 setTimeout 실행 - mutation 호출');
        bidMutation.mutate({
          auctionId: auction.auctionId,
          bidAmount: amount,
          isAutoBid: false,
        });
      }, 100);
    }
  };

  // 즉시구매 핸들러
  const handleBuyNow = () => {
    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!auction?.auctionId) {
      alert('경매 정보를 찾을 수 없습니다.');
      return;
    }

    // 경매 상태 확인
    const currentStatus = liveStatus?.status || auction?.status;
    if (currentStatus === 'ENDED' || currentStatus === 'CANCELLED' || timeLeft === '경매 종료') {
      setShowExpiredModal(true);
      return;
    }
    
    // 확인 다이얼로그 표시
    if (confirm('정말 즉시 구매하시겠어요?')) {
      // 즉시 구매 API 호출 - 올바른 형식으로 요청
      const request = {
        auctionId: auction.auctionId,
        usePointAmount: 10000, // 기본값으로 10000 포인트 사용
        brand: auction.brand || product?.brand || '' // 브랜드 정보 추가
      };
      
      console.log('즉시 구매 요청 (브랜드 포함):', request);
      
      buyItNow(request)
        .then((response) => {
          console.log('즉시 구매 성공:', response);
          if (response.success) {
            // 성공 시 데이터와 함께 successbid 페이지로 이동
            router.push(`/successbid?data=${encodeURIComponent(JSON.stringify(response.data))}`);
          } else {
            alert(`즉시 구매 실패: ${response.message}`);
          }
        })
        .catch((error) => {
          console.error('즉시 구매 API 호출 실패:', error);
          alert('즉시 구매 중 오류가 발생했습니다.');
        });
    }
  };

  // 즉시구매 확정 핸들러 (모달용 - 현재 사용하지 않음)
  const handleBuyNowConfirm = (request: any) => {
    console.log('🛒 즉시구매 확정 핸들러 호출:', { auctionId: auction?.auctionId, request });
    // 새로운 흐름으로 대체되어 현재 사용하지 않음
  };

  // 입찰가 포맷팅
  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    if (!value) {
      setBidAmount('');
      setBidError('');
      return;
    }
    
    const numericValue = parseInt(value);
    const startPrice = auction?.startPrice || 0;
    const buyItNowPrice = auction?.buyItNowPrice || 0;
  
    
    if (buyItNowPrice > 0 && numericValue >= buyItNowPrice) {
      setBidError(`입찰가는 즉시구매가(${formatPrice(buyItNowPrice)}원) 미만이어야 합니다.`);
      return;
    }
    
    setBidError('');
    const formatted = numericValue.toLocaleString('ko-KR');
    setBidAmount(formatted);
  };

  // 자동입찰 최대 금액 포맷팅
  const handleMaxAutoBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formatted = value ? parseInt(value).toLocaleString('ko-KR') : '';
    setMaxAutoBidAmount(formatted);
  };

  // 경매 마감 카운트다운
  useEffect(() => {
    if (!auction?.scheduledEndTime) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.scheduledEndTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}일 ${hours}시간 ${minutes}분`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`);
        } else {
          setTimeLeft(`${minutes}분 ${seconds}초`);
        }

        // 마감 임박 상태 체크 (10분 이내)
        const isEndingSoon = difference <= 10 * 60 * 1000;
        setIsEndingSoon(isEndingSoon);
        
        if (isEndingSoon) {
          const endingMinutes = Math.floor(difference / (1000 * 60));
          const endingSeconds = Math.floor((difference % (1000 * 60)) / 1000);
          setEndingSoonTimeLeft(`${endingMinutes}:${endingSeconds.toString().padStart(2, '0')}`);
        } else {
          setEndingSoonTimeLeft('');
        }
      } else {
        setTimeLeft('경매 종료');
        setIsEndingSoon(false);
        setEndingSoonTimeLeft('');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [auction?.scheduledEndTime]);

  // 모달 액션 핸들러들
  const handlePayment = async () => {
    // 낙찰 성공 시 결제 미리보기 API 호출 후 결제 페이지로 이동
    if (auctionResult?.resultType === 'WON' && auction?.auctionId) {
      try {
        console.log('결제 미리보기 API 호출 시작:', auction.auctionId);
        const previewResponse = await getPaymentPreview(auction.auctionId);
        
        if (previewResponse.success) {
          console.log('결제 미리보기 성공:', previewResponse.data);
          // preview 데이터를 URL 파라미터로 인코딩하여 결제 페이지로 이동
          const previewData = encodeURIComponent(JSON.stringify(previewResponse.data));
          router.push(`/pay?preview=${previewData}`);
        } else {
          console.error('결제 미리보기 실패:', previewResponse.message);
          alert(`결제 미리보기 실패: ${previewResponse.message}`);
        }
      } catch (error) {
        console.error('결제 미리보기 API 호출 실패:', error);
        alert('결제 미리보기를 불러오는 중 오류가 발생했습니다.');
      }
    } else if (auctionResult?.actionUrl) {
      alert(`${auctionResult.actionUrl}로 이동합니다.`);
      // TODO: window.location.href = auctionResult.actionUrl;
    }
    setShowResultModal(false);
  };

  const handleOtherAuctions = () => {
    if (auctionResult?.actionUrl) {
      alert(`${auctionResult.actionUrl}로 이동합니다.`);
      // TODO: window.location.href = auctionResult.actionUrl;
    }
    setShowResultModal(false);
  };

  const handleMyBids = () => {
    if (auctionResult?.actionUrl) {
      alert(`${auctionResult.actionUrl}로 이동합니다.`);
      // TODO: window.location.href = auctionResult.actionUrl;
    }
    setShowResultModal(false);
  };

  // 찜 토글 핸들러
  const handleWishlistToggle = () => {
    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!auction?.auctionId) {
      alert('상품 정보를 찾을 수 없습니다.');
      return;
    }

    wishlistToggle.mutate(auction.auctionId, {
      onSuccess: (data) => {
        const isWishlisted = data.data?.wishlisted;
        const message = isWishlisted ? '찜 목록에 추가되었습니다!' : '찜 목록에서 제거되었습니다.';
        
        // 토스트 알림 표시
        if ((window as any).showNotificationToast) {
          (window as any).showNotificationToast({
            type: isWishlisted ? 'success' : 'info',
            message: message,
            productName: auction?.productName,
            duration: 3000
          });
        }
        
        // 알림 히스토리에 추가
        addNotification({
          type: isWishlisted ? 'WISHLIST_ADDED' : 'WISHLIST_REMOVED',
          title: isWishlisted ? '찜 추가 완료' : '찜 제거 완료',
          message: message,
          isRead: false,
          actionUrl: `/auction/${auction.auctionId}`,
          productName: auction?.productName,
          productImage: auction?.images[0]?.imageUrl
        });
        
        // 찜 상태 캐시 무효화 (메인과 상세페이지 동기화)
        queryClient.invalidateQueries({ queryKey: ['wishlist', auction.auctionId] });
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          alert('로그인 후 이용해주세요.');
        } else {
          alert('찜하기 처리 중 오류가 발생했습니다.');
        }
      }
    });
  };

  // Debug: 가격 정보 확인 (초기 로딩 시 한 번만)
  useEffect(() => {
    if (auction) {
      console.log('가격 정보 초기화:', {
        currentHighestBid: auction.currentHighestBid,
        minimumBid: auction.minimumBid,
        buyItNowPrice: auction.buyItNowPrice
      });
    }
  }, [auction?.auctionId]); // auctionId가 변경될 때만

  // 입찰 mutation 상태 모니터링
  useEffect(() => {
    console.log('💵 bidMutation 상태 변경:', {
      isPending: bidMutation.isPending,
      isError: bidMutation.isError,
      isSuccess: bidMutation.isSuccess,
      error: bidMutation.error
    });

    // 30초 후에도 pending 상태라면 강제 리셋
    if (bidMutation.isPending) {
      const timeoutId = setTimeout(() => {
        console.log('⚠️ bidMutation 30초 타임아웃 - 강제 리셋');
        bidMutation.reset();
        alert('입찰 요청 시간이 초과되었습니다. 다시 시도해주세요.');
      }, 30000);

      return () => clearTimeout(timeoutId);
    }
  }, [bidMutation.isPending, bidMutation.isError, bidMutation.isSuccess]);

  // 즉시구매 mutation 상태 모니터링 (현재 사용하지 않음)
  // useEffect(() => { ... }, []);

  // 경매 상태 표시 텍스트 및 스타일
  const getAuctionStatusDisplay = () => {
    const status = liveStatus?.status || auction?.status;
    const statusDescription = liveStatus?.statusDescription || auction?.statusDescription;
    
    switch (status) {
      case 'SCHEDULED':
        return { text: '경매 예정', color: 'bg-blue-100 text-blue-800' };
      case 'IN_PROGRESS':
        return { text: '진행중', color: 'bg-green-100 text-green-800' };
      case 'ENDING_SOON':
        return { text: '마감 임박', color: 'bg-red-100 text-red-800' };
      case 'ENDED':
        return { text: '마감', color: 'bg-gray-100 text-gray-800' };
      case 'CANCELLED':
        return { text: '취소됨', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: statusDescription || '진행중', color: 'bg-green-100 text-green-800' };
    }
  };

  const auctionStatusDisplay = getAuctionStatusDisplay();

  // 카테고리 한국어 변환 (백엔드에서 이미 한국어로 올 수도 있음)
  const getCategoryDisplay = (category?: string) => {
    if (!category) return '카테고리';
    
    // 이미 한국어면 그대로 반환
    if (['소품', '가구', '가전', '조형', '패션', '도예', '회화'].includes(category)) {
      return category;
    }
    
    // 영어 코드면 한국어로 변환
    const categoryMap: { [key: string]: string } = {
      'PROPS': '소품',
      'FURNITURE': '가구',
      'HOME_APPLIANCES': '가전',
      'SCULPTURE': '조형',
      'FASHION': '패션',
      'CERAMICS': '도예',
      'PAINTING': '회화'
    };
    
    return categoryMap[category] || category;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className='relative grid grid-cols-1 gap-6 sm:gap-[40px] md:grid-cols-2'>
      {/* 실시간 알림 토스트 */}
      {liveNotification && (
        <div className='fixed top-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg animate-bounce'>
          <div className='flex items-center gap-2'>
            <span>{liveNotification}</span>
            <button 
              onClick={() => setLiveNotification(null)}
              className='ml-2 text-gray-300 hover:text-white'
            >
              ✕
            </button>
          </div>
        </div>
      )}
             {/* Left Column: Image Only */}
       <div className='relative w-full'>
         <Image
           alt={auction ? auction.productName : (product?.name || '')}
           className='h-auto w-full rounded-2xl object-cover'
           height={676}
           src={auction ? (auction.images[0]?.imageUrl || '/placeholder.jpg') : (product?.imageUrl || '/placeholder.jpg')}
           width={676}
         />
         
         {/* Premium 배지 */}
         {auction?.category === 'Premium' && (
           <div className='absolute top-0 flex h-[40px] w-[140px] items-center justify-center gap-[4px] rounded-tl-2xl bg-black text-[12px]/[14px] font-semibold text-white'>
             <Leaf />
             Premium
           </div>
         )}
         
         {/* 마감 임박 카운트다운 바 */}
         {isEndingSoon && endingSoonTimeLeft && (
           <div className='absolute top-0 left-0 right-0 text-white py-2 px-4 rounded-t-2xl z-10' style={{ backgroundColor: '#E6493B' }}>
             <div className='flex items-center justify-center gap-2'>
               <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
               <span className='text-sm font-bold'>
                 마감까지 남은 시간 {endingSoonTimeLeft}
               </span>
               <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
             </div>
           </div>
         )}
       </div>

      {/* Right Column: All Textual Information */}
      <div className='relative flex flex-col'>
        {/* Details & Bidding */}
        <div className='flex flex-col gap-[4px]'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-[4px]'>
              <p className='text-[14px] font-medium text-[#666]'>
                {auction ? getCategoryDisplay(auction.brand) : (product?.popupTitle || '')}
              </p>
              <h1 className='text-[20px]/[24px] sm:text-[24px]/[28px] font-bold text-[#333]'>
                {auction ? auction.productName : (product?.name || '')}
              </h1>
            </div>
            <div className='flex items-center justify-center gap-[20px]'>
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistToggle.isPending || isWishlistLoading}
                className={`flex items-center justify-center transition-all duration-200 ${
                  wishlistToggle.isPending || isWishlistLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-110 cursor-pointer'
                }`}
                title={wishlistData?.data?.wishlisted ? '찜 취소' : '찜하기'}
              >
                {wishlistData?.data?.wishlisted ? (
                  <span className='text-red-500 text-xl'>❤️</span>
                ) : (
                  <span className='text-gray-300 text-xl'>♡</span>
                )}
              </button>
              <Share height={20} width={20} />
            </div>
          </div>
          <div className='mt-[12px] flex flex-col gap-[12px]'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex flex-wrap gap-2'>
                <span
                  className={`rounded-[8px] p-[8px] text-[16px]/[16px] ${auctionStatusDisplay.color}`}
                >
                  {auctionStatusDisplay.text}
                </span>
                {/* 판매자가 등록한 태그들 표시 */}
                {auction?.tags && auction.tags.length > 0 && (
                  auction.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='rounded-[8px] bg-[#F5F5F5] p-[8px] text-[16px]/[16px] text-[#2C2C2C]'
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))
                )}
              </div>
              {/* 남은 시간 표시 */}
              <div className='flex items-center gap-2 min-h-[20px]'>
                <div className='flex items-center justify-center'>
                  <Clock height={20} width={20} />
                </div>
                <span className={`text-[14px] font-semibold ${
                  timeLeft === '경매 종료' 
                    ? 'text-red-600' 
                    : timeLeft.includes('분') && !timeLeft.includes('시간') && !timeLeft.includes('일')
                    ? 'text-orange-600'
                    : 'text-[#333]'
                }`}>
                  {timeLeft}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-[12px] text-[16px] text-[#616161]'>
              <div className='flex items-center justify-center'>
                <Clock height={20} width={20} />
              </div>
              <span>입찰 {liveStatus?.totalBids || auction?.totalBids || 0}회</span>
              {(liveStatus?.totalBidders || activeBidders) > 0 && (
                <div className='flex items-center gap-1 ml-4'>
                  <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                  <span className='text-red-600 font-medium'>
                    {liveStatus?.totalBidders || activeBidders}명 참여 중
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className='mt-[16px] text-[16px] text-[#666]'>
            {auction ? auction.shortDescription : (product?.description || '')}
          </p>

          <div className='rounded[12px] mt-[16px] flex flex-col gap-[13px] bg-[#F9F9F9] p-[20px]'>
            <div className='flex items-center justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>현재가</span>
              <div className='flex items-center gap-2'>
                                 <span className='text-[26px] font-bold text-[#333]'>
                   {formatPrice(liveStatus?.currentHighestBid || auction?.currentHighestBid || auction?.startPrice || product?.currentPrice || 0)}원
                 </span>
                {liveStatus?.currentWinnerNickname && (
                  <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                    {liveStatus.currentWinnerNickname}
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>시작가</span>
                             <span className='text-[16px]/[24px] font-semibold text-[#616161]'>
                 {formatPrice(liveStatus?.startingPrice || auction?.startPrice || product?.startPrice || 0)}원
               </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>
                즉시 구매가
              </span>
              <span className='text-[20px]/[24px] font-bold text-[#616161]'>
                {formatPrice(liveStatus?.buyItNowPrice || auction?.buyItNowPrice || product?.buyNowPrice || 0)}원
              </span>
            </div>

            <hr className='text-[#E9EAEB]' />

            <div className='relative flex items-start justify-between'>
              <div className='flex items-center gap-[6px]'>
                <span className='text-[16px]/[24px] text-[#666]'>
                  상품 상태
                </span>
                <div className='group'>
                  <Info height={20} width={20} />
                  <div className='absolute top-7 -left-1 hidden group-hover:block'>
                    <div className='relative rounded-[8px] bg-black px-[12px] py-[8px] text-[12px]/[18px] font-semibold text-white'>
                      NafaL의 엄격한 품질 가이드
                      <div className='absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-r-6 border-b-6 border-l-6 border-transparent border-b-black' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-[8px]'>
                <span className='text-[16px]/[24px] font-semibold'>
                  {auction?.rank || '우수'}
                </span>
                <span className='text-[14px]/[20px] text-[#616161]'>
                  {auction?.condition || 'conditon 값이 없음'}
                </span>
              </div>
            </div>
            <div className='flex items-start justify-between'>
              <span className='text-[16px]/[24px] text-[#666]'>적립</span>
              <div className='flex flex-col items-end gap-[11px]'>
                <span className='text-[16px]/[24px] font-semibold'>
                  {auction?.point ? `${auction.point} 나팔꽃` : "값이 없습니다"}
                </span>
                <span className='text-[14px]/[20px] text-[#616161]'>
                  폐기 대신 재사용하여 CO2 절감
                </span>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div>
              <div
                className={`mt-[36px] flex flex-col gap-[40px] block`}
              >
                                 <div className='flex flex-col gap-[8px] max-w-full'>
                   {/* 입찰가 입력 가능 범위 */}
                   <div className='flex justify-end'>
                     <span className='text-[14px] sm:text-[18px] font-semibold text-[#333]'>
                                               입찰가 입력 가능 범위: {formatPrice(auction?.startPrice || 0)}원 ~ {auction?.buyItNowPrice ? formatPrice(auction.buyItNowPrice - 1000) : '무제한'}원
                     </span>
                   </div>
                   
                   {/* 입찰가 입력 섹션 - 반응형 배치 */}
                   <div className='flex flex-col gap-3 w-full'>
                     {/* 입찰가 라벨과 입력 필드 */}
                     <div className='flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full'>
                       <span className='text-[16px] sm:text-[18px] font-semibold shrink-0 flex items-center h-[44px]'>입찰가</span>
                       <input
                         className='flex-1 min-w-0 border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                         placeholder='1,000원 단위로 입력해주세요.'
                         value={bidAmount}
                         onChange={handleBidAmountChange}
                       />
                       <button
                         className={`h-[44px] shrink-0 px-4 text-[14px] font-bold text-white w-full sm:w-auto ${
                           bidMutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                         }`}
                         type='button'
                         onClick={handleBid}
                         disabled={bidMutation.isPending}
                         key={`bid-button-${bidMutation.isPending ? 'loading' : 'ready'}`}
                       >
                         {bidMutation.isPending ? '입찰 중...' : isAutoBid ? '자동입찰' : '입찰하기'}
                       </button>
                     </div>
                     
                     {/* 빠른 입찰 버튼들 */}
                     <div className='flex flex-col sm:flex-row gap-2'>
                       <button
                         className='h-[44px] px-4 bg-black text-white text-[14px] font-bold hover:bg-gray-800 flex-1'
                         onClick={() => {
                           const currentInputAmount = bidAmount ? parseInt(bidAmount.replace(/,/g, '')) : 0;
                           const baseAmount = currentInputAmount > 0 ? currentInputAmount : (liveStatus?.currentHighestBid || auction?.currentHighestBid || auction?.startPrice || 0);
                           const newAmount = baseAmount + 5000;
                           setBidAmount(newAmount.toLocaleString('ko-KR'));
                         }}
                       >
                         +5,000원
                       </button>
                       
                       <span className='text-[16px] text-[#666] hidden sm:block self-center'>~</span>
                       
                       <button
                         className='h-[44px] px-4 bg-black text-white text-[14px] font-bold hover:bg-gray-800 flex-1'
                         onClick={() => {
                           const currentInputAmount = bidAmount ? parseInt(bidAmount.replace(/,/g, '')) : 0;
                           const baseAmount = currentInputAmount > 0 ? currentInputAmount : (liveStatus?.currentHighestBid || auction?.currentHighestBid || auction?.startPrice || 0);
                           const newAmount = baseAmount + 15000;
                           setBidAmount(newAmount.toLocaleString('ko-KR'));
                         }}
                       >
                         +15,000원
                       </button>
                     </div>
                   </div>
                   
                   {/* 오류 메시지 표시 */}
                   {bidError && (
                     <div className='mt-2 text-red-600 text-sm font-medium'>
                       {bidError}
                     </div>
                   )}
                 </div>

          
                                 <button 
                   className="h-[48px] w-full text-[14px] sm:text-[16px]/[22px] font-bold text-white bg-black hover:bg-gray-800"
                   onClick={handleBuyNow}
                 >
                   {`즉시 구매하기 (${formatPrice(auction?.buyItNowPrice || product?.buyNowPrice || 0)}원)`}
                 </button>
              </div>
            </div>

            {/* Bid History Section */}
            <div
              className={`mt-[20px] block`}
            >
              <div className='flex items-center justify-between mb-[16px]'>
                <h3 className='text-[20px] font-bold'>실시간 입찰가</h3>
                <div className='flex items-center gap-2'>
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      isWebSocketConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    isWebSocketConnected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isWebSocketConnected ? '실시간 연결됨' : '연결 끊김'}
                  </span>
                  {!isWebSocketConnected && (
                    <div className='text-xs text-gray-400 mt-1'>
                      WebSocket 서버 확인 필요
                    </div>
                  )}
                </div>
              </div>
              {/* Tab Buttons */}
              <div className='mb-[16px] flex rounded-[8px] bg-[#EEE] p-[4px]'>
                <button
                  className={`w-1/2 rounded-[8px] py-[8px] text-[14px]/[20px] font-semibold transition-colors ${activeTab === 'history' ? 'bg-white' : 'bg-transparent'}`}
                  onClick={() => setActiveTab('history')}
                >
                  거래 내역
                </button>
                <button
                  className={`w-1/2 rounded-[8px] py-[8px] text-[14px]/[20px] font-semibold transition-colors ${activeTab === 'graph' ? 'bg-white' : 'bg-transparent'}`}
                  onClick={() => setActiveTab('graph')}
                >
                  그래프
                </button>
              </div>
              {/* Conditional Content */}
              {activeTab === 'history' && (
                <div>
                  {isBidHistoryLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
                      <span className='ml-2 text-gray-500 text-sm'>입찰 내역 로딩 중...</span>
                    </div>
                  ) : (
                    <table className='min-w-full text-left text-[16px]/[24px]'>
                      <thead className='text-[#757575]'>
                        <tr>
                          <th className='w-[452px] px-3 py-1 font-normal'>
                            입찰가
                          </th>
                          <th className='px-3 py-1 text-center font-normal'>
                            거래자
                          </th>
                          <th className='px-3 py-1 text-center font-normal'>
                            시간
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bidHistoryData?.data?.content && bidHistoryData.data.content.length > 0 ? (
                          bidHistoryData.data.content.map((bid, index) => (
                            <tr
                              key={bid.bidId}
                              className={`${
                                bid.isMyBid 
                                  ? 'bg-blue-100 border-l-4 border-blue-500' // 내 입찰 강조
                                  : index % 2 === 0 ? 'bg-[#EEE]' : 'bg-white'
                              }`}
                            >
                              <td className='px-3 py-1'>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium'>
                                    {formatPrice(bid.bidAmount)}원
                                  </span>
                                  {bid.isWinning && (
                                    <span className='text-xs bg-green-500 text-white px-2 py-1 rounded-full'>
                                      최고가
                                    </span>
                                  )}
                                  {bid.isMyBid && (
                                    <span className='text-xs bg-blue-500 text-white px-2 py-1 rounded-full'>
                                      내 입찰
                                    </span>
                                  )}
                                  {bid.isAutoBid && (
                                    <span className='text-xs bg-gray-500 text-white px-2 py-1 rounded-full'>
                                      자동
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className='px-3 py-1 text-center'>
                                <span className={bid.isMyBid ? 'font-bold text-blue-600' : ''}>
                                  {bid.bidderNickname}
                                </span>
                              </td>
                              <td className='px-3 py-1 text-center text-[#757575]'>
                                {new Date(bid.bidTime).toLocaleString('ko-KR', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='bg-[#EEE]'>
                            <td className='px-3 py-1'>
                              {isBidHistoryLoading ? '입찰 내역 로딩 중...' : (() => {
                                const currentStatus = liveStatus?.status || auction?.status;
                                const isEnded = currentStatus === 'ENDED' || timeLeft === '경매 종료';
                                const isCancelled = currentStatus === 'CANCELLED';
                                
                                if (isCancelled) {
                                  return '취소된 경매입니다';
                                } else if (isEnded) {
                                  return '경매가 종료되었습니다';
                                } else if (!isAuthenticated) {
                                  return '로그인하시면 입찰 내역을 확인할 수 있습니다';
                                } else {
                                  return '아직 입찰 내역이 없습니다';
                                }
                              })()}
                              {!isBidHistoryLoading && bidHistoryData?.success === false && (
                                <div className='text-xs text-red-500 mt-1'>
                                  데이터 로드 실패. 새로고침 해보세요.
                                </div>
                              )}
                            </td>
                            <td className='px-3 py-1 text-center'>
                              -
                            </td>
                            <td className='px-3 py-1 text-center text-[#757575]'>
                              -
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              {activeTab === 'graph' && (
                <div className='rounded-lg border p-4'>
                  {isBidHistoryLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
                      <span className='ml-2 text-gray-500 text-sm'>그래프 로딩 중...</span>
                    </div>
                  ) : bidHistoryData?.data?.content && bidHistoryData.data.content.length > 0 ? (
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-gray-700'>입찰가 변화</h4>
                      <div className='relative h-48 bg-gray-50 rounded p-4'>
                        {/* 선 그래프 (라인 차트) */}
                        <svg className='w-full h-full' viewBox="0 0 400 160">
                          {/* 배경 그리드 및 그라데이션 */}
                          <defs>
                            <pattern id="grid" width="40" height="32" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 32" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                            </pattern>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style={{stopColor:'#10b981', stopOpacity:0.8}} />
                              <stop offset="50%" style={{stopColor:'#16a34a', stopOpacity:1}} />
                              <stop offset="100%" style={{stopColor:'#15803d', stopOpacity:0.9}} />
                            </linearGradient>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {(() => {
                            const bids = bidHistoryData.data.content.slice(-10);
                            const maxBid = Math.max(...bidHistoryData.data.content.map(b => b.bidAmount));
                            const minBid = auction?.startPrice || Math.min(...bidHistoryData.data.content.map(b => b.bidAmount));
                            const range = maxBid - minBid || 1;
                            
                            // 포인트들 계산
                            const points = bids.map((bid, index) => ({
                              x: (index / (bids.length - 1)) * 360 + 20, // 좌우 여백 20px
                              y: 140 - ((bid.bidAmount - minBid) / range) * 120, // 상하 여백 20px
                              bid
                            }));
                            
                            // 부드러운 곡선 경로 생성 (베지어 곡선)
                            const createSmoothPath = (points: Array<{x: number, y: number, bid: any}>) => {
                              if (points.length < 2) return '';
                              
                              let path = `M ${points[0].x} ${points[0].y}`;
                              
                              for (let i = 1; i < points.length; i++) {
                                const prev = points[i - 1];
                                const curr = points[i];
                                const next = points[i + 1];
                                
                                // 제어점 계산 (부드러운 곡선을 위해)
                                const cp1x = prev.x + (curr.x - (points[i - 2] || prev).x) * 0.2;
                                const cp1y = prev.y + (curr.y - (points[i - 2] || prev).y) * 0.2;
                                const cp2x = curr.x - (next || curr).x * 0.2 + curr.x * 0.2;
                                const cp2y = curr.y - (next || curr).y * 0.2 + curr.y * 0.2;
                                
                                if (i === 1) {
                                  // 첫 번째 곡선은 quadratic 사용
                                  path += ` Q ${cp1x} ${cp1y} ${curr.x} ${curr.y}`;
                                } else {
                                  // 나머지는 cubic bezier 사용
                                  path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
                                }
                              }
                              
                              return path;
                            };
                            
                            const pathData = createSmoothPath(points);
                            
                            // 최고가 Y 좌표 계산
                            const maxBidY = 140 - ((maxBid - minBid) / range) * 120;
                            
                            return (
                              <>
                                {/* 최고가 곡선 (점선) */}
                                <path
                                  d={`M 20 ${maxBidY} Q 100 ${maxBidY - 5} 200 ${maxBidY} Q 300 ${maxBidY + 3} 380 ${maxBidY}`}
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  fill="none"
                                  opacity="0.8"
                                />
                                
                                {/* 최고가 레이블 */}
                                <text
                                  x="25"
                                  y={Math.max(15, maxBidY - 8)}
                                  className="text-xs fill-red-500 font-semibold"
                                >
                                  최고가 {formatPrice(maxBid)}원
                                </text>
                                
                                {/* 선 그래프 (부드러운 곡선) */}
                                <path 
                                  d={pathData} 
                                  stroke="url(#lineGradient)" 
                                  strokeWidth="3" 
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="drop-shadow-sm"
                                />
                                
                                {/* 포인트들 */}
                                {points.map((point, index) => (
                                  <g key={point.bid.bidId}>
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="4"
                                      fill={point.bid.isMyBid ? '#2563eb' : point.bid.isWinning ? '#16a34a' : '#6b7280'}
                                      stroke="white"
                                      strokeWidth="2"
                                      className="drop-shadow cursor-pointer"
                                    />
                                    {/* 내 입찰 강조 */}
                                    {point.bid.isMyBid && (
                                      <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="6"
                                        fill="none"
                                        stroke="#2563eb"
                                        strokeWidth="2"
                                        opacity="0.5"
                                      />
                                    )}
                                  </g>
                                ))}
                                
                                {/* X축 레이블 (시간) */}
                                {points.map((point, index) => (
                                  <text
                                    key={`time-${point.bid.bidId}`}
                                    x={point.x}
                                    y="155"
                                    textAnchor="middle"
                                    className="text-xs fill-gray-500"
                                  >
                                    {new Date(point.bid.bidTime).toLocaleTimeString('ko-KR', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </text>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      <div className='text-xs text-gray-500 text-center'>
                        최근 {Math.min(bidHistoryData.data.content.length, 10)}개 입찰 내역
                      </div>
                    </div>
                  ) : (
                    <div className='text-center text-gray-500 py-8'>
                      {(() => {
                        const currentStatus = liveStatus?.status || auction?.status;
                        const isEnded = currentStatus === 'ENDED' || timeLeft === '경매 종료';
                        const isCancelled = currentStatus === 'CANCELLED';
                        
                        if (isCancelled) {
                          return (
                            <>
                              <p>취소된 경매입니다.</p>
                              <p className='text-sm mt-1'>그래프를 표시할 수 없습니다.</p>
                            </>
                          );
                        } else if (isEnded) {
                          return (
                            <>
                              <p>경매가 종료되었습니다.</p>
                              <p className='text-sm mt-1'>입찰 내역이 없어 그래프를 표시할 수 없습니다.</p>
                            </>
                          );
                        } else if (!isAuthenticated) {
                          return (
                            <>
                              <p>로그인하시면 입찰가 그래프를 확인할 수 있습니다.</p>
                              <p className='text-sm mt-1'>지금 로그인하고 경매에 참여해보세요!</p>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <p>아직 입찰 내역이 없어 그래프를 표시할 수 없습니다.</p>
                              <p className='text-sm mt-1'>첫 입찰을 해보세요!</p>
                            </>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product & Seller Info Section */}
        <div className='mt-[20px] flex flex-col gap-[16px] rounded-[8px] bg-[#F9F9F9] px-[15px] py-[14px]'>
          {/* Product Info */}
          <h3 className='text-[20px]/[24px] font-bold'>상품 정보</h3>
                     <div className='flex flex-col gap-[8px] text-[14px] text-[#666]'>
             <div className='flex gap-[4px]'>
               <p className='w-[60px]'>• 상품명</p>
               <p>{auction ? auction.productName : (product?.productInfo?.name || '')}</p>
             </div>
             <div className='flex gap-[4px]'>
               <p className='w-[60px]'>• 사이즈</p>
               <p>{auction?.size || '-'}</p>
             </div>
             <div className='flex gap-[4px]'>
               <p className='w-[60px]'>• 상태</p>
               <p>{auction?.condition || '우수'}</p>
             </div>
             <div className='flex gap-[4px]'>
               <p className='w-[60px]'>• 구성</p>
               <p>{auction?.productCount ? `${auction.productCount}개` : '본품'}</p>
             </div>
             <div className='flex gap-[4px]'>
               <p className='w-[60px]'>• 재질</p>
               <p>{auction?.material || '-'}</p>
             </div>
             <div className='flex gap-[8px]'>
               <p className='w-[60px]'>• 생산년도</p>
               <p>{ auction?.manufactureYear || '-'}</p>
             </div>
           </div>
        </div>

        {/* Shipping Info */}
        <div className='mt-[20px] flex flex-col gap-[16px] rounded-[8px] bg-[#F9F9F9] px-[15px] py-[14px]'>
          <h3 className='text-[20px]/[24px] font-bold'>배송 정보</h3>
          <div className='space-y-2'>
            <div className='flex gap-[4px] text-[14px]'>
              <p className='w-[60px] text-[#666]'>배송비</p>
              <p>{liveStatus?.shippingFee ? formatPrice(liveStatus.shippingFee) + '원' : '5,000원'}</p>
            </div>
          </div>
        </div>

                 {/* Seller Info */}
         <div className='mt-[20px] flex flex-col gap-[16px] rounded-[8px] bg-white px-[15px] py-[14px]'>
           <h3 className='text-[20px]/[24px] font-bold'>
             판매자 정보
           </h3>
           <div className='flex flex-col items-start'>
             <div className='flex items-end gap-[12px] py-[16px]'>
               <div className='w-[80px] h-[80px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
                 <span className='text-white text-2xl font-bold'>
                   {(auction?.sellerName || '판매자').charAt(0)}
                 </span>
               </div>
               <div>
                 <h4 className='text-[22px]/[28px] font-bold text-[#0D141C]'>
                   {auction?.sellerName || '판매자'}
                 </h4>
                 <p className='text-[16px]/[24px] text-[#4A739C]'>
                   평점: {auction?.sellerRating ? `${auction.sellerRating}/5.0` : '정보 없음'}
                 </p>
               </div>
             </div>
             <p className='text-[16px]/[24px] whitespace-pre-line text-[#0D141C]'>
               {auction?.sellerDescription || '판매자 설명이 없습니다.'}
             </p>
             {auction && (
               <div className='mt-4 p-4 bg-gray-50 rounded-lg w-full'>
                 <h5 className='font-semibold text-[16px] mb-2'>연락처 정보</h5>
                 <div className='text-[14px] text-[#666] space-y-1'>
                   <p>이메일: {auction.sellerEmail || '정보 없음'}</p>
                   <p>전화번호: {auction.sellerPhoneNumber || '정보 없음'}</p>
                   <p>주소: {auction.sellerAddress || '정보 없음'}</p>
                 </div>
               </div>
             )}
           </div>
         </div>
        {/* Product Description */}
        <div className='mt-[20px] flex flex-col gap-[16px] rounded-[8px] bg-white px-[15px] py-[14px]'>
          <h3 className='text-[20px]/[24px] font-bold'>상품 설명</h3>
          <div className='space-y-4'>
            <div className='flex flex-col gap-[8px]'>
              <p className='text-[14px] font-medium text-[#666]'>• 상품 히스토리</p>
              <p className='text-[16px] text-[#333] leading-relaxed'>
                {auction?.history || '1988년 월드 투어 당시 착용했던 자켓으로, 당시의 땀과 열정이 그대로 남아있습니다. 팬들 사이에서는 전설적인 아이템으로 알려져 있습니다.'}
              </p>
            </div>
            <div className='flex flex-col gap-[8px]'>
              <p className='text-[14px] font-medium text-[#666]'>• 추가설명</p>
              <p className='text-[16px] text-[#333] leading-relaxed'>
                {auction?.detailedInfo || '음악 및 패션 애호가에게는 최고의 소장품이며, 독특한 스타일을 연출할 수 있습니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 경매 결과 모달 */}
      <AuctionResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={auctionResult}
        productName={auction?.productName || '상품'}
        onPayment={handlePayment}
        onOtherAuctions={handleOtherAuctions}
        onMyBids={handleMyBids}
      />

      {/* 경매 마감 알림 모달 */}
      <AuctionExpiredModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        productName={auction?.productName || '상품'}
        endedAt={auction?.scheduledEndTime}
      />

                    {/* 즉시구매 모달 */}
        <BuyItNowModal
          isOpen={showBuyNowModal}
          onClose={() => setShowBuyNowModal(false)}
          onConfirm={handleBuyNowConfirm}
          productName={auction?.productName || '상품'}
          buyItNowPrice={auction?.buyItNowPrice || 0}
          auctionId={auction?.auctionId || 0}
          isLoading={false}
        />

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            // 로그인 성공 후 페이지 새로고침하여 인증 상태 업데이트
            window.location.reload();
          }}
        />
    </div>
  );
};

export default ProductInfo;
