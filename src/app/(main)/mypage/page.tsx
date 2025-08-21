// 파일 경로: app/(main)/mypage/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { Footer } from "react-day-picker";

// --- 개별 UI 컴포넌트 정의 ---

// 1. 마이페이지 사이드바 네비게이션
const MyPageSidebar = () => {
  // 현재 페이지가 '회원정보 관리'임을 명시
  const currentPage = "회원정보 관리"; 
  
  const shoppingLinks = ["구매 내역", "찜한 상품"];
  const infoLinks = ["회원정보 관리", "결제 관리", "배송지 관리", "그루 포인트"];

  const linkClass = (link: string) => {
    const linkIdentifier = link.replace(/ /g, '');
    // 현재 페이지와 링크가 일치하는지 확인
    const isActive = currentPage === linkIdentifier;

    // [수정] 활성화 상태일 경우, hover 효과가 없는 검은색 텍스트를 반환
    if (isActive) {
      return 'font-semibold text-black';
    }
    // 비활성화 상태일 경우, 기존 스타일 유지
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

<Footer />


// --- 메인 마이페이지 컴포넌트 ---
export default function MyPage() {

  const [userData, setUserData] = useState({
    name: "판다",
    id: "qlswmf12",
    level: "새싹",
    progress: 70,
    pointsToNextLevel: 35,
    phone: "010-***-1234",
    password: "••••••••",
    email: "qls*****@naver.com",
    premiumItems: [
      { id: 1, imageUrl: "https://via.placeholder.com/150" },
      { id: 2, imageUrl: "https://via.placeholder.com/150" },
      { id: 3, imageUrl: "https://via.placeholder.com/150" },
      { id: 4, imageUrl: "https://via.placeholder.com/150" },
    ]
  });

  return (
    <div className="bg-white min-h-screen">
      
      {/* [수정] max-w-7xl, mx-auto, px-8 클래스를 모두 제거하고 pl-8만 남겨 오른쪽 여백 제거 */}
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
                <p className="text-m text-gray-500">{userData.name}</p>
                <p className="font-bold text-xl">{userData.id}</p>
              </div>
              <div className="md:col-span-3 p-6 rounded-lg border border-gray-200 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Image src="https://via.placeholder.com/64x64/FFFBEB/FBBF24?text=🐥" alt="아바타" width={64} height={64} />
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">등급 <span className="text-yellow-500">{userData.level}</span></span>
                    <span className="text-gray-400">다음 등급까지 그루 <b className="text-black">{userData.pointsToNextLevel}</b> 남았어요!</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${userData.progress}%` }}></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">{userData.progress}%</div>
                </div>
              </div>
            </div>

            {/* 2. 프리미엄 아이템 리스트 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">프리미엄 아이템 소장 리스트</h2>
                <a href="#" className="text-sm text-gray-500 hover:underline">더보기</a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                {userData.premiumItems.map(item => (
                  <div key={item.id} className="relative aspect-square">
                    <Image src={item.imageUrl} alt={`프리미엄 아이템 ${item.id}`} layout="fill" className="rounded-lg object-cover" />
                    <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">Premium</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 로그인 정보 */}
            <div>
              <h2 className="text-lg font-bold mb-6">로그인 정보</h2>
              <div className="border-t border-gray-200">
                <InfoRowWithButton label="아이디" value={userData.id} />
                <InfoRowWithButton label="휴대폰 번호" value={userData.phone} />
                <InfoRowWithButton label="닉네임" value={userData.name} />
                <InfoRowWithButton label="비밀번호" value={userData.password} />
                <InfoRowWithButton label="이메일" value={userData.email} />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}