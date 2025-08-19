// 파일 경로: app/backoffice/settings/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activePage, setActivePage] = useState("계정");

  return (
    // layout의 main 태그 안을 채우는 콘텐츠 컨테이너
    <div className="flex h-full bg-white m-4 rounded-lg shadow-md">
      
      {/* 설정 페이지 전용 서브메뉴 (작은 사이드바) */}
      <div className="w-48 border-r">
        {/* [수정] 헤더와 왼쪽 정렬을 위해 좌우 패딩을 px-8로 늘립니다. */}
        <div className="px-8 py-6 border-b">
          <h1 className="text-2xl font-bold">설정</h1>
        </div>
        
        {/* [수정] 타이틀과 정렬을 맞추기 위해 좌우 패딩을 px-8로 늘립니다. */}
        <nav className="flex flex-col px-8 py-4 gap-2">
          {["계정", "정보", "정산", "알림", "보안"].map((page) => (
            <Link
              href={`/backoffice/settings/${page.toLowerCase()}`}
              key={page}
              className={`py-2 px-3 rounded-md text-sm font-medium ${
                activePage === page
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActivePage(page)}
            >
              {page}
            </Link>
          ))}
        </nav>
      </div>

      {/* 설정 페이지의 실제 콘텐츠 (계정 정보 등) */}
      {/* [수정] 전체적인 여백을 p-8로 늘려 통일성 및 가독성 확보 */}
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-gray-900">계정</h2>
          <div className="w-full max-w-lg space-y-5">
            <div className="pb-4 border-b-2 border-gray-200">
              <p className="text-base text-gray-700">아이디 - temp_id</p>
            </div>
            <div className="pb-4 border-b-2 border-gray-200">
              <p className="text-base text-gray-700">이메일 - temp@example.com</p>
            </div>
            <div className="pb-4 border-b-2 border-gray-200">
              <p className="text-base text-gray-700">휴대폰 번호 - 010-1234-5678</p>
            </div>
            <div className="pb-4 border-b-2 border-gray-200">
              <p className="text-base text-gray-700">닉네임 - 임시닉네임</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}