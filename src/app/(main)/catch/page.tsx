"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import nafalflower from "@/assets/flower.png";

const PaymentCompleteContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 포인트 값 받아오기
  const [points, setPoints] = useState(0);

  // 컴포넌트 로드 시 URL 파라미터에서 포인트 값 추출
  useEffect(() => {
    const pointsParam = searchParams.get('points');
    if (pointsParam) {
      const pointsValue = parseInt(pointsParam, 10);
      setPoints(pointsValue);
    }
  }, [searchParams]);


  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoMyPage = () => {
    router.push('/mypage');
  };

 
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="flex flex-col w-full max-w-sm sm:max-w-md mx-auto">
        <span className="text-gray-800 text-2xl sm:text-[28px] font-bold text-center mt-32 mb-3">
          {"결제 완료"}
        </span>
        <span className="text-black text-sm sm:text-base text-center mb-6">
          {"지속 가능한 선택이 지구를 더 푸르게 만들었어요!"}
        </span>
        
        {/* 주문 정보 카드 */}
        <div className="flex flex-col items-center bg-neutral-50 p-6 mb-3 rounded-lg w-full">
          {/* 로고 이미지 영역 */}
          <div className="w-32 h-32 flex items-center justify-center">
            {/*
              요청하신 대로 로고를 삽입할 수 있는 <img> 태그를 사용했습니다.
              src 속성에 실제 이미지 URL을 입력해주세요.
              이미지가 로드되지 않을 경우를 대비하여 placeholder 이미지를 사용했습니다.
            */}
              <Image
                  src={nafalflower}
                  alt="결제 성공 로고"
                  className="w-full h-full object-fill rounded-lg"
              />
          </div>

          <div className="flex items-center my-2">
            <span className="text-gray-600 text-lg sm:text-xl font-bold mr-2">
              {"적립"}
            </span>
            <span className="text-gray-900 text-2xl sm:text-[28px] font-bold mr-2">
              {points}   {/* ✅ state 값으로 대체 */}
            </span>
            <span className="text-gray-900 text-xl sm:text-2xl font-bold">
              {"나팔꽃"}
            </span>
          </div>
          <span className="text-black text-sm sm:text-base text-center leading-normal whitespace-pre-line">
              {`✨ ${points} 나팔꽃으로 더 많은 선택의 기회 
              💚 지속 가능한 소비 실천으로 지구 보호`}
          </span>
          </div>
        

        {/* 확인하기 버튼 */}
        <button
          onClick={handleGoMyPage}
          className="flex justify-center items-center w-full bg-black py-4 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-colors duration-200"
        >
          <span className="text-white text-base font-bold">
            {"확인하기"}
          </span>
        </button>

        {/* 홈으로 버튼 */}
        <button
          onClick={handleGoHome}
          className="flex justify-center items-center w-full bg-white py-4 mb-32 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors duration-200 hover:bg-gray-100"
        >
          <span className="text-black text-base font-bold">
            {"홈으로"}
          </span>
        </button>
      </div>
    </div>
  );
};

const PaymentCompletePage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCompleteContent />
    </Suspense>
  );
};

export default PaymentCompletePage;
