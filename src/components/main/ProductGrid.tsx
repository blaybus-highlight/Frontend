import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  startPrice: number;
  buyNowPrice: number;
  image: string;
  isLiked?: boolean;
  isPremium?: boolean;
  biddingTime?: string;
  timeLeft?: string;
  showAlarm?: boolean; // 알람 아이콘 표시를 위한 prop 추가
}

interface ProductGridProps {
  title: string;
  products: Product[];
}
/**
 *
 * ProductGrid 컴포넌트는 상품 목록을 그리드 형태로 표시합니다.
 */
export function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className='px-6 py-12'>
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-8 text-2xl font-bold text-gray-900'>{title}</h2>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5'>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
