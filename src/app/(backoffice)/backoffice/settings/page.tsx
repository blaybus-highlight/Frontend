// 파일 경로: app/backoffice/settings/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
// [개선] URL 경로를 감지하기 위해 usePathname 훅을 import 합니다.
import { usePathname } from "next/navigation";

// --- [개선] 재사용 가능한 UI 컴포넌트 정의 ---

// 1. 설정 페이지의 '변경' 버튼 컴포넌트
// 이 컴포넌트의 className만 수정하면 모든 '변경' 버튼의 스타일이 한 번에 바뀝니다.
const SettingsButton = ({ children }: { children: React.ReactNode }) => (
  <button className="relative bottom-px flex items-center justify-center col-span-2 w-full max-w-[100px] justify-self-end px-4 py-3 text-sm font-bold bg-white text-gray-800 border border-gray-400 hover:bg-gray-100">
    {children}
  </button>
);

// 2. 정보 한 줄을 표시하는 컴포넌트
// 라벨, 값, 버튼 표시 여부를 props로 받아 동적으로 렌더링합니다.
const InfoRow = ({ label, value, showButton = false }: { label: string; value: string; showButton?: boolean; }) => (
  <div className="grid grid-cols-12 gap-4 items-center py-4 border-b-2 border-gray-200">
    <span className="col-span-3 text-base font-medium text-gray-600">{label}</span>
    {/* 버튼 유무에 따라 col-span을 동적으로 조절합니다. */}
    <span className={`text-base text-gray-900 font-semibold ${showButton ? 'col-span-7' : 'col-span-9'}`}>
      {value}
    </span>
    {showButton && <SettingsButton>변경</SettingsButton>}
  </div>
);

// --- 메인 페이지 컴포넌트 ---

export default function SettingsPage() {
  // [개선] usePathname을 사용해 현재 URL 경로를 가져옵니다.
  const pathname = usePathname(); 
  // URL의 마지막 부분을 현재 페이지 이름으로 사용합니다. (예: /backoffice/settings/계정 -> '계정')
  // 한글 URL이 인코딩될 경우를 대비해 decodeURIComponent를 사용합니다.
  const activePage = decodeURIComponent(pathname.split('/').pop() || "계정");

  // [개선] 계정 데이터를 객체로 관리하여 UI와 데이터를 분리합니다.
  const [accountData, setAccountData] = useState({
    id: "temp_id",
    email: "temp@example.com",
    phone: "010-1234-5678",
    nickname: "임시닉네임",
  });

  // [개선] 화면에 표시될 필드를 '설계도' 배열로 정의합니다.
  // 이 배열만 수정하면 화면 구성이 바뀌므로 유지보수가 매우 편리해집니다.
  const accountFields = [
    { label: "아이디", key: "id", hasButton: false },
    { label: "이메일", key: "email", hasButton: true },
    { label: "휴대폰 번호", key: "phone", hasButton: true },
    { label: "닉네임", key: "nickname", hasButton: true },
  ];

  return (
    <div className="flex h-full rounded-lg">
      
      {/* 설정 페이지 전용 서브메뉴 */}
      <div className="w-48">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold">설정</h1>
        </div>
        
        <nav className="flex flex-col px-8 py-4 gap-4">
          {["계정", "정보", "정산", "알림", "보안"].map((page) => (
            <Link
              href={`/backoffice/settings/${page.toLowerCase()}`}
              key={page}
              // [개선] URL 기반으로 active 상태를 동적으로 결정합니다.
              className={`py-2 px-3 rounded-md text-sm ${
                activePage === page
                  ? "font-semibold text-gray-900"
                  : "font-medium text-gray-500 hover:text-gray-800"
              }`}
              // [개선] 더 이상 state를 수동으로 변경할 필요가 없으므로 onClick을 제거합니다.
            >
              {page}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 py-26 pl-0 pr-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">계정</h2>

          <div className="w-full">
            {/* [개선] accountFields 배열을 map으로 순회하며 InfoRow 컴포넌트를 렌더링합니다. */}
            {/* 반복적인 JSX 코드가 사라지고 매우 간결해졌습니다. */}
            {accountFields.map(field => (
              <InfoRow
                key={field.key}
                label={field.label}
                value={accountData[field.key as keyof typeof accountData]}
                showButton={field.hasButton}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}