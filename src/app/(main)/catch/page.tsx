"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const PaymentCompletePage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoMyPage = () => {
    router.push('/mypage');
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '200px auto 100px',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'Pretendard, sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}>
        {/* 성공 아이콘 */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: 'white',
        }}>
          ✓
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#333',
          marginBottom: '16px',
        }}>
          결제가 완료되었습니다!
        </h1>

        {/* 설명 */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '40px',
        }}>
          주문이 성공적으로 처리되었습니다.<br />
          배송 정보는 마이페이지에서 확인하실 수 있습니다.
        </p>

        {/* 주문 정보 */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px',
          }}>
            주문 정보
          </h3>
          <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
            <div>상품: 홍익대 예술대 졸업작품전 출품작 20</div>
            <div>결제 금액: 125,968원</div>
            <div>결제 방법: payments</div>
            <div>주문일시: {new Date().toLocaleString('ko-KR')}</div>
          </div>
        </div>

        {/* 버튼들 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}>
          <button
            onClick={handleGoHome}
            style={{
              padding: '14px 28px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#007bff'}
          >
            홈으로
          </button>
          <button
            onClick={handleGoMyPage}
            style={{
              padding: '14px 28px',
              background: 'white',
              color: '#007bff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#007bff';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#007bff';
            }}
          >
            마이페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompletePage;
