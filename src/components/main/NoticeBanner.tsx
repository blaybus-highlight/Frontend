'use client';

import { useState, useEffect } from 'react';

export function NoticeBanner() {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const names = ['전우선', '탁찬홍', '이승윤', '이주혜', '류미란', '이수영', '박강원'];
  
  const products = [
    '빈티지 가방', '앤틱 시계', '레트로 카메라', '클래식 의자', '빈티지 조명', 
    '골동품 찻잔', '레트로 라디오', '앤틱 거울', '빈티지 액자', '클래식 화분',
    '레트로 선풍기', '앤틱 책상', '빈티지 옷장', '클래식 피아노', '레트로 냉장고'
  ];

  // 클라이언트에서만 실행되도록 useEffect 사용
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트에서만 랜덤 데이터 생성
  const getRandomReward = () => Math.floor(Math.random() * 50) + 5; // 5-54나팔꽃

  const notifications = isClient ? names.map((name, index) => ({
    id: index,
    name,
    product: products[Math.floor(Math.random() * products.length)],
    reward: getRandomReward()
  })) : [];

  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length);
    }, 3000); // 3초마다 변경

    return () => clearInterval(interval);
  }, [notifications.length, isClient]);

  const notification = notifications[currentNotification];

  // 서버에서는 빈 div를 렌더링하고, 클라이언트에서만 실제 내용을 렌더링
  if (!isClient || !notification) {
    return (
      <div className='mx-0 mt-0 mb-8 overflow-hidden bg-sky-100 shadow-sm'>
        <div className='flex items-center justify-center px-6 py-4'>
          <div className='flex-1 text-center'>
            <p
              className='text-lg font-medium text-black transition-all duration-500'
              style={{
                fontFamily: 'Gulim, "맑은 고딕", "Malgun Gothic", sans-serif',
              }}
            >
              🎉 경매 알림을 불러오는 중... 🎉
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-0 mt-0 mb-8 overflow-hidden bg-sky-100 shadow-sm'>
      <div className='flex items-center justify-center px-6 py-4'>
        <div className='flex-1 text-center'>
          <p
            className='text-lg font-medium text-black transition-all duration-500'
            style={{
              fontFamily: 'Gulim, "맑은 고딕", "Malgun Gothic", sans-serif',
            }}
          >
            🎉 <span className='font-bold text-blue-600'>[{notification.name}]</span>님이 상품
            <span className='font-bold text-red-600'> [{notification.product}]</span>를
            최종 낙찰 받고 <span className='font-bold text-green-600'>{notification.reward}나팔꽃</span>을
            획득하셨어요 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
