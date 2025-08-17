import Image from 'next/image';

export function MainBanner() {
  return (
    <section className='bg-gradient-to-b from-pink-600 via-pink-500 to-black px-6 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid h-96 grid-cols-1 items-center gap-8 lg:grid-cols-3'>
          {/* Left Section */}
          <div className='relative h-full'>
            <div className='relative h-full w-full overflow-hidden rounded-2xl'>
              <Image
                fill
                alt='프리미엄 음료'
                className='object-cover'
                src='/strawberry-drink-cup.png'
              />
              <div className='absolute inset-0 bg-black/20' />
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 transform'>
                <span className='text-lg font-medium text-white'>
                  프리미엄 음료
                </span>
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className='h-full'>
            <div className='relative h-full w-full overflow-hidden rounded-2xl'>
              <Image
                fill
                alt='패션 컬렉션'
                className='object-cover'
                src='/fashion-items-display.png'
              />
              <div className='absolute inset-0 bg-black/20' />
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 transform'>
                <span className='text-lg font-medium text-white'>
                  패션 컬렉션
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className='relative h-full'>
            <div className='relative h-full w-full overflow-hidden rounded-2xl'>
              <Image
                fill
                alt='스낵 컬렉션'
                className='object-cover'
                src='/colorful-snack-package.png'
              />
              <div className='absolute inset-0 bg-black/20' />
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 transform'>
                <span className='text-lg font-medium text-white'>
                  스낵 컬렉션
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
