import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStatus, useWishlistToggle } from '@/hooks/useWishlist';
import { useNotificationStatus, useNotificationToggle } from '@/hooks/useNotification';

interface ProductCardProps {
  id: string;
  brand: string; // 경매 상태 (SCHEDULED, IN_PROGRESS 등)
  productName: string; // 상품명 (e.g., '침대 위 블랭킷')
  startPrice: number | null;
  buyNowPrice: number | null;
  image: string;
  isLiked?: boolean; // 더 이상 사용하지 않음 (API에서 가져옴)
  bidCount?: number;
  timeLeft?: string;
  category?: string; // 카테고리 정보 (FASHION, FURNITURE 등)
  brandName?: string; // 브랜드명
}

/**
 * * ProductCard 컴포넌트는 Main 화면의 개별 상품 정보를 표시합니다.
 * * 이미지와 일치하도록 레이아웃, 스타일, props를 수정했습니다.
 */
export function ProductCard({
  id,
  brand = '라이프집 집스터 geun_k.zip',
  productName = '침대 위 블랭킷',
  startPrice = 25000,
  buyNowPrice = 25000,
  image = '/blanket.jpg', // 실제 이미지 경로로 교체 필요
  isLiked, // 더 이상 기본값 사용 안함
  bidCount = 0,
  timeLeft = '10시간 남음',
  category,
  brandName,
}: ProductCardProps) {
  // 찜 상태 조회 및 토글 기능
  const { data: wishlistData, isLoading: isWishlistLoading } = useWishlistStatus(
    parseInt(id)
  );
  const wishlistToggle = useWishlistToggle();

  // 알림 상태 조회 및 토글 기능 (경매 예정 상품만)
  const { data: notificationData, isLoading: isNotificationLoading } = useNotificationStatus(
    brand === 'SCHEDULED' ? parseInt(id) : 0
  );
  const notificationToggle = useNotificationToggle();

  // 찜 토글 핸들러
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Link 내비게이션 방지
    e.stopPropagation();
    
    if (!id) {
      alert('상품 정보를 찾을 수 없습니다.');
      return;
    }

    wishlistToggle.mutate(parseInt(id));
  };

  // 알림 토글 핸들러
  const handleNotificationToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) {
      alert('상품 정보를 찾을 수 없습니다.');
      return;
    }

    notificationToggle.mutate(parseInt(id), {
      onSuccess: (data) => {
        const isActive = data.data?.active;
        alert(isActive ? '경매 시작 알림이 설정되었습니다!' : '경매 시작 알림이 해제되었습니다.');
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          alert('로그인 후 이용해주세요.');
        } else {
          alert('알림 설정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    });
  };

  // 현재 찜 상태 (기본 prop보다 API 데이터 우선)
  const currentWishlistStatus = wishlistData?.data?.wishlisted ?? isLiked ?? false;

  // 현재 알림 설정 상태
  const currentNotificationStatus = notificationData?.data?.active ?? false;
  

  // 브랜드명 표시
  const getBrandDisplay = () => {
    return brandName || '기타';
  };

  const getTimeLeft = () => {
    if (!timeLeft) return '정보 없음';
    
    try {
      // 잘못된 날짜 포맷 수정 (083D -> 08-03T)
      let correctedTimeLeft = timeLeft.replace(/(\d{4})-(\d{2})(\d)D/, '$1-$2-0$3T');
      
      // ISO 날짜 형식인지 확인하고 시간 계산
      if (correctedTimeLeft.includes('T')) {
        const targetDate = new Date(correctedTimeLeft);
        if (isNaN(targetDate.getTime())) {
          return timeLeft; // 변환 실패시 원래 값 반환
        }
        
        const now = new Date();
        const diffMs = targetDate.getTime() - now.getTime();
        
        // 경매 예정 상품 (SCHEDULED)의 경우 오픈까지의 D-Day 계산
        if (brand === 'SCHEDULED') {
          if (diffMs <= 0) return 'D-Day';
          
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          return `오픈 예정 D-${diffDays}`;
        }
        
        // 진행 중인 경매의 경우 마감까지의 시간 계산
        if (diffMs <= 0) return '마감';
        
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) {
          return `${diffDays}일 ${diffHours % 24}시간 남음`;
        } else if (diffHours > 0) {
          return `${diffHours}시간 남음`;
        } else {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return `${Math.max(1, diffMinutes)}분 남음`;
        }
      }
    } catch (error) {
      console.warn('Date parsing error:', timeLeft, error);
    }
    
    // 파싱 실패시 원래 값 반환
    return timeLeft;
  };

  const displayTime = getTimeLeft();

  const getTimeStyle = () => {
    if (displayTime === '마감') {
      return 'bg-gray-100 text-gray-500';
    } else if (brand === 'ENDING_SOON' || displayTime.includes('1시간') || displayTime.includes('분 남음')) {
      return 'bg-red-50 text-red-600'; // 마감 임박은 빨간색
    }
    return 'bg-green-50 text-green-800'; // 예정/진행 중 모두 초록색으로 통일
  };

  return (
    <Link className='block' href={`/product/${id}`}>
      {/* 아래 div에서 배경색과 그림자 클래스를 제거했습니다. */}
      <div className='relative cursor-pointer overflow-hidden rounded-lg'>
        <div className='relative'>
          <Image
            alt={productName}
            className='h-48 w-full object-cover'
            height={192}
            src={image || '/placeholder.svg'}
            width={300}
          />
          {/* 입찰 정보: 이미지 우측 상단으로 이동 */}
          <span className='absolute top-2 right-2 rounded bg-green-50 px-2 py-1 text-xs text-gray-600'>
            {bidCount}건 입찰
          </span>
        </div>

        {/* 좋아요 및 알림 버튼 영역 */}
        <div className='absolute top-[195px] right-3 z-10 flex gap-1'>
          {/* 경매 예정 상품에만 알림 버튼 표시 */}
          {brand === 'SCHEDULED' && (
            <button 
              onClick={handleNotificationToggle}
              disabled={notificationToggle.isPending || isNotificationLoading}
              className={`rounded-full bg-white/80 p-1.5 shadow-sm transition-all duration-200 ${
                notificationToggle.isPending || isNotificationLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white hover:scale-110'
              }`}
              title={currentNotificationStatus ? '경매 시작 알림 해제' : '경매 시작 알림 설정'}
            >
              <svg
                fill={currentNotificationStatus ? '#3b82f6' : 'none'}
                height='20'
                stroke={currentNotificationStatus ? '#3b82f6' : '#6b7280'}
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='20'
              >
                <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
                <path d='M13.73 21a2 2 0 0 1-3.46 0' />
                {currentNotificationStatus && (
                  <circle cx='18' cy='6' r='3' fill='#3b82f6' />
                )}
              </svg>
            </button>
          )}
          
          {/* 좋아요 버튼 */}
          <button 
            onClick={handleWishlistToggle}
            disabled={wishlistToggle.isPending || isWishlistLoading}
            className={`rounded-full bg-white/80 p-1.5 shadow-sm transition-all duration-200 ${
              wishlistToggle.isPending || isWishlistLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white hover:scale-110'
            }`}
            title={currentWishlistStatus ? '찜 취소' : '찜하기'}
          >
            <svg
              fill={currentWishlistStatus ? '#ef4444' : 'none'}
              height='20'
              stroke={currentWishlistStatus ? '#ef4444' : '#6b7280'}
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='20'
            >
              <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
            </svg>
          </button>
        </div>

        <div className='p-4'>
          {/* 브랜드명 표시 */}
          <p className='mb-1 text-sm text-gray-500'>
            {getBrandDisplay()}
          </p>
          <h3 className='mb-3 truncate text-base font-semibold text-gray-800'>
            {productName}
          </h3>

          <div className='mb-3 space-y-1'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>현재가</span>
              <span className='text-lg font-bold text-gray-900'>
                {(startPrice || 0).toLocaleString()} 원
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-400'>즉시 구매가</span>
              <span className='text-sm text-gray-400'>
                {(buyNowPrice || 0).toLocaleString()} 원
              </span>
            </div>
          </div>

          <div
            className={`flex items-center justify-center rounded px-3 py-1.5 ${getTimeStyle()}`}
          >
            <span className='text-sm font-medium'>{displayTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
