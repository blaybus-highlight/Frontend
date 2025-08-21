
"use client";

import { Footer } from "react-day-picker";
import { useMyPage } from "@/hooks/useMyPage";
import { Skeleton } from "@/components/ui/skeleton";

// --- 개별 UI 컴포넌트 정의 ---

// 1. 마이페이지 사이드바 네비게이션
const MyPageSidebar = () => {
  // 현재 페이지가 '회원정보 관리'임을 명시
  const currentPage = "회원정보 관리"; 
  
  const shoppingLinks = ["구매 내역", "찜한 상품"];
  const infoLinks = ["회원정보 관리", "결제 관리", "배송지 관리", "나팔꽃 포인트"];

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

// 3. 로딩 스켈레톤 컴포넌트
const MyPageSkeleton = () => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2 p-6 rounded-lg border border-gray-200">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="md:col-span-3 p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-6">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="w-full">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2.5 w-full mb-1" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
    
    <div>
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="border-t border-gray-200">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex justify-between items-center py-4 border-b-2 border-gray-200">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 flex-1 mx-4" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- 메인 마이페이지 컴포넌트 ---
export default function MyPage() {
  const { data, loading, error } = useMyPage();

  // 등급별 아이콘과 색상 매핑
  const getRankInfo = (rank: string) => {
    switch (rank) {
      case 'SEED':
        return {
          icon: '🌱',
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          progressColor: 'bg-green-400'
        };
      case 'SPROUT':
        return {
          icon: '🌿',
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          progressColor: 'bg-blue-400'
        };
      case 'TREE':
        return {
          icon: '🌳',
          color: 'text-purple-500',
          bgColor: 'bg-purple-100',
          progressColor: 'bg-purple-400'
        };
      default:
        return {
          icon: '🌱',
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          progressColor: 'bg-green-400'
        };
    }
  };

  if (loading) {
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
            <div className="lg:col-span-4">
              <MyPageSkeleton />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
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
            <div className="lg:col-span-4">
              <div className="text-center py-20">
                <p className="text-red-500 text-lg mb-4">오류가 발생했습니다</p>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const rankInfo = getRankInfo(data.rank);

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
                <p className="text-m text-gray-500">{data.nickname}</p>
                <p className="font-bold text-xl">{data.userId}</p>
              </div>
              <div className="md:col-span-3 p-6 rounded-lg border border-gray-200 flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full overflow-hidden ${rankInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{rankInfo.icon}</span>
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">등급 <span className={rankInfo.color}>{data.rankDescription}</span></span>
                    <span className="text-gray-400">다음 등급까지 참여 <b className="text-black">{data.requiredParticipationForNextRank - data.participationCount}</b>회 남았어요!</span>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">포인트</h2>
              </div>
              <div className="p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{data.point.toLocaleString()} 송이</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">총 참여 횟수</p>
                    <p className="text-lg font-bold">{data.participationCount}회</p>
                  </div>
                </div>
              </div>
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

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}