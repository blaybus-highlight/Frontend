'use client';

import { useState, useEffect } from 'react';

export function FakeNotificationBanner() {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const names = ['김철수', '전우선', '탁찬홍', '이승윤', '이주혜', '류미란', '이수영', '박강원'];
  
  const products = [
    '빈티지 가방', '앤틱 시계', '레트로 카메라', '클래식 의자', '빈티지 조명', 
    '골동품 찻잔', '레트로 라디오', '앤틱 거울', '빈티지 액자', '클래식 화분',
    '레트로 선풍기', '앤틱 책상', '빈티지 옷장', '클래식 피아노', '레트로 냉장고'
  ];

  const getRandomReward = () => Math.floor(Math.random() * 50) + 5; // 5-54그루

  const notifications = names.map((name, index) => ({
    id: index,
    name,
    product: products[Math.floor(Math.random() * products.length)],
    reward: getRandomReward()
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 300); // 0.3초 fade out 후 다음 알림
      
    }, 4000); // 4초마다 변경

    return () => clearInterval(interval);
  }, [notifications.length]);

  const notification = notifications[currentNotification];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 transform ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{ minWidth: '320px' }}
      >
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-800">
              <span className="font-semibold">[{notification.name}]</span>님이 상품{' '}
              <span className="font-semibold">[{notification.product}]</span>를 최종 낙찰 받고{' '}
              <span className="font-bold text-green-600">{notification.reward}그루</span>를 획득하셨어요 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}