"use client"

import { Input } from '@/components/ui/input';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { processPayment } from '@/api/payments';

// --- 데이터 타입 및 목업 데이터 정의 ---

interface Product {
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

const defaultProductData: Product = {
  name: '홍익대 예술대 졸업작품전 출품작 20',
  category: '회화/캔버스',
  quantity: 1,
  price: 120000,
  imageUrl: 'https://via.placeholder.com/100',
};

const defaultShippingFee = 6000;
const defaultDiscount = 32;

// --- 스타일 정의 컴포넌트 ---

const StyleProvider = () => {
  const css = `
    .checkoutPageContainer {
      width: 100%;
      max-width: 1500px;
      padding: 20px;
      font-family: 'Pretendard', sans-serif;
      color: #333;
      /* [수정] Footer와의 간격을 위해 기존 margin(40px auto)에 bottom 값(100px)을 추가 */
      margin: 40px auto 100px;
    }
    .checkoutMainTitle {
      font-size: 30px;
      color: black;
      font-weight: 700;
      text-align: center;
      margin-bottom: 24px;
      margin-top: 160px;
    }
    .checkoutContentWrapper {
      display: flex;
      justify-content: space-between;
      gap: 60px;
    }
    .checkoutLeftSection, .checkoutRightSection {
      flex: 1;
    }
    .checkoutSectionTitle {
      font-size: 20px;
      padding-bottom: 12px;
      margin-bottom: 0px;
      font-weight: bold;
      /* [수정] 잘못된 문법(color-black;)을 올바르게 수정 */
      color: black;
    }
    .title-left { text-align: left; }
    .title-center { text-align: center; }
    .checkoutProductInfo {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .checkoutProductImage {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      background-color: #f0f0f0;
      border: 1px solid #e0e0e0;
    }
    .checkoutProductDetails {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .checkoutProductName { font-size: 16px; font-weight: 600; }
    .checkoutProductCategory, .checkoutProductQuantity { font-size: 14px; color: #666; }
    .checkoutPriceList {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .checkoutPriceItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }
    .checkoutPriceItem dt { color: #555; }
    .checkoutPriceItem dd { font-weight: 500; }
    .checkoutTotalPrice { margin-top: 20px; }
    .checkoutTotalPrice dt { font-size: 18px; font-weight: 700; color: #333; }
    .checkoutTotalPrice dd { font-size: 24px; font-weight: 800; color: #000; }
    .checkoutPaymentMethodBox {
      padding: 20px;
      min-height: 320px;
      display: flex;
      align-items: flex-start; 
      justify-content: center;
      background-color: #EEEEEE;
    }
    .checkoutPaymentButton {
      width: 100%;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .checkoutPaymentButton:hover { background-color: #f7f7f7; }
    .checkoutPaymentLogo {
      display: inline-block;
      width: 24px;
      height: 18px;
      background: linear-gradient(135deg, #6c8cff 50%, transparent 50%), linear-gradient(45deg, #4a6bff 50%, #89a3ff 50%);
      background-size: 50% 100%;
      background-repeat: no-repeat;
      background-position: left, right;
      border-radius: 3px;
    }
    
         /* 배송 정보 스타일 */
     .checkoutShippingSection {
       margin-top: 40px;
       padding-top: 30px;
       border-top: 1px solid #eee;
     }
                 .checkoutShippingInfo {
        background-color: white;
        border-radius: 8px;
        padding: 15px 14px;
      }
      .checkoutShippingRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .checkoutShippingRow:last-child {
        margin-bottom: 0;
      }
      .checkoutShippingLabel {
        font-size: 14px;
        color: #666;
        min-width: 60px;
      }
      .checkoutShippingValue {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        flex: 1;
        text-align: right;
      }
     .checkoutShippingInput {
       flex: 1;
       padding: 8px 12px;
       border: 1px solid #ddd;
       border-radius: 4px;
       font-size: 14px;
       background-color: white;
     }
     .checkoutShippingInput:focus {
       outline: none;
       border-color: #007bff;
     }
           .checkoutShippingMemo {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;
        display: flex;
      }
      .checkoutShippingMemoInput {
  /* 1. width를 100%에서 원하는 고정 너비로 변경 */
  width: 500px; /* ← 원하는 길이로 조절하세요 */

  /* 2. 이 속성을 추가하여 요소를 오른쪽으로 밀어냅니다 */
  margin-left: auto; 

  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.checkoutShippingMemoInput:focus {
  outline: none;
  border-color: #007bff;
}
     
     @media (max-width: 768px) {
       .checkoutContentWrapper {
         flex-direction: column;
         gap: 40px;
       }
     }
  `;
  return <style>{css}</style>;
};

// 숫자를 '원' 단위의 통화 형식으로 변환하는 헬퍼 함수
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + ' 원';
};

// --- [리팩토링] 작은 단위의 UI 컴포넌트들 ---

// 1. 주문 상품 정보 컴포넌트
const OrderSummary: React.FC<{ product: Product }> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="checkoutProductInfo">
      <img 
        src={imageError ? 'https://via.placeholder.com/100x100?text=이미지' : product.imageUrl} 
        alt={product.name} 
        className="checkoutProductImage"
        onError={handleImageError}
      />
      <div className="checkoutProductDetails">
        <p className="checkoutProductName">{product.name}</p>
        <p className="checkoutProductCategory">{product.category}</p>
        <p className="checkoutProductQuantity">수량 {product.quantity}개</p>
      </div>
    </div>
  );
};

// 2. 가격 정보 컴포넌트
const PriceDetails: React.FC<{ productPrice: number, shipping: number, discountAmount: number, total: number }> = ({ productPrice, shipping, discountAmount, total }) => {
  return (
    <div className="checkoutPriceSummary">
      <dl className="checkoutPriceList">
        <div className="checkoutPriceItem">
          <dt>상품가격</dt>
          <dd>{formatCurrency(productPrice)}</dd>
        </div>
        <div className="checkoutPriceItem">
          <dt>배송비</dt>
          <dd>{formatCurrency(shipping)}</dd>
        </div>
        <div className="checkoutPriceItem">
          <dt>나눔꽃 사용</dt>
          <dd>-{discountAmount} 송이</dd>
        </div>
      </dl>
      <div className="checkoutPriceItem checkoutTotalPrice">
        <dt>총 결제 금액</dt>
        <dd>{formatCurrency(total)}</dd>
      </div>
    </div>
  );
};

// 3. 결제 방법 컴포넌트
const PaymentMethod: React.FC<{
  auctionId: number | null;
  totalPrice: number;
  shippingFee: number;
  discount: number;
  isProcessing: boolean;
  onPaymentProcess: () => void;
}> = ({ auctionId, totalPrice, shippingFee, discount, isProcessing, onPaymentProcess }) => {
  const router = useRouter();

  const handlePayment = async () => {
    if (!auctionId) {
      alert('경매 정보를 찾을 수 없습니다.');
      return;
    }

    console.log('결제 요청 auctionId:', auctionId);

    try {
      onPaymentProcess();
      const response = await processPayment(auctionId);
      
      if (response.success) {
        console.log('결제 성공:', response.data);
        alert('결제가 완료되었습니다!');
        // 결제 완료 후 백엔드에서 계산된 등급별 적립 포인트를 catch 페이지로 전달
        const pointReward = response.data.pointReward || 0;
        router.push(`/catch?points=${pointReward}`);
      } else {
        alert(`결제 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      onPaymentProcess();
    }
  };

  return (
    <div className="checkoutPaymentMethodBox">
      <button 
        className="checkoutPaymentButton" 
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
      >
        <span className="checkoutPaymentLogo"></span>
        {isProcessing ? '결제 처리 중...' : 'payments'}
      </button>
    </div>
  );
};

// 4. 배송 정보 컴포넌트
const ShippingInfo: React.FC<{ 
  shippingData: {
    name: string;
    phone: string;
    address: string;
    zipCode: string;
    memo: string;
  };
  onShippingDataChange: (field: string, value: string) => void;
}> = ({ shippingData, onShippingDataChange }) => (
  <div className="checkoutShippingSection">
    <h2 className="checkoutSectionTitle title-left">배송 정보</h2>
    <div className="checkoutShippingInfo">
      <div className="checkoutShippingRow">
        <span className="checkoutShippingLabel">받는 사람</span>
        <span className="checkoutShippingValue">{shippingData.name}</span>
      </div>
      <div className="checkoutShippingRow">
        <span className="checkoutShippingLabel">전화번호</span>
        <span className="checkoutShippingValue">{shippingData.phone}</span>
      </div>
      <div className="checkoutShippingRow">
        <span className="checkoutShippingLabel">주소</span>
        <span className="checkoutShippingValue">
          {shippingData.address} ({shippingData.zipCode})
        </span>
      </div>
      <div className="checkoutShippingMemo">
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          배송 메모
        </label>
        <Input
          type="text"
          className="checkoutShippingMemoInput"
          placeholder="배송 시 요청사항을 입력해주세요 (예: 도착시 문자 주세요)"
          value={shippingData.memo}
          onChange={(e) => onShippingDataChange('memo', e.target.value)}
        />
      </div>
    </div>
  </div>
);




// --- [리팩토링] 메인 컴포넌트 ---

const CheckoutPage: React.FC = () => {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState(defaultProductData);
  const [shippingFee, setShippingFee] = useState(defaultShippingFee);
  const [discount, setDiscount] = useState(defaultDiscount);
  const [totalPrice, setTotalPrice] = useState(defaultProductData.price + defaultShippingFee - defaultDiscount);
  const [auctionId, setAuctionId] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // 배송 정보 상태 관리
  const [shippingData, setShippingData] = React.useState({
    name: '김이원',
    phone: '010-1234-5678',
    address: '서울특별시 서대문구 북아현로 22 3층',
    zipCode: '08198',
    memo: '도착시 문자 주세요'
  });

  // URL 파라미터에서 결제 미리보기 데이터 추출
  useEffect(() => {
    console.log('useEffect 실행됨');
    const previewParam = searchParams.get('preview');
    console.log('previewParam:', previewParam);
    
    if (previewParam) {
      try {
        const parsedPreview = JSON.parse(decodeURIComponent(previewParam));
        console.log('받은 preview 데이터:', parsedPreview);
        
        // 상품 데이터 업데이트
        setProductData({
          ...defaultProductData,
          name: parsedPreview.productName || defaultProductData.name,
          category: '경매 상품', // 카테고리 기본값 설정
          price: parsedPreview.winningBidAmount || parsedPreview.productPrice || defaultProductData.price,
          imageUrl: parsedPreview.productImageUrl || defaultProductData.imageUrl
        });
        
        // 배송비, 할인, 총액 업데이트
        const newShippingFee = parsedPreview.shippingFee || defaultShippingFee;
        // 포인트가 0이어도 그대로 사용 (기본값 사용하지 않음)
        const newDiscount = parsedPreview.maxUsablePoint !== undefined ? parsedPreview.maxUsablePoint : 
                           parsedPreview.userPoint !== undefined ? parsedPreview.userPoint : 0;
        const newTotal = parsedPreview.actualPaymentAmount || 
          ((parsedPreview.winningBidAmount || parsedPreview.productPrice || 0) + newShippingFee - newDiscount);
        
        setShippingFee(newShippingFee);
        setDiscount(newDiscount);
        setTotalPrice(newTotal);
        setAuctionId(parsedPreview.auctionId);

        // 배송 정보 업데이트 (기본값 사용)
        if (parsedPreview.shippingAddress) {
          setShippingData({
            name: parsedPreview.shippingAddress.name || '김이원',
            phone: parsedPreview.shippingAddress.phone || '010-1234-5678',
            address: parsedPreview.shippingAddress.address || '서울특별시 서대문구 북아현로 22 3층',
            zipCode: parsedPreview.shippingAddress.zipCode || '08198',
            memo: parsedPreview.shippingAddress.memo || '도착시 문자 주세요'
          });
        }
      } catch (error) {
        console.error('결제 미리보기 데이터 파싱 실패:', error);
      }
    }
  }, [searchParams]);

  // 배송 정보 변경 핸들러
  const handleShippingDataChange = (field: string, value: string) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  console.log('현재 상태:', { productData, shippingFee, discount, totalPrice, auctionId });
  
  return (
    <>
      <StyleProvider />
      <div className="checkoutPageContainer">
        <h1 className="checkoutMainTitle">결제하기</h1>
        <div className="checkoutContentWrapper">
          
          {/* 왼쪽: 결제 상품 정보 및 배송 정보 섹션 */}
          <section className="checkoutLeftSection">
            <h2 className="checkoutSectionTitle title-left">결제상품</h2>
            {/* 분리된 컴포넌트 사용 */}
            <OrderSummary product={productData} />
            <PriceDetails 
              productPrice={productData.price} 
              shipping={shippingFee} 
              discountAmount={discount}
              total={totalPrice}
            />
            
                         {/* 배송 정보 섹션 추가 */}
             <ShippingInfo
               shippingData={shippingData}
               onShippingDataChange={handleShippingDataChange}
             />
          </section>

                     {/* 오른쪽: 결제 방법 섹션 */}
           <section className="checkoutRightSection">
             <h2 className="checkoutSectionTitle title-center">결제방법</h2>
             {/* 분리된 컴포넌트 사용 */}
             <PaymentMethod 
               auctionId={auctionId}
               totalPrice={totalPrice}
               shippingFee={shippingFee}
               discount={discount}
               isProcessing={isProcessingPayment}
               onPaymentProcess={() => setIsProcessingPayment(!isProcessingPayment)}
             />
           </section>

        </div>
             </div>
     </>
   );
 };

// Suspense로 감싼 컴포넌트
const CheckoutPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CheckoutPage />
    </Suspense>
  );
};

export default CheckoutPageWithSuspense;