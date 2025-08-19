import Image from 'next/image';

export function MainBanner() {
  const banners = [
    { src: '/images/banner1.png', alt: '배너 1' },
    { src: '/images/banner2.png', alt: '배너 2' },
    { src: '/images/banner3.png', alt: '배너 3' },
  ];

  return (
    <section className='bg-gradient-to-b from-pink-600 via-pink-500 to-black px-6 py-16 -mt-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid h-96 grid-cols-1 items-center gap-8 lg:grid-cols-3'>
          {banners.map((banner, index) => (
            <div key={index} className='relative h-full'>
              <div className='relative h-full w-full overflow-hidden rounded-2xl'>
                <Image
                  fill
                  alt={banner.alt}
                  className='object-cover'
                  src={banner.src}
                />
                {/* 텍스트 오버레이 */}
                <div className='absolute inset-0 bg-black/20' />
                <div className='absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-center'>
                  <div className='mb-2'>
                    <span className='text-2xl font-bold'>덕질은</span>
                  </div>
                  <div className='mb-1'>
                    <span className='text-lg font-medium'>삶의 에너지니까</span>
                  </div>
                  <div>
                    <span className='text-sm text-gray-200'>오직 나팔에서만</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
