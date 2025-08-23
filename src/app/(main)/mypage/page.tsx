"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaYoutube, FaInstagram } from "react-icons/fa";
// [백엔드 연동] 1. 실제 데이터 통신을 위한 커스텀 훅과 로딩 UI를 다시 import 합니다.
import { useMyPage } from "@/hooks/useMyPage";
import { Skeleton } from "@/components/ui/skeleton";

// --- 개별 UI 컴포넌트 정의 ---

// 1. 마이페이지 사이드바 네비게이션
const MyPageSidebar = () => {
  const currentPage = "회원정보 관리"; 
  
  const shoppingLinks = ["구매 내역", "찜한 상품"];
  const infoLinks = ["회원정보 관리", "결제 관리", "배송지 관리", "나팔꽃 포인트"];

  const linkClass = (link: string) => {
    const linkIdentifier = link.replace(/ /g, '');
    const isActive = currentPage === linkIdentifier;

    if (isActive) {
      return 'font-semibold text-black';
    }
    return 'text-gray-400 hover:text-gray-900';
  };

  return (
    <aside>
      <div className="mb-10">
        <h2 className="font-bold mb-3 text-2xl">나의 쇼핑</h2>
        <div className="flex flex-col gap-1">
          {shoppingLinks.map(link => <a key={link} href="#" className={`${linkClass(link)} py-1.5 rounded-md text-base font-bold px-1`}>{link}</a>)}
        </div>
      </div>
      <div>
        <h2 className="font-bold mb-3 text-2xl">내 정보</h2>
        <div className="flex flex-col gap-1">
          {infoLinks.map(link => <a key={link} href="#" className={`${linkClass(link)} py-1.5 rounded-md text-base font-bold px-1`}>{link}</a>)}
        </div>
      </div>
    </aside>
  );
};

// 2. 로그인 정보 행 컴포넌트
const InfoRowWithButton = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-4 border-b-2 border-gray-200">
    <span className="text-m text-gray-500 w-40">{label}</span>
    <span className="flex-1 text-m font-medium">{value}</span>
    <button className="border px-5 py-2 text-m font-bold hover:bg-gray-100">
      변경
    </button>
  </div>
);

// 3. 푸터 컴포넌트
const Footer = () => (
  <footer className="bg-white py-12 px-8 border-t mt-20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
      <div className="space-y-4">
        <div className="text-2xl font-bold">NAFAL</div>
        <p className="text-gray-500">믿을 수 있는 가치 플랫폼, 나팔<br/>갖고 싶은 한정판 제품은 다 나팔에서</p>
        <div className="flex gap-4">
          <a href="#"><FaYoutube size={20} className="text-gray-400 hover:text-black" /></a>
          <a href="#"><FaInstagram size={20} className="text-gray-400 hover:text-black" /></a>
        </div>
      </div>
      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-3">고객센터</h3>
          <ul className="space-y-2 text-gray-500">
            <li>02-786-8978</li>
            <li>support@nafal.kr</li>
            <li>평일 10:00 - 18:00</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">서비스</h3>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#" className="hover:underline">회사소개</a></li>
            <li><a href="#" className="hover:underline">검수기준</a></li>
            <li><a href="#" className="hover:underline">페널티정책</a></li>
            <li><a href="#" className="hover:underline">제휴문의</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-8 pt-8 border-t flex justify-between text-xs text-gray-400">
      <span>©2024 NAFAL. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="#" className="hover:underline">이용약관</a>
        <a href="#" className="hover:underline">개인정보처리방침</a>
      </div>
    </div>
  </footer>
);

// 4. 아이템 구매 카드 컴포넌트
const PurchaseItemCard = ({ imageUrl, title, price }: { imageUrl: string; title: string; price: string; }) => (
    <div className="w-[200px] h-[180px] border border-gray-200 flex flex-col overflow-hidden">
        <div className="h-3/5 relative mt-[3px] mx-[3px]">
            <Image
                src={imageUrl}
                alt={title}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="flex-grow flex flex-col items-center justify-center px-2 py-1">
            <p className="text-black text-m text-center leading-tight">{title}</p>
            <p className="text-gray-600 text-base mt-1">{price}</p>
        </div>
        <button className="w-full h-[30px] bg-black text-white font-bold text-sm mt-auto flex-shrink-0">
            구매하기
        </button>
    </div>
);

// 5. 로딩 상태 UI (스켈레톤)
const MyPageSkeleton = () => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2 p-6 rounded-lg border border-gray-200"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-6 w-32" /></div>
      <div className="md:col-span-3 p-6 rounded-lg border border-gray-200"><div className="flex items-center gap-6"><Skeleton className="w-16 h-16 rounded-full" /><div className="w-full"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-2.5 w-full mb-1" /><Skeleton className="h-4 w-12 ml-auto" /></div></div></div>
    </div>
    <div><Skeleton className="h-6 w-48 mb-4" /><div className="grid grid-cols-2 md:grid-cols-4 gap-1">{[1, 2, 3].map(i => (<Skeleton key={i} className="aspect-square rounded-lg" />))}</div></div>
    <div><Skeleton className="h-6 w-32 mb-6" /><div className="border-t border-gray-200">{[1, 2, 3, 4, 5].map(i => (<div key={i} className="flex justify-between items-center py-4 border-b-2 border-gray-200"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 flex-1 mx-4" /><Skeleton className="h-8 w-16" /></div>))}</div></div>
  </div>
);


// --- 메인 마이페이지 컴포넌트 ---
export default function MyPage() {
  // [백엔드 연동] 2. useMyPage 훅을 호출하여 실제 데이터를 받아옵니다.
  // 이 훅은 { data, loading, error } 객체를 반환해야 합니다.
  const { data, loading, error } = useMyPage();

  // =================================================================
  // [백엔드] 백엔드 개발자는 이 부분을 주목해주세요.
  // =================================================================
  // '아이템 구매' 섹션에 표시될 데이터입니다.
  // 현재는 프론트엔드에 고정되어 있지만, 이 데이터를 별도의 API로 제공하거나
  // 위의 useMyPage()가 반환하는 data 객체 안에 포함시켜 동적으로 관리할 수 있습니다.
  const purchaseItemsData = [
    { id: 1, imageUrl: "https://via.placeholder.com/200x120/cccccc/888888?text=Item+1", title: "낙찰 성공 시 나팔꽃 X2 적립", price: "나팔꽃 15송이" },
    { id: 2, imageUrl: "https://via.placeholder.com/200x120/cccccc/888888?text=Item+2", title: "동 가격 입찰시 우선권", price: "나팔꽃 30송이" },
    { id: 3, imageUrl: "https://via.placeholder.com/200x120/cccccc/888888?text=Item+3", title: "나무 1그루 기부", price: "나팔꽃 10송이" },
  ];

  // 등급별로 다른 이미지와 색상을 적용하기 위한 함수
  const getRankInfo = (rank: string) => {
    switch (rank) {
      case 'SEED':
        return { image: '/images/rank/seedRank.png', color: 'text-green-500', bgColor: 'bg-green-100', progressColor: 'bg-green-400' };
      // 다른 등급 케이스 추가...
      default:
        return { image: '/images/rank/seedRank.png', color: 'text-green-500', bgColor: 'bg-green-100', progressColor: 'bg-green-400' };
    }
  };

  // 로딩 중일 때 스켈레톤 UI를 표시합니다.
  if (loading) {
    return (
        <main className="py-10 pl-8">
          <div className="flex items-baseline gap-4 mb-8"><h1 className="text-3xl font-bold">마이페이지</h1><h2 className="text-2xl text-black font-bold px-14">회원정보 관리</h2></div>
          <div className="grid grid-cols-1 lg:grid-cols-6"><div className="lg:col-span-1"><MyPageSidebar /></div><div className="lg:col-span-4"><MyPageSkeleton /></div></div>
        </main>
    );
  }

  // 데이터 로딩 중 에러가 발생했을 때 메시지를 표시합니다.
  if (error) {
    return <div className="text-center py-20 text-red-500">오류가 발생했습니다: {error}</div>;
  }

  // 로딩이 끝났지만 데이터가 없는 경우를 처리합니다.
  if (!data) {
    return <div className="text-center py-20">사용자 정보를 불러올 수 없습니다.</div>;
  }

  const rankInfo = getRankInfo(data.rank);

  return (
    <div className="bg-white min-h-screen">
      <main className="py-10 pl-8">
        <div className="flex items-baseline gap-4 mb-8">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <h2 className="text-2xl text-black font-bold px-14">회원정보 관리</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <MyPageSidebar />
          </div>

          <div className="lg:col-span-4 space-y-10">
            
            {/* 1. 프로필 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 p-6 rounded-lg border border-gray-200 flex flex-col justify-center">
                <p className="text-m text-gray-500">{data.nickname}</p>
                <p className="font-bold text-xl">{data.userId}</p>
              </div>
              <div className="md:col-span-3 p-6 rounded-lg border border-gray-200 flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full overflow-hidden ${rankInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Image src={rankInfo.image} alt={`${data.rankDescription} 등급`} width={48} height={48} className="object-contain" />
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">등급 <span className={rankInfo.color}>{data.rankDescription}</span></span>
                    <span className="text-gray-400">다음 등급까지 참여 <b className="text-black">{data.requiredParticipationForNextRank}</b>회 남어요!</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`${rankInfo.progressColor} h-2.5 rounded-full`} style={{ width: `${data.rankProgress}%` }}></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">{data.rankProgress}%</div>
                </div>
              </div>
            </div>

            {/* 2. 포인트 정보 */}
            <div>
              <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">포인트</h2></div>
              <div className="p-6 rounded-lg border border-gray-200"><div className="flex items-center justify-between"><div><p className="text-2xl font-bold text-green-600">{data.point.toLocaleString()} 송이</p></div><div className="text-right"><p className="text-gray-500 text-sm">총 참여 횟수</p><p className="text-lg font-bold">{data.participationCount}회</p></div></div></div>
            </div>

            {/* 3. 로그인 정보 */}
            <div>
              <h2 className="text-lg font-bold mb-6">로그인 정보</h2>
              <div className="border-t border-gray-200">
                <InfoRowWithButton label="아이디" value={data.userId} />
                <InfoRowWithButton label="닉네임" value={data.nickname} />
                <InfoRowWithButton label="휴대폰 번호" value={data.maskedPhoneNumber} />
                <InfoRowWithButton label="이메일" value={data.maskedEmail} />
                <InfoRowWithButton label="비밀번호" value="••••••••" />
              </div>
            </div>

            {/* 4. 아이템 구매 섹션 */}
            <div>
                <h2 className="text-lg font-bold mb-6">아이템 구매</h2>
                <div className="flex flex-wrap gap-4">
                    {purchaseItemsData.map(item => (
                        <PurchaseItemCard 
                            key={item.id} 
                            imageUrl={item.imageUrl}
                            title={item.title}
                            price={item.price}
                        />
                    ))}
                </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
