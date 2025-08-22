'use client';

import { useEffect, useState } from 'react';


// 이 코드는 Next.js 환경이 아닌 일반 React 환경에서도 동작하도록 수정되었습니다.
// Image 컴포넌트 대신 HTML의 img 태그를 사용하여 컴파일 오류를 해결합니다.
// Tailwind CSS를 사용하여 반응형 디자인을 적용했습니다.

// 컴포넌트를 'export default'로 내보내어 React에서 올바르게 인식하도록 수정했습니다.
export function MainBanner() {
  const banners = [
    { src: '/images/banner1.png', alt: '배너 1' },
    { src: '/images/banner2.png', alt: '배너 2' },
    { src: '/images/banner3.png', alt: '배너 3' },
    { src: 'https://placehold.co/1080x600/E91E63/ffffff?text=Banner+1', alt: '배너 1' },
    { src: 'https://placehold.co/1080x600/F06292/ffffff?text=Banner+2', alt: '배너 2' },
    { src: 'https://placehold.co/1080x600/C2185B/ffffff?text=Banner+3', alt: '배너 3' },
    { src: 'https://placehold.co/1080x600/E91E63/ffffff?text=Banner+4', alt: '배너 4' },
    { src: 'https://placehold.co/1080x600/F06292/ffffff?text=Banner+5', alt: '배너 5' },
    { src: 'https://placehold.co/1080x600/C2185B/ffffff?text=Banner+6', alt: '배너 6' },
    { src: 'https://placehold.co/1080x600/E91E63/ffffff?text=Banner+7', alt: '배너 7' },
    { src: 'https://placehold.co/1080x600/F06292/ffffff?text=Banner+8', alt: '배너 8' },
    { src: 'https://placehold.co/1080x600/C2185B/ffffff?text=Banner+9', alt: '배너 9' },
  ];
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 3;

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev - itemsPerSlide < 0 ? banners.length - itemsPerSlide : prev - itemsPerSlide
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerSlide >= banners.length ? 0 : prev + itemsPerSlide
    );
  };

      // 1초마다 자동 슬라이드 기능을 추가합니다.
  const intervalTime = 3000; // 3초
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, intervalTime);
    // 컴포넌트가 unmount될 때 interval을 정리합니다.
    return () => clearInterval(interval);
  }, [currentIndex]); // currentIndex가 변경될 때마다 interval을 재설정합니다.

  const currentBanners = banners.slice(currentIndex, currentIndex + itemsPerSlide);

 
    // 배경을 흰색으로 변경하고, 불필요한 패딩을 제거하여 전체 너비를 사용합니다.
    return (
      <section className="bg-white px-0 py-0 -mt-6">
        <div className="mx-auto max-w-7xl relative overflow-hidden">
          {/* 3개 이미지 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 items-center">
            {currentBanners.map((banner, index) => (
              <div key={index} className="relative">
                <div className="relative w-full overflow-hidden">
                  <img
                    alt={banner.alt}
                    className="object-cover w-full h-full"
                    src={banner.src}
                  />
  
              {/* 텍스트 오버레이 */}
              <div className='absolute inset-0 bg-black/20' />
              <div className='absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 text-white text-center'>
                <div className='mb-1 sm:mb-2'>
                  <span className='text-lg sm:text-2xl font-bold'>Nafal은</span>
                </div>
                <div className='mb-1'>
                  <span className='text-sm sm:text-lg font-medium'>삶의 에너지니까</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    
      
      {/* 왼쪽 화살표 */}
      <button
        onClick={goToPrevious}
        className='absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* 오른쪽 화살표 */}
      <button
        onClick={goToNext}
        className='absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </button>
      </div>
      </div>
  </section>
);
}
