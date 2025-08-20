// 파일 경로: app/backoffice/products/[id]/page.tsx (예시)
// 설명: 상품 상세 정보를 표시하는 페이지입니다. API로부터 받아온 데이터를 기반으로 동적으로 UI를 구성합니다.

"use client";

import { useState } from "react";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";

// --- UI 헬퍼 컴포넌트들 ---
// 설명: 페이지 UI를 구성하는 재사용 가능한 작은 부품들입니다.

// 마우스를 올리면 추가 정보를 보여주는 툴팁 UI 컴포넌트
const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <div className="relative inline-block group">
    {children}
    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 text-xs text-white bg-gray-700 rounded-md">
      {text}
    </span>
  </div>
);

// 2열 레이아웃으로 '라벨: 값' 쌍을 표시하는 UI 컴포넌트
const TwoColumnInfoRow = ({
  label1,
  value1,
  label2,
  value2,
}: {
  label1: string;
  value1: React.ReactNode;
  label2: string;
  value2: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 py-3">
    <div>
      <dt className="text-[15px] font-medium text-gray-500">{label1}</dt>
      <dd className="text-xl text-gray-900 mt-1">{value1}</dd>
    </div>
    <div>
      <dt className="text-[15px] font-medium text-gray-500">{label2}</dt>
      <dd className="text-xl text-gray-900 mt-1">{value2}</dd>
    </div>
  </div>
);

// 1열 레이아웃으로 긴 텍스트 항목을 표시하는 UI 컴포넌트
const SingleInfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="py-3">
    <dt className="text-[15px] font-medium text-gray-500">{label}</dt>
    <dd className="text-xl text-gray-900 mt-1">{children}</dd>
  </div>
);

// 상품 이미지와 파일명을 표시하는 UI 컴포넌트
const ProductImageThumbnail = ({
  url,
  alt,
  label,
}: {
  url: string;
  alt: string;
  label: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 relative">
      <Image
        src={url}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
    </div>
    <span className="text-[15px] text-gray-900">{label}</span>
  </div>
);

// --- 메인 페이지 컴포넌트 ---
export default function ProductDetailPage() {
  
  // =================================================================
  // 백엔드 데이터 연동 영역
  // =================================================================

  // 백엔드 API 응답 데이터가 저장될 상태(State) 입니다.
  // 실제로는 useEffect 훅을 사용해 API를 호출하고, 그 응답으로 이 상태를 채웁니다.
  // 백엔드에서는 이 객체 구조에 맞춰 데이터를 보내줘야 합니다.
  const [productData, setProductData] = useState({
    salesCategory: "임시",
    category: "임시",
    productName: "임시",
    size: "임시",
    quantity: "임시",
    material: "임시",
    productionYear: "임시",
    brandName: "임시",
    productCondition: "임시",
    conditionDescription: "임시",
    productDescription: "임시",
    productHistory: "임시",
    expectedEffect: "임시",
    additionalInfo: "임시",
    images: [
      { id: 1, url: "https://via.placeholder.com/150x150.png?text=FrontImage.jpg", label: "FrontImage.jpg" },
      { id: 2, url: "https://via.placeholder.com/150x150.png?text=SideImage.jpg", label: "SideImage.jpg" },
    ],
  });
  
  // [중요] 페이지 UI 구조를 정의하는 '설계도' 배열입니다.
  // 이 배열의 순서와 내용에 따라 화면에 정보가 표시됩니다.
  // 백엔드에서 새로운 필드를 추가하거나 순서를 변경할 때, 프론트엔드에서는 주로 이 배열을 수정하게 됩니다.
  // - type: 'double'(2열), 'single'(1열), 'longText'(긴 텍스트), 'images'(이미지 섹션) 등 렌더링 방식을 결정합니다.
  // - label: 화면에 표시될 제목입니다.
  // - key: productData 상태 객체에서 어떤 데이터를 가져올지 지정하는 키(key)입니다.
  const detailSections = [
    { type: 'double', items: [{ label: "판매 분류", key: "salesCategory" }, { label: "카테고리", key: "category" }] },
    { type: 'single', label: "상품명", key: "productName" },
    { type: 'double', items: [{ label: "사이즈", key: "size" }, { label: "개수", key: "quantity" }] },
    { type: 'double', items: [{ label: "재질", key: "material" }, { label: "생산년도", key: "productionYear" }] },
    { type: 'double', items: [{ label: "브랜드명", key: "brandName" }, { label: "상품 상태 등급", key: "productCondition" }] },
    { type: 'longText', label: "상품 상태 설명", key: "conditionDescription" },
    { type: 'longText', label: "상품 소개", key: "productDescription" },
    { type: 'longText', label: "상품 히스토리 소개", key: "productHistory" },
    { type: 'longText', label: "기대효과", key: "expectedEffect" },
    { type: 'longText', label: "추가 설명", key: "additionalInfo" },
    { type: 'images', label: "상품 이미지", key: "images" },
  ];

  // '임시' 텍스트를 굵게 표시하기 위한 간단한 컴포넌트
  const BoldText = ({ children }: { children: React.ReactNode }) => (
    <strong className="font-bold">{children}</strong>
  );

  // 'productData' 객체에서 키(key)를 이용해 값을 안전하게 가져오는 헬퍼 함수
  const getValue = (key: string) => productData[key as keyof typeof productData];

  // =================================================================
  // 렌더링 영역
  // =================================================================
  return (
    <div className="container mx-auto py-10 px-60">
      <h1 className="text-[25px] font-semibold mb-6">상품 정보</h1>

      <div className="-ml-4">
        <div className="bg-white p-7 rounded-lg">
          
          {/* 설계도 배열(detailSections)을 순회하며 위에서 정의한 데이터(productData)를 기반으로 UI를 동적으로 렌더링합니다. */}
          {detailSections.map((section, index) => {
            // 타입이 'double'인 경우 (한 줄에 두 항목 표시)
            if (section.type === 'double') {
              const item1 = section.items[0];
              const item2 = section.items[1];
              const value2Content = (
                // '상품 상태 등급' 필드는 툴팁 아이콘이 있어 특별 처리
                item2.key === 'productCondition' ? (
                  <div className="flex items-center gap-2">
                    <BoldText>{getValue(item2.key)}</BoldText>
                    <Tooltip text="최상, 상, 중 등급에 대한 가이드입니다.">
                      <FaInfoCircle className="text-gray-400 cursor-pointer" size={16} />
                    </Tooltip>
                  </div>
                ) : <BoldText>{getValue(item2.key)}</BoldText>
              );
              return (
                <TwoColumnInfoRow
                  key={index}
                  label1={item1.label}
                  value1={<BoldText>{getValue(item1.key)}</BoldText>}
                  label2={item2.label}
                  value2={item2.key ? value2Content : ""}
                />
              );
            }

            // 타입이 'single' 또는 'longText'인 경우 (한 줄에 한 항목 표시)
            if (section.type === 'single' || section.type === 'longText') {
              return (
                <SingleInfoRow key={index} label={section.label}>
                  <p className="whitespace-pre-wrap font-bold">{getValue(section.key) as string}</p>
                </SingleInfoRow>
              );
            }
            
            // 타입이 'images'인 경우 (이미지 목록 표시)
            if (section.type === 'images') {
              return (
                <div key={index} className="py-3">
                  <h3 className="text-xl font-bold mb-4">{section.label}</h3>
                  <div className="flex flex-col gap-4">
                    {productData.images.map((image) => (
                      <ProductImageThumbnail
                        key={image.id}
                        url={image.url}
                        alt={image.label}
                        label={image.label}
                      />
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}

        </div>

        {/* 페이지 하단의 주요 액션 버튼 (예: 수정 페이지로 이동) */}
        <div className="flex justify-start mt-8">
          <button className="w-48 h-12 bg-black text-white font-medium ml-[20px]">
            상품 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}