import { MainBanner } from '@/components/main/MainBanner';
import { NoticeBanner } from '@/components/main/NoticeBanner';
import { ProductGrid } from '@/components/main/ProductGrid';
import { CombinedRanking } from '@/components/main/CombinedRanking';

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <MainBanner />
      <NoticeBanner />
      <ProductGrid searchParams={{ size: 5, status: 'IN_PROGRESS' }} title='오늘의 경매 상품' />
      <CombinedRanking />
      <ProductGrid searchParams={{ size: 5, status: 'SCHEDULED' }} title='경매 예정 상품' />
    </main>
  );
}
