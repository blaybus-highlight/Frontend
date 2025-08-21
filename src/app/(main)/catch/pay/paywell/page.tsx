// 파일 경로: app/payment/success/page.tsx (예시)

"use client"; // Next.js App Router 환경을 위한 지시어

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaYoutube, FaInstagram } from 'react-icons/fa';

// --- 데이터 타입 정의 ---
interface PaymentSuccessData {
  flowerPoints: number;
}

// --- 푸터 컴포넌트 ---
const Footer = () => (
  <footer className="w-full bg-white py-12 px-8 border-t">
    <div className="max-w-md mx-auto text-center">
      <div className="text-2xl font-bold mb-4">NAFAL</div>
      <p className="text-gray-500 text-sm">©2024 NAFAL. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-4">
        <a href="#"><FaYoutube size={20} className="text-gray-400 hover:text-black" /></a>
        <a href="#"><FaInstagram size={20} className="text-gray-400 hover:text-black" /></a>
      </div>
    </div>
  </footer>
);


// --- 메인 페이지 컴포넌트 ---
export default function PaymentSuccessPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);

  useEffect(() => {
    const mockApiData: PaymentSuccessData = {
      flowerPoints: 34,
    };
    setPaymentData(mockApiData);
  }, []);

  // [수정] '확인하기' 버튼 클릭 시 /mypage로 이동하도록 로직 변경
  const handleConfirm = () => {
    router.push('/mypage');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (!paymentData) {
    return <div className="flex items-center justify-center h-screen">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="bg-white">
      
      <main className="pt-32 pb-24">
        <div className="text-center w-full max-w-4xl p-4 mx-auto">

          {/* --- 상단 제목 --- */}
          <h1 className="text-3xl font-bold text-black mb-2">결제 완료</h1>
          <p className="text-base text-gray-800 font-bold mb-4">
            지속 가능한 선택이 지구를 더 푸르게 만들었어요!
          </p>

          {/* --- 정보 박스 --- */}
          <div className="bg-gray-100 p-14 mb-4">
            <div className="mb-5 flex justify-center">
              <img 
                src="https://i.imgur.com/example.png"
                alt="나팔꽃 아이콘" 
                className="w-24 h-24"
              />
            </div>
            
            <div className="text-gray-800 mb-6">
              <span className="text-xl font-bold">적립 </span>
              <span className="font-bold text-black text-3xl">{paymentData.flowerPoints}</span>
              <span className="text-3xl font-bold text-black ml-0"> 나팔꽃</span>
            </div>

            <div className="text-m text-black font-bold flex flex-col justify-center space-y-1">
              <p className="flex items-center justify-center">
                <span className="text-green-500 mr-2">▲</span>
                <span>{Math.floor(paymentData.flowerPoints * 0.1)} 그루의 나무가 자랄 수 있는 환경 기여</span>
              </p>
              <p className="flex items-center justify-center">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span>{paymentData.flowerPoints + 1} 나팔꽃으로 더 많은 선택의 기회</span>
              </p>
              <p className="flex items-center justify-center">
                <span className="text-green-500 mr-2">💚</span>
                <span>지속가능한 소비 실천으로 지구 보호</span>
              </p>
            </div>
          </div>

          {/* --- 버튼 그룹 --- */}
          <div className="w-full space-y-3">
            <button 
              type="button" 
              onClick={handleConfirm}
              className="w-full bg-black text-white text-base font-bold py-4 transition hover:bg-gray-800"
            >
              확인하기
            </button>
            <button 
              type="button" 
              onClick={handleGoHome}
              className="w-full bg-white text-black text-base font-bold py-4 border border-gray-400 transition hover:bg-gray-100"
            >
              홈으로
            </button>
          </div>
          
        </div>
      </main>      
    </div>
  );
};
