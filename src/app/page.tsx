import { MainBanner } from '@/components/main/MainBanner';
import { NoticeBanner } from '@/components/main/NoticeBanner';
import { ProductGrid } from '@/components/main/ProductGrid';

// 임시 데이터 - 나중에 API로 교체
const todayAuctions = [
  {
    id: '1',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: true,
    biddingTime: '00간 입찰',
    timeLeft: '10시간 남음',
    zipFileName: 'geun_k.zip',
    showAlarm: false,
  },
  {
    id: '2',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: false,
    biddingTime: '00간 입찰',
    timeLeft: '10시간 남음',
    zipFileName: 'geun_k.zip',
    showAlarm: false,
  },
  {
    id: '3',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: true,
    biddingTime: '00간 입찰',
    timeLeft: '10시간 남음',
    zipFileName: 'geun_k.zip',
    showAlarm: false,
  },
  {
    id: '4',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: false,
    biddingTime: '00간 입찰',
    timeLeft: '1시간 남음',
    zipFileName: 'geun_k.zip',
    showAlarm: false,
  },
  {
    id: '5',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: true,
    biddingTime: '00간 입찰',
    timeLeft: '10시간 남음',
    zipFileName: 'geun_k.zip',
    showAlarm: false,
  },
];

const upcomingAuctions = [
  {
    id: '6',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: false,
    biddingTime: '00간 입찰',
    timeLeft: '마감',
    zipFileName: 'geun_k.zip',
    showAlarm: true,
  },
  {
    id: '7',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: false,
    biddingTime: '00간 입찰',
    timeLeft: '마감',
    zipFileName: 'geun_k.zip',
    showAlarm: true,
  },
  {
    id: '8',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: true,
    biddingTime: '00간 입찰',
    timeLeft: '마감',
    zipFileName: 'geun_k.zip',
    showAlarm: true,
  },
  {
    id: '9',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: false,
    biddingTime: '00간 입찰',
    timeLeft: '마감',
    zipFileName: 'geun_k.zip',
    showAlarm: true,
  },
  {
    id: '10',
    name: '담요 ㅁ-ㅁ0',
    startPrice: 25000,
    buyNowPrice: 50000,
    image: '/images/sofa.png',
    isPremium: false,
    biddingTime: '00간 입찰',
    timeLeft: '마감',
    zipFileName: 'geun_k.zip',
    showAlarm: true,
  },
];

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <MainBanner />
      <NoticeBanner />
      <ProductGrid products={todayAuctions} title='오늘의 경매 상품' />
      <ProductGrid products={upcomingAuctions} title='경매 예정 상품' />
    </main>
  );
}
