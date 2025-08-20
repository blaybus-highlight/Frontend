// 파일 경로: app/backoffice/products/[id]/page.tsx (예시)

"use client";

import { useState } from "react";
import Image from "next/image"; // Next.js의 최적화된 이미지 컴포넌트 사용

// --- 단일 정보 항목 컴포넌트 (모든 항목에 사용) ---
// 라벨을 상단에, 값을 하단에 배치하여 개별 항목처럼 보이게 합니다.
const InfoBlock = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col py-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-900 mt-1">{children}</dd>
  </div>
);

// --- 메인 페이지 컴포넌트 ---
export default function ProductInfoPage() {
  const [productData, setProductData] = useState({
    salesCategory: "경매 상품",
    category: "도자기",
    productName: "조선백자 달항아리",
    size: "높이 45cm, 지름 42cm",
    quantity: "1",
    material: "백자토, 투명유",
    productionYear: "18세기 후반",
    brandName: "조선 왕실 가마",
    productCondition: "A+ (최상급)",
    conditionDescription: "유약의 빙렬이 고르고, 형태의 비대칭성이 아름다우며, 파손이나 수리 흔적 없음.",
    productDescription: "순백의 태토와 투명한 유약이 어우러져 은은한 유백색을 띠는 조선 후기 백자 달항아리입니다. 넉넉하고 편안한 형태는 조선 백자의 미학을 대표합니다.",
    productHistory: "1920년대 일본인 수집가에 의해 반출되었으나, 2010년 국내 경매를 통해 환수됨. 전 소장자는 국립중앙박물관에 장기 대여한 바 있음.",
    expectedEffect: "한국 전통 미의 정수를 보여주는 작품으로, 공간의 품격을 높이고 높은 예술적 가치를 지님.",
    additionalInfo: "오동나무 보관함 및 전문가 감정서 포함.",
    images: [
      { id: 1, url: "https://via.placeholder.com/600x600.png?text=Main+Image", primary: true },
      { id: 2, url: "https://via.placeholder.com/150x150.png?text=Side+View", primary: false },
      { id: 3, url: "https://via.placeholder.com/150x150.png?text=Bottom+View", primary: false },
      { id: 4, url: "https://via.placeholder.com/150x150.png?text=Detail+Shot", primary: false },
    ]
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">상품 정보</h1>

      {/* 흰색 박스 컨테이너: 그림자 제거 */}
      <div className="bg-white rounded-lg p-6 sm:p-8">
        {/* 모든 항목을 개별적으로 배치 */}
        <InfoBlock label="판매 분류">{productData.salesCategory}</InfoBlock>
        <InfoBlock label="카테고리">{productData.category}</InfoBlock>
        <InfoBlock label="상품명">{productData.productName}</InfoBlock>
        <InfoBlock label="사이즈">{productData.size}</InfoBlock>
        <InfoBlock label="개수">{productData.quantity}</InfoBlock>
        <InfoBlock label="재질">{productData.material}</InfoBlock>
        <InfoBlock label="생산년도">{productData.productionYear}</InfoBlock>
        <InfoBlock label="브랜드명">{productData.brandName}</InfoBlock>
        <InfoBlock label="상품 상태 등급">{productData.productCondition}</InfoBlock>
        <InfoBlock label="상품 상태 설명">
          <p className="whitespace-pre-wrap">{productData.conditionDescription}</p>
        </InfoBlock>
        <InfoBlock label="상품 소개">
          <p className="whitespace-pre-wrap">{productData.productDescription}</p>
        </InfoBlock>
        <InfoBlock label="상품 히스토리 소개">
          <p className="whitespace-pre-wrap">{productData.productHistory}</p>
        </InfoBlock>
        <InfoBlock label="기대효과">
          <p className="whitespace-pre-wrap">{productData.expectedEffect}</p>
        </InfoBlock>
        <InfoBlock label="추가설명">
          <p className="whitespace-pre-wrap">{productData.additionalInfo}</p>
        </InfoBlock>
        
        {/* 상품 이미지 섹션 */}
        <InfoBlock label="상품 이미지">
          <div className="flex flex-col gap-4">
            {/* 대표 이미지 */}
            <div className="w-full max-w-md overflow-hidden">
              <Image
                src={productData.images.find(img => img.primary)?.url || productData.images[0]?.url || ''}
                alt={productData.productName}
                width={600}
                height={600}
                className="object-cover w-full h-auto"
              />
            </div>
            {/* 추가 이미지 (썸네일) */}
            <div className="flex flex-wrap gap-2">
              {productData.images.map((image) => (
                <div key={image.id} className="w-24 h-24 overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`${productData.productName} - ${image.id}`}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </InfoBlock>
      </div>
    </div>
  );
}