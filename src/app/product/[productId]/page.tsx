import React from 'react';
import ProductInfo from '@/components/product/ProductInfo';
import ProductCard from '@/components/product/ProductCard'; // Import ProductCard
import { Product } from '@/types/product';

const products: Product[] = [
  {
    id: '1',
    premium: false,
    imageUrl: '/images/sofa.png',
    popupTitle: '라이프집 첫 번째 오프라인 팝업',
    name: '라이프집 라운지 패브릭 쇼파 (1)',
    status: '진행중',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
    tags: ['그레이', '라운지'],
    bidCount: 24,
    description: "2025년 여름 성수에서 열린 '라이프집 집들1' 팝업 스토어.",
    currentPrice: 335000,
    startPrice: 230000,
    buyNowPrice: 600000,
    condition: {
      status: '상',
      details: '일부 까짐 있음',
    },
    rewardPoints: '34그루',
    bidHistory: [
      { bidder: 'UserA', price: 335000, time: '13:59:16' },
      { bidder: 'UserB', price: 322000, time: '13:59:00' },
      { bidder: 'UserC', price: 310000, time: '13:57:20' },
      { bidder: 'UserD', price: 300000, time: '13:55:19' },
      { bidder: 'UserE', price: 280000, time: '13:53:46' },
      { bidder: 'UserF', price: 255000, time: '13:52:17' },
      { bidder: 'UserG', price: 225000, time: '13:50:18' },
    ],
    productInfo: {
      name: '패브릭 쇼파',
      size: '가로 180 x 80 (cm), 오차 범위 ±5cm',
      condition: '세탁 완료, 부드러운 촉감의 쿠션 2개 세트',
      composition: '1개',
      material: '패브릭',
    },
    seller: {
      profileImageUrl: '/images/nafals_logo.png',
      name: 'NAFAL',
      tagline: '지속가능한 환경을 고민하는 기업',
      description:
        '지속가능한 라이프스타일을 제안하는 NafaL입니다.\n성수동 팝업스토어 "집들2"에서 실제 사용된 소품들을  특별한 가격으로 만나보세요. 모든 상품은 브랜드  정품이며, 사용감은 있지만 스토리가 담긴  소중한 아이템들입니다',
    },
  },
  {
    id: '2',
    premium: false,
    imageUrl: '/images/sofa.png',
    popupTitle: '라이프집 두 번째 오프라인 팝업',
    name: '라이프집 라운지 패브릭 쇼파 (2)',
    status: '마감',
    tags: ['블랙', '클래식'],
    bidCount: 4,
    description: "2025년 여름 성수에서 열린 '라이프집 집들2' 팝업 스토어.",
    currentPrice: 450000,
    startPrice: 300000,
    buyNowPrice: 700000,
    condition: {
      status: '중',
      details: '사용감 있음',
    },
    rewardPoints: '45그루',
    bidHistory: [
      { bidder: 'UserA', price: 450000, time: '13:59:16' },
      { bidder: 'UserB', price: 400000, time: '13:59:00' },
      { bidder: 'UserC', price: 380000, time: '13:57:20' },
      { bidder: 'UserD', price: 370000, time: '13:55:19' },
    ],
    productInfo: {
      name: '클래식 쇼파',
      size: '가로 200 x 90 (cm), 오차 범위 ±5cm',
      condition: '드라이클리닝 완료',
      composition: '1개',
      material: '가죽',
    },
    seller: {
      profileImageUrl: '/images/nafals_logo.png',
      name: 'NAFAL',
      tagline: '지속가능한 환경을 고민하는 기업',
      description:
        '지속가능한 라이프스타일을 제안하는 NafaL입니다.\n성수동 팝업스토어 "집들2"에서 실제 사용된 소품들을  특별한 가격으로 만나보세요. 모든 상품은 브랜드  정품이며, 사용감은 있지만 스토리가 담긴  소중한 아이템들입니다',
    },
  },
  {
    id: '3',
    premium: false,
    imageUrl: '/images/sofa.png',
    popupTitle: '라이프집 세 번째 오프라인 팝업',
    name: '라이프집 라운지 패브릭 쇼파 (3)',
    status: '예정',
    openDate: '2025년 9월 1일 오픈 예정',
    tags: ['화이트', '모던'],
    bidCount: 0,
    description: "2025년 가을, '라이프집 집들3'에서 만나요.",
    currentPrice: 0,
    startPrice: 400000,
    buyNowPrice: 800000,
    condition: {
      status: '최상',
      details: '미사용 제품',
    },
    rewardPoints: '50그루',
    bidHistory: [],
    productInfo: {
      name: '모던 쇼파',
      size: '가로 220 x 100 (cm), 오차 범위 ±5cm',
      condition: '미사용 새제품',
      composition: '1개',
      material: '패브릭',
    },
    seller: {
      profileImageUrl: '/images/nafals_logo.png',
      name: 'NAFAL',
      tagline: '지속가능한 환경을 고민하는 기업',
      description:
        '지속가능한 라이프스타일을 제안하는 NafaL입니다.\n성수동 팝업스토어 "집들2"에서 실제 사용된 소품들을  특별한 가격으로 만나보세요. 모든 상품은 브랜드  정품이며, 사용감은 있지만 스토리가 담긴  소중한 아이템들입니다',
    },
  },
  {
    id: '4',
    premium: false,
    imageUrl: '/images/sofa.png',
    popupTitle: '라이프집 네 번째 오프라인 팝업',
    name: '라이프집 라운지 패브릭 쇼파 (4)',
    status: '마감임박',
    deadline: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
    tags: ['베이지', '미니멀'],
    bidCount: 42,
    description: "곧 마감되는 '라이프집 집들4' 팝업 스토어!",
    currentPrice: 550000,
    startPrice: 350000,
    buyNowPrice: 750000,
    condition: {
      status: '상',
      details: '스크래치 약간',
    },
    rewardPoints: '40그루',
    bidHistory: [
      { bidder: 'UserA', price: 550000, time: '13:59:16' },
      { bidder: 'UserB', price: 542000, time: '13:59:00' },
      { bidder: 'UserC', price: 520000, time: '13:57:20' },
      { bidder: 'UserD', price: 511000, time: '13:55:19' },
      { bidder: 'UserE', price: 489000, time: '13:53:46' },
      { bidder: 'UserF', price: 477000, time: '13:52:17' },
      { bidder: 'UserG', price: 466000, time: '13:50:18' },
    ],
    productInfo: {
      name: '미니멀 쇼파',
      size: '가로 160 x 80 (cm), 오차 범위 ±5cm',
      condition: '세탁 완료',
      composition: '1개',
      material: '패브릭',
    },
    seller: {
      profileImageUrl: '/images/nafals_logo.png',
      name: 'NAFAL',
      tagline: '지속가능한 환경을 고민하는 기업',
      description:
        '지속가능한 라이프스타일을 제안하는 NafaL입니다.\n성수동 팝업스토어 "집들2"에서 실제 사용된 소품들을  특별한 가격으로 만나보세요. 모든 상품은 브랜드  정품이며, 사용감은 있지만 스토리가 담긴  소중한 아이템들입니다',
    },
  },
  {
    id: '5',
    premium: true,
    imageUrl: '/images/sofa.png',
    popupTitle: '라이프집 다섯 번째 오프라인 팝업',
    name: '라이프집 라운지 패브릭 쇼파 (5)',
    status: '진행중',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 48 hours from now
    tags: ['레드', '프리미엄'],
    bidCount: 50,
    description: "프리미엄 고객을 위한 '라이프집 집들5' 팝업 스토어!",
    currentPrice: 1000000,
    startPrice: 800000,
    buyNowPrice: 1500000,
    condition: {
      status: '최상',
      details: '미사용 제품',
    },
    rewardPoints: '100그루',
    bidHistory: [
      { bidder: 'UserA', price: 1000000, time: '13:59:16' },
      { bidder: 'UserB', price: 980000, time: '13:59:00' },
      { bidder: 'UserC', price: 965000, time: '13:57:20' },
      { bidder: 'UserD', price: 944000, time: '13:55:19' },
      { bidder: 'UserE', price: 923000, time: '13:53:46' },
      { bidder: 'UserF', price: 911000, time: '13:52:17' },
      { bidder: 'UserG', price: 899000, time: '13:50:18' },
    ],
    productInfo: {
      name: '프리미엄 쇼파',
      size: '가로 250 x 100 (cm), 오차 범위 ±5cm',
      condition: '최고급 소재, 장인 제작',
      composition: '1개',
      material: '최고급 가죽',
    },
    seller: {
      profileImageUrl: '/images/nafals_logo.png',
      name: 'NAFAL',
      tagline: '지속가능한 환경을 고민하는 기업',
      description:
        '지속가능한 라이프스타일을 제안하는 NafaL입니다.\n성수동 팝업스토어 "집들2"에서 실제 사용된 소품들을  특별한 가격으로 만나보세요. 모든 상품은 브랜드  정품이며, 사용감은 있지만 스토리가 담긴  소중한 아이템들입니다',
    },
  },
];

const ProductDetailPage = ({ params }: { params: { productId: string } }) => {
  const product = products.find((p) => p.id === params.productId);

  // Filter out the current product and get up to 4 related products
  const relatedProducts = products
    .filter((p) => p.id !== params.productId)
    .slice(0, 4);

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className='mx-auto p-[64px]'>
      <section>
        <ProductInfo product={product} />
      </section>

      {/* Related Products Section */}
      <section className='mt-[40px]'>
        <h2 className='mb-[40px] text-[20px] font-bold text-[#333]'>
          📦 다른 고객이 함께 본 상품
        </h2>
        <div className='grid grid-cols-1 gap-[8px] lg:grid-cols-4'>
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;