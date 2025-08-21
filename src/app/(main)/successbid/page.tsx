"use client"

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SuccessBidPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bidInfo, setBidInfo] = useState({
    productName: '',
    productImage: '',
    bidAmount: 0,
    bidTime: '',
    isAutoBid: false
  });

  useEffect(() => {
    // URL 파라미터에서 낙찰 정보 가져오기
    const productName = searchParams.get('productName') || '입찰 결과가 나왔어요!';
    const productImage = searchParams.get('productImage') || '/api/placeholder/200/150';
    const bidAmount = parseInt(searchParams.get('bidAmount') || '0');
    const bidTime = searchParams.get('bidTime') || new Date().toLocaleString('ko-KR');
    const isAutoBid = searchParams.get('isAutoBid') === 'true';

    setBidInfo({
      productName,
      productImage,
      bidAmount,
      bidTime,
      isAutoBid
    });
  }, [searchParams]);

  const handlePayment = () => {
    router.push(`/catch/pay?productName=${encodeURIComponent(bidInfo.productName)}&amount=${bidInfo.bidAmount}`);
  };

  const handleViewHistory = () => {
    router.push('/mypage');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px 30px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        fontFamily: 'Pretendard, sans-serif',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* 제목 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '24px',
          margin: '0 0 24px 0',
        }}>
          {bidInfo.productName}
        </h2>

        {/* 상품 이미지 */}
        <div style={{
          width: '200px',
          height: '150px',
          margin: '0 auto 30px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#f5f5f5',
        }}>
          <img 
            src={bidInfo.productImage}
            alt="낙찰 상품"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* 버튼들 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <button
            onClick={handlePayment}
            style={{
              width: '100%',
              padding: '16px',
              background: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#333'}
            onMouseOut={(e) => e.currentTarget.style.background = '#000'}
          >
            결제하기
          </button>
          
          <button
            onClick={handleViewHistory}
            style={{
              width: '100%',
              padding: '16px',
              background: 'white',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.borderColor = '#bbb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#ddd';
            }}
          >
            나의 입찰내역
          </button>
        </div>
      </div>
    </div>
  );
};

// Suspense로 감싼 컴포넌트
const SuccessBidPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SuccessBidPage />
    </Suspense>
  );
};

export default SuccessBidPageWithSuspense;