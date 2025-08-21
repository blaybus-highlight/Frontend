"use client"

import React, { useEffect, useState } from 'react';
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

const BidSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buyItNowData, setBuyItNowData] = useState<BuyItNowData | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // URL 파라미터에서 데이터 추출
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setBuyItNowData(parsedData);
      } catch (error) {
        console.error('데이터 파싱 실패:', error);
      }
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!buyItNowData?.auctionId) {
      alert('경매 정보를 찾을 수 없습니다.');
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
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        낙찰을 축하드려요!
      </h1>
      <p style={styles.subtitle}>
        최종 결제까지 D-3일 남았어요.
        <br />
        잊지 말고 32그루와 함께 받아가세요.
      </p>
      <div style={styles.imageContainer}>
        {/* public 폴더에 이미지를 넣고 경로를 지정해주세요. 예: /blanket.png */}
        <img
          src="/your-image-path.png"
          alt="Patterned Blanket"
          style={styles.image}
        />
      </div>
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
  );
};

// 스타일을 변수로 분리하여 가독성을 높였습니다.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textAlign: 'center',
    padding: '40px 20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555555',
    lineHeight: 1.6,
    marginBottom: '40px',
  },
  imageContainer: {
    marginBottom: '40px',
  },
  image: {
    maxWidth: '350px',
    width: '100%',
    height: 'auto',
  },
  button: {
    width: '100%',
    maxWidth: '400px',
    padding: '18px 20px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};

export default BidSuccessPage;