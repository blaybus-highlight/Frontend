import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStatus, useWishlistToggle } from '@/hooks/useWishlist';

interface ProductCardProps {
  id: string;
  brand: string; // 상품 판매자 정보 (e.g., '라이프집 집스터 geun_k.zip')
  productName: string; // 상품명 (e.g., '침대 위 블랭킷')
  startPrice: number | null;
  buyNowPrice: number | null;
  image: string;
  isLiked?: boolean; // 더 이상 사용하지 않음 (API에서 가져옴)
  bidCount?: number;
  timeLeft?: string;
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
}: ProductCardProps) {
  // 찜 상태 조회 및 토글 기능
  const { data: wishlistData, isLoading: isWishlistLoading } = useWishlistStatus(
    parseInt(id)
  );
  const wishlistToggle = useWishlistToggle();

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

  // 현재 찜 상태 (기본 prop보다 API 데이터 우선)
  const currentWishlistStatus = wishlistData?.data?.wishlisted ?? isLiked ?? false;

  const getTimeStyle = () => {
    if (timeLeft === '마감') {
      return 'bg-gray-100 text-gray-500';
    } else if (timeLeft?.includes('1시간')) {
      return 'bg-red-50 text-red-600';
    }
    // 이미지와 같이 연한 녹색 배경으로 수정
    return 'bg-green-50 text-green-800';
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

        {/* 좋아요 버튼: 카드 콘텐츠 영역 우측으로 이동 */}
        <button 
          onClick={handleWishlistToggle}
          disabled={wishlistToggle.isPending || isWishlistLoading}
          className={`absolute top-[195px] right-3 z-10 rounded-full bg-white/80 p-1.5 shadow-sm transition-all duration-200 ${
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

        <div className='p-4'>
          {/* 상품 정보: 2줄로 표시하도록 구조 변경 */}
          <p className='mb-1 text-sm text-gray-500'>{brand}</p>
          <h3 className='mb-3 truncate text-base font-semibold text-gray-800'>
            {productName}
          </h3>

          <div className='mb-3 space-y-1'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>시작가</span>
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
            <span className='text-sm font-medium'>{timeLeft}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
