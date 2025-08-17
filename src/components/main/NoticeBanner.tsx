/**
 * description : NoticeBanner 컴포넌트는 경매에서 낙찰된 상품에 대한 알림 배너를 표시합니다.
 */

export function NoticeBanner() {
  return (
    <div className='mx-0 mt-0 mb-8 overflow-hidden bg-sky-100 shadow-sm'>
      <div className='flex items-center justify-center px-6 py-4'>
        <div className='flex-shrink-0'>
          <div className='flex h-8 w-8 items-center justify-center'>
            <span className='text-2xl'>🎉</span>
          </div>
        </div>

        <div className='flex-1 text-center'>
          <p
            className='text-lg font-medium text-black'
            style={{
              fontFamily: 'Gulim, "맑은 고딕", "Malgun Gothic", sans-serif',
            }}
          >
            <span className='font-bold text-blue-600'>[김철수]</span>님이 상품
            <span className='font-bold text-red-600'> [빈티지 가방]</span>를
            최종 낙찰 받고
            <span className='font-bold text-green-600'>15그루</span>를
            습득하셨어요
          </p>
        </div>

        <div className='flex-shrink-0'>
          <div className='flex h-8 w-8 items-center justify-center'>
            <span className='text-2xl'>🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
}
