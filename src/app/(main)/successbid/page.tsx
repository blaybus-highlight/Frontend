"use client"

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentPreview } from '@/api/payments';

interface BuyItNowData {
  auctionId: number;
  productName: string;
  buyItNowPrice: number;
  usedPointAmount: number;
  actualPaymentAmount: number;
  pointReward: number;
  remainingPoint: number;
  completedAt: string;
}

const SuccessBidContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buyItNowData, setBuyItNowData] = useState<BuyItNowData | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData: BuyItNowData = JSON.parse(decodeURIComponent(dataParam));
        setBuyItNowData(parsedData);
      } catch (error) {
        console.error('Failed to parse buy it now data:', error);
        alert('즉시 구매 정보를 불러오는데 실패했습니다.');
      }
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!buyItNowData) {
      alert('즉시 구매 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('결제 미리보기 API 호출 시작, auctionId:', buyItNowData.auctionId);
      const response = await getPaymentPreview(buyItNowData.auctionId);
      console.log('결제 미리보기 API 응답:', response);
      
      if (response.success) {
        setPreviewData(response.data);
        console.log('pay 페이지로 전달할 데이터:', response.data);
        // 결제 미리보기 데이터와 함께 pay 페이지로 이동
        router.push(`/pay?preview=${encodeURIComponent(JSON.stringify(response.data))}`);
      } else {
        alert(`결제 미리보기 조회 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('결제 미리보기 API 호출 실패:', error);
      alert('결제 미리보기 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '200px auto 100px',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'Pretendard, sans-serif',
    },
    contentBox: {
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    icon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
      borderRadius: '50%',
      margin: '0 auto 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '48px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    message: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '30px',
      lineHeight: '1.5',
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '16px',
      color: '#555',
    },
    detailLabel: {
      fontWeight: '600',
    },
    detailValue: {
      textAlign: 'right',
    },
    button: {
      padding: '15px 30px',
      borderRadius: '8px',
      border: 'none',
      background: '#4CAF50',
      color: 'white',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '30px',
      width: '100%',
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <div style={styles.icon}>✔</div>
        <h2 style={styles.title}>즉시 구매 성공!</h2>
        <p style={styles.message}>
          상품이 성공적으로 즉시 구매되었습니다. <br />
          결제를 진행하여 구매를 완료해주세요.
        </p>
        {buyItNowData && (
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>상품명</span>
              <span style={styles.detailValue}>{buyItNowData.productName}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>즉시 구매 가격</span>
              <span style={styles.detailValue}>{formatCurrency(buyItNowData.buyItNowPrice)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>사용 포인트</span>
              <span style={styles.detailValue}>-{buyItNowData.usedPointAmount} P</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>실제 결제 금액</span>
              <span style={styles.detailValue}>{formatCurrency(buyItNowData.actualPaymentAmount)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>적립 예정 포인트</span>
              <span style={styles.detailValue}>+{buyItNowData.pointReward} P</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>남은 포인트</span>
              <span style={styles.detailValue}>{buyItNowData.remainingPoint} P</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>구매 완료 시각</span>
              <span style={styles.detailValue}>{new Date(buyItNowData.completedAt).toLocaleString()}</span>
            </div>
          </div>
        )}
        <button
          style={{
            ...styles.button,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? '로딩 중...' : '최종 결제하러 가기'}
        </button>
      </div>
    </div>
  );
};

const SuccessBidPage: React.FC = () => {
  return (
    <Suspense fallback={
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
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
          }}>
            ⏳
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
          }}>
            로딩 중...
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '30px',
            lineHeight: '1.5',
          }}>
            즉시 구매 정보를 불러오는 중입니다.
          </p>
        </div>
      </div>
    }>
      <SuccessBidContent />
    </Suspense>
  );
};

export default SuccessBidPage;
