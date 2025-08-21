"use client"; // Next.js App Router 환경을 위한 지시어

import React, { useState, useEffect } from 'react';

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
    
    /* --- ▼▼▼▼▼ 수정된 부분 ▼▼▼▼▼ --- */
    .day-highlight {
      /* [수정] color 속성을 제거하여 주변 텍스트와 폰트 색상을 동일하게 맞춥니다. */
      
      /* [수정] font-size를 추가하여 주변 텍스트보다 크게 만듭니다. (1.2배) */
      font-size: 1.2em;

      /* [수정] font-weight: 700;은 'bold'와 동일한 굵기입니다. */
      font-weight: 700;
    }
    /* --- ▲▲▲▲▲ 수정된 부분 ▲▲▲▲▲ --- */

    .flower-highlight {
      font-weight: 700;
      color: black; /* 예시: 초록색 계열 */
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
const BiddingSuccessView: React.FC<{ data: BidSuccessData }> = ({ data }) => {
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
          <button type="button" className="cta-button">
            최종 결제하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};


// --- [백엔드 연동] 4. 데이터 관리 및 API 호출을 담당하는 메인 페이지 컴포넌트 (Container) ---
const BiddingSuccessPage: React.FC = () => {
  const [bidData, setBidData] = useState<BidSuccessData | null>(null);

  useEffect(() => {
    // --- 백엔드 API 호출 시뮬레이션 ---
    const mockApiData: BidSuccessData = {
      productImageUrl: "https://via.placeholder.com/800x600/cccccc/888888?text=낙찰된+상품",
      daysLeft: 7,
      flowerAmount: "125,968",
      flowerName: "나팔꽃",
    };
    setBidData(mockApiData);
  }, []);

  if (!bidData) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <>
      <StyleProvider />
      <BiddingSuccessView data={bidData} />
    </>
  );
};

export default BiddingSuccessPage;