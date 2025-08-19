export function Footer() {
  return (
    <footer className='border-t border-gray-200 bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-12'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-[6fr_1fr_1fr]'>
          {/* Company Info */}
          <div>
            <h3 className='mb-4 text-xl font-bold text-gray-900'>Nafal</h3>
            <p className='mb-6 text-sm leading-relaxed text-gray-600'>
              믿을 수 있는 가치 플랫폼, 나팔
              <br />
              갖고 싶은 한정판 제품을 다 나팔에서
            </p>
            <div className='flex space-x-4'>
              <a
                className='text-gray-400 transition-colors hover:text-gray-600'
                href='#'
              >
                <svg
                  fill='currentColor'
                  height='24'
                  viewBox='0 0 24 24'
                  width='24'
                >
                  <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                </svg>
              </a>
              <a
                className='text-gray-400 transition-colors hover:text-gray-600'
                href='#'
              >
                <svg
                  fill='currentColor'
                  height='24'
                  viewBox='0 0 24 24'
                  width='24'
                >
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='mb-4 text-lg font-semibold text-gray-900'>
              고객센터
            </h4>
            <div className='space-y-2 text-sm text-gray-600'>
              <div>02-786-8978</div>
              <div>support@soldout.kr</div>
              <div>평일 10:00 - 18:00</div>
            </div>
          </div>

          {/* Services */}
          <div className="ml-auto">  
            <h4 className='mb-4 text-lg font-semibold text-gray-900'>서비스</h4>
            <ul className='space-y-2'>
              <li>
                <a
                  className='text-sm text-gray-600 transition-colors hover:text-gray-900'
                  href='#'
                >
                  회사소개
                </a>
              </li>
              <li>
                <a
                  className='text-sm text-gray-600 transition-colors hover:text-gray-900'
                  href='#'
                >
                  검수기준
                </a>
              </li>
              <li>
                <a
                  className='text-sm text-gray-600 transition-colors hover:text-gray-900'
                  href='#'
                >
                  페널티정책
                </a>
              </li>
              <li>
                <a
                  className='text-sm text-gray-600 transition-colors hover:text-gray-900'
                  href='#'
                >
                  제휴문의
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 border-t border-gray-200 pt-8'>
          <div className='flex flex-col items-center justify-between md:flex-row'>
            <p className='text-sm text-gray-500'>
              @2024 NAFAL. All rights reserved.
            </p>
            <div className='mt-4 flex space-x-6 md:mt-0'>
              <a
                className='text-sm text-gray-500 transition-colors hover:text-gray-700'
                href='#'
              >
                이용약관
              </a>
              <a
                className='text-sm text-gray-500 transition-colors hover:text-gray-700'
                href='#'
              >
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
