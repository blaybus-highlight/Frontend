import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  startPrice: number | null;
  buyNowPrice: number | null;
  image: string;
  bidCount?: number;
  timeLeft?: string;
  isLiked?: boolean;
  isPremium?: boolean;
  zipFileName?: string;
  showAlarm?: boolean;
}

export function ProductCard({
  id,
  name,
  startPrice,
  buyNowPrice,
  image,
  bidCount = 0,
  timeLeft = '10시간 남음',
  isLiked = false,
  isPremium = false,
  zipFileName = 'geun_k.zip',
  showAlarm = false,
}: ProductCardProps) {
  const getTimeStyle = () => {
    if (timeLeft === '마감') {
      return 'bg-gray-100 text-gray-500 border border-gray-200';
    } else if (timeLeft === '1시간 남음') {
      return 'bg-red-50 text-red-600 border border-red-200';
    }
    return 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  return (
    <Link className='block' href={`/product/${id}`}>
      <div className='cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md'>
        <div className='flex items-center justify-between bg-gray-50 p-3'>
          {isPremium && (
            <span className='flex items-center gap-1 rounded bg-black px-2 py-1 text-xs text-white'>
              <svg
                fill='currentColor'
                height='12'
                viewBox='0 0 24 24'
                width='12'
              >
                <path d='M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z' />
              </svg>
              Premium
            </span>
          )}
          <span className='ml-auto rounded bg-green-50 px-2 py-1 text-sm text-gray-600'>
            {bidCount}건 입찰
          </span>
        </div>
        <div className='relative'>
          <Image
            alt={name}
            className='h-48 w-full object-cover'
            height={192}
            src={image || '/placeholder.svg'}
            width={300}
          />
          <div className='absolute right-3 bottom-3 flex gap-2'>
            {showAlarm && (
              <button className='rounded-full bg-white/80 p-2 transition-colors hover:bg-white'>
                <svg
                  fill='#ef4444'
                  height='20'
                  stroke='#ef4444'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  width='20'
                >
                  <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
                  <path d='M13.73 21a2 2 0 0 1-3.46 0' />
                </svg>
              </button>
            )}
            <button className='rounded-full bg-white/80 p-2 transition-colors hover:bg-white'>
              <svg
                fill={isLiked ? '#ef4444' : 'none'}
                height='20'
                stroke={isLiked ? '#ef4444' : '#6b7280'}
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='20'
              >
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
              </svg>
            </button>
          </div>
        </div>
        <div className='p-4'>
          <div className='mb-2 text-sm font-medium text-blue-600'>
            {zipFileName}
          </div>
          <h3 className='mb-3 line-clamp-2 text-sm font-medium text-gray-900'>
            {name}
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
            className={`flex items-center justify-center gap-2.5 self-stretch rounded px-3 py-1 ${getTimeStyle()}`}
          >
            <span className='text-sm font-medium'>
              {timeLeft === '마감'
                ? '마감'
                : timeLeft === '1시간 남음'
                  ? '01시간 남음'
                  : timeLeft}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
