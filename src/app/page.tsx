import { MainBanner } from '@/components/main/MainBanner';
import { NoticeBanner } from '@/components/main/NoticeBanner';
import { ProductGrid } from '@/components/main/ProductGrid';

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <MainBanner />
      <NoticeBanner />
      <ProductGrid searchParams={{ size: 10 }} title='오늘의 경매 상품' />
      <ProductGrid searchParams={{ size: 10 }} title='경매 예정 상품' />
    </main>
  );
}
