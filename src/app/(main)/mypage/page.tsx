"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaYoutube, FaInstagram } from "react-icons/fa";
// [백엔드 연동] 1. 실제 데이터 통신을 위한 커스텀 훅과 로딩 UI를 다시 import 합니다.
import { useMyPage } from "@/hooks/useMyPage";
import { Skeleton } from "@/components/ui/skeleton";


// --- 타입 정의 추가 ---
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface NapalflowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUse: () => void;
}

interface NapalflowerUseCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowAutoModal: () => void;
}

interface TreeDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriorityAutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUse: () => void;
}

interface PurchaseItem {
  id: number;
  imageUrl: string;
  title: string;
  price: string;
  quantity: number;
  quantityType: string;
  modalType: 'napalflower' | 'priority' | 'tree';
}

// --- 개별 UI 컴포넌트 정의 ---

// --- 모달 컴포넌트들 추가 ---
const ModalWrapper = ({ isOpen, onClose, children }: ModalWrapperProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-12 max-w-lg w-full">
        {children}
      </div>
    </div>
  );
};

// 1. 나팔꽃 2배 적립 모달
const NapalflowerModal = ({ isOpen, onClose, onUse }: NapalflowerModalProps) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-xl md:text-2xl font-bold">아이템 구매 완료</h3>
        <p className="text-center text-sm md:text-base text-gray-700">
          아이템 적용 시 낙찰 성공 시 나팔꽃이 2배 적립됩니다<br />
          유효기간 - 8/29 까지 사용가능
        </p>
        <div className="flex w-full gap-4">
          <button
            onClick={onUse}
            className="flex-1 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
          >
            <span className="text-xs font-bold">지금 사용(보유 2개)</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-none hover:bg-gray-300 transition-colors"
          >
            <span className="text-xs font-bold">다음에 사용</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 2. 나팔꽃 2배 적립 - 사용 완료 모달
const NapalflowerUseCompleteModal = ({ isOpen, onClose }: NapalflowerUseCompleteModalProps) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-xl md:text-2xl font-bold">사용 완료</h3>
        <p className="text-center text-sm md:text-base text-gray-700">
          다음 경매 낙찰 성공 시 나팔꽃이 2배 적립됩니다
        </p>
        <div className="flex w-full justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
          >
            <span className="text-xs font-bold">확인(보유 2개)</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 3. 동 가격 입찰 시 우선권 모달
const PriorityModal = ({ isOpen, onClose, onShowAutoModal }: PriorityModalProps) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-xl md:text-2xl font-bold">아이템 구매 완료</h3>
        <p className="text-center text-sm md:text-base text-gray-700">
          아이템 적용 시 동 가격 입찰 시 우선권이 부여됩니다
        </p>
        <div className="flex w-full justify-center">
          <button
            onClick={onShowAutoModal}
            className="flex-1 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
          >
            <span className="text-xs font-bold">확인</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 4. 나무 1그루 기부 모달
const TreeDonationModal = ({ isOpen, onClose }: TreeDonationModalProps) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-xl md:text-2xl font-bold">아이템 구매 완료</h3>
        <p className="text-center text-sm md:text-base text-gray-700">
        <span className="font-bold">나팔 x 나무심기</span> 캠페인에 나무 1그루가 기부되었어요<br />
          내 나무는 <span className="font-bold">마이페이지 &gt; 기부</span>에서 확인할 수 있어요
        </p>
        <div className="flex w-full justify-center gap-4">
          <button
            onClick={() => {
              console.log("보러가기 버튼 클릭");
              onClose();
            }}
            className="flex-1 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
          >
            <span className="text-xs font-bold">보러가기</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-none hover:bg-gray-300 transition-colors"
          >
            <span className="text-xs font-bold">확인</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 5. 동 가격 입찰시 사용 여부 자동 띄우기 모달
const PriorityAutoModal = ({ isOpen, onClose, onUse }: PriorityAutoModalProps) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
       <div className="inline-flex flex-col items-center gap-8">
    <h3 className="text-xl md:text-2xl font-bold">같은 가격 선입찰 존재</h3>
    <p className="text-center text-sm md:text-base text-gray-700">
      '서울대동창회' 님의 입찰가와 같은 가격을 먼저 제시한 참가자가 있습니다.<br />
      동 입찰권 우선권을 사용하면 이번 입찰이 우선 적용됩니다.
    </p>
    <p className="text-center text-xs text-red-500">
      *다음에 사용 시 선입찰자가 낙찰됩니다
    </p>
    <div className="flex w-full justify-center gap-4">
      {/* 지금 사용 버튼 */}
      <button
        onClick={onUse}
        className="flex-1 h-[40px] bg-black text-white font-bold text-sm flex items-center justify-center rounded-none hover:bg-gray-800 transition-colors"
      >
        지금 사용(보유 2개)
      </button>

      {/* 다음에 사용 버튼 */}
      <button
        onClick={onClose}
        className="flex-1 h-[40px] bg-white border border-gray-400 text-black font-bold text-sm flex items-center justify-center rounded-none hover:bg-gray-100 transition-colors"
      >
        다음에 사용
      </button>
    </div>
  </div>
</ModalWrapper>
  );
};

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




//푸터 제거//







// 4. 아이템 구매 카드 컴포넌트 (모달 기능 추가)
const PurchaseItemCard = ({ 
  imageUrl, 
  title, 
  price, 
  quantity = 0, 
  quantityType = "구매", 
  onPurchaseClick 
}: { 
  imageUrl: string; 
  title: string; 
  price: string; 
  quantity?: number;
  quantityType?: string;
  onPurchaseClick: () => void;
}) => (
  <div className="w-[200px] h-[280px] border border-gray-200 flex flex-col overflow-hidden relative">
    {quantity > 0 && (
      <div className="absolute top-2 right-2 z-10 bg-[#BDBDBD] py-1 px-2">
        <span className="text-black text-xs font-bold whitespace-nowrap">
          {quantity.toString().padStart(2, '0')}개 {quantityType}
        </span>
      </div>
    )}
    <div className="h-3/5 relative mt-[3px] mx-[3px]">
      <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
    </div>
    <div className="flex-grow flex flex-col items-center justify-center px-2 py-1">
      <p className="text-black text-m text-center leading-tight">{title}</p>
      <p className="text-gray-600 text-base mt-1">{price}</p>
    </div>
    <button 
      onClick={onPurchaseClick}
      className="w-full h-[30px] bg-black text-white font-bold text-sm mt-auto flex-shrink-0"
    >
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

  // 모달 상태 관리 추가 - 타입 명시
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);



  // 업데이트된 purchaseItemsData (모달 타입과 수량 정보 추가)
  const purchaseItemsData: PurchaseItem[] = [
    {
      id: 1,
      imageUrl: "/images/flower2.png",
      title: "낙찰 성공 시 나팔꽃 X2 적립",
      price: "나팔꽃 15송이",
      quantity: 2,
      quantityType: "보유",
      modalType: "napalflower"
    },
    {
      id: 2,
      imageUrl: "/images/sametime.png",
      title: "동 가격 입찰시 우선권",
      price: "나팔꽃 30송이",
      quantity: 2,
      quantityType: "구매",
      modalType: "priority"
    },
    {
      id: 3,
      imageUrl: "/images/tree.png",
      title: "나무 1그루 기부",
      price: "나팔꽃 10송이",
      quantity: 1,
      quantityType: "구매",
      modalType: "tree"
    },
  ];

  // 모달 핸들러 함수들
  const handlePurchaseClick = (item: PurchaseItem) => {
    setSelectedItem(item);
    setOpenModal(item.modalType);
  };

  const handleUseComplete = () => {
    setOpenModal('napalflower-use-complete');
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedItem(null);
  };

  const handleShowAutoModal = () => {
    setOpenModal('priority-auto');
  };


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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">아이템 구매</h2>
                <a href="#" className="text-gray-500 text-sm md:text-base font-medium hover:underline">
                  내 아이템 보러가기
                </a>
              </div>
              <div className="flex flex-wrap gap-4">
                {purchaseItemsData.map(item => (
                  <PurchaseItemCard
                    key={item.id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    price={item.price}
                    quantity={item.quantity}
                    quantityType={item.quantityType}
                    onPurchaseClick={() => handlePurchaseClick(item)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

{/* 모달 컴포넌트들 */}
<NapalflowerModal
        isOpen={openModal === 'napalflower'}
        onClose={handleClose}
        onUse={handleUseComplete}
      />
      <NapalflowerUseCompleteModal
        isOpen={openModal === 'napalflower-use-complete'}
        onClose={handleClose}
      />
      <PriorityModal
        isOpen={openModal === 'priority'}
        onClose={handleClose}
        onShowAutoModal={handleShowAutoModal}
      />
      <TreeDonationModal
        isOpen={openModal === 'tree'}
        onClose={handleClose}
      />
      <PriorityAutoModal
        isOpen={openModal === 'priority-auto'}
        onClose={handleClose}
        onUse={handleClose}
      />
    </div>
  );
}

