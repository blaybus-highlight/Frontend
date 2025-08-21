"use client"; // Next.js App Router 환경을 위한 지시어

import React, { useState, useEffect } from 'react';
// [수정] 1. Next.js의 App Router용 useRouter를 import합니다.
import { useRouter } from 'next/navigation';

// --- [백엔드 연동] 1. 데이터 타입 정의 ---
interface BidSuccessData {
  productImageUrl: string;
  daysLeft: number;
  flowerAmount: string;
  flowerName: string;
}

// --- [디자인] 2. 스타일 정의 컴포넌트 ---
const StyleProvider = () => {
  const css = `
    .bidding-success-page {
      background-color: white;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 160px 16px 80px;
    }
    .content-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .main-content-box {
      width: 100%;
      max-width: 576px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .title {
      font-size: 30px;
      font-weight: 700;
      color: black;
      margin-bottom: 10px;
    }
    .description {
      color: black;
      font-size: 17px;
      margin-bottom: 40px;
    }
    .day-highlight {
      font-size: 1.2em;
      font-weight: 700;
    }
    .flower-highlight {
      font-weight: 700;
      color: black;
    }
    .image-container {
      width: 100%;
      aspect-ratio: 4 / 3;
      background-color: #e5e7eb;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .button-container {
      width: 100%;
      max-width: 768px;
      margin-top: 24px;
    }
    .cta-button {
      width: 100%;
      background-color: black;
      color: white;
      font-size: 18px;
      font-weight: 700;
      padding: 16px 0;
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background-color: #1f2937;
    }
  `;
  return <style>{css}</style>;
};

// --- [백엔드 연동] 3. 화면을 그리는 순수 UI 컴포넌트 (Presenter) ---
// [수정] 버튼 클릭 시 실행할 함수를 props로 받도록 타입을 추가합니다. (onNavigate)
const BiddingSuccessView: React.FC<{ data: BidSuccessData; onNavigate: () => void; }> = ({ data, onNavigate }) => {
  return (
    <div className="bidding-success-page">
      <div className="content-wrapper">
        <div className="main-content-box">
          <h1 className="title">낙찰을 축하드려요!</h1>
          <p className="description">
            최종 결제까지 D-<span className="day-highlight">{data.daysLeft}</span>일 남았어요.
            <br />
            잊지 말고 <span className="flower-highlight">{data.flowerAmount}</span> {data.flowerName}과 함께 받아가세요.
          </p>
          <div className="image-container">
            <img
              src={data.productImageUrl}
              alt="낙찰된 상품 이미지"
              className="product-image"
            />
          </div>
        </div>
        <div className="button-container">
          {/* [수정] 4. 버튼에 onClick 이벤트를 추가하고, props로 받은 onNavigate 함수를 연결합니다. */}
          <button type="button" className="cta-button" onClick={onNavigate}>
            최종 결제하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};


// --- [백엔드 연동] 4. 데이터 관리 및 API 호출을 담당하는 메인 페이지 컴포넌트 (Container) ---
const BiddingSuccessPage: React.FC = () => {
  // [수정] 2. useRouter 훅을 호출하여 router 객체를 생성합니다.
  const router = useRouter();
  const [bidData, setBidData] = useState<BidSuccessData | null>(null);

  useEffect(() => {
    const mockApiData: BidSuccessData = {
      productImageUrl: "https://via.placeholder.com/800x600/cccccc/888888?text=낙찰된+상품",
      daysLeft: 7,
      flowerAmount: "125,968",
      flowerName: "나팔꽃",
    };
    setBidData(mockApiData);
  }, []);

  // [수정] 3. '/catch/pay' 경로로 이동시키는 핸들러 함수를 정의합니다.
  const handleNavigateToPayment = () => {
    router.push('/catch/pay');
  };

  if (!bidData) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <>
      <StyleProvider />
      {/* [수정] View 컴포넌트에 onNavigate prop으로 핸들러 함수를 전달합니다. */}
      <BiddingSuccessView data={bidData} onNavigate={handleNavigateToPayment} />
    </>
  );
};

export default BiddingSuccessPage;