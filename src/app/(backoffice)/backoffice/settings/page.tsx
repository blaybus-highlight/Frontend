// 파일 경로: app/backoffice/settings/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activePage, setActivePage] = useState("계정");

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
              className={`py-2 px-3 rounded-md text-sm ${
                activePage === page
                  ? "font-semibold text-gray-900"
                  : "font-medium text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActivePage(page)}
            >
              {page}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 py-26 pl-0 pr-16">
        {/* [수정] 제목과 표 사이 간격을 gap-8에서 gap-10으로 늘림 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">계정</h2>

          <div className="w-full space-y-1">

            {/* --- 아이디 정보 라인 --- */}
            {/* [수정] 하단 여백 1px 추가 */}
            <div className="grid grid-cols-12 gap-4 items-center pt-6 pb-[calc(0.5rem+10px)] border-b-2 border-gray-200">
              <span className="col-span-3 text-base font-medium text-gray-600">아이디</span>
              <span className="col-span-7 text-base text-gray-900 font-semibold">temp_id</span>
            </div>

            {/* --- 이메일 정보 라인 --- */}
            <div className="grid grid-cols-12 gap-4 items-center pt-2 pb-[calc(0.5rem+0.5px)] border-b-2 border-gray-200">
              <span className="col-span-3 text-base font-medium text-gray-600">이메일</span>
              <span className="col-span-7 text-base text-gray-900 font-semibold">temp@example.com</span>
              <button className="relative bottom-px flex items-center justify-center col-span-2 w-4/12 justify-self-end px-4 py-3 text-sm font-bold bg-white text-gray-800 border border-gray-400 hover:bg-gray-100">
                변경
              </button>
            </div>

            {/* --- 휴대폰 번호 정보 라인 --- */}
            <div className="grid grid-cols-12 gap-4 items-center pt-2 pb-[calc(0.5rem+0.5px)] border-b-2 border-gray-200">
              <span className="col-span-3 text-base font-medium text-gray-600">휴대폰 번호</span>
              <span className="col-span-7 text-base text-gray-900 font-semibold">010-1234-5678</span>
              <button className="relative bottom-px flex items-center justify-center col-span-2 w-4/12 justify-self-end px-4 py-3 text-sm font-bold bg-white text-gray-800 border border-gray-400 hover:bg-gray-100">
                변경
              </button>
            </div>

            {/* --- 닉네임 정보 라인 --- */}
            <div className="grid grid-cols-12 gap-4 items-center pt-2 pb-[calc(0.5rem+0.5px)] border-b-2 border-gray-200">
              <span className="col-span-3 text-base font-medium text-gray-600">닉네임</span>
              <span className="col-span-7 text-base text-gray-900 font-semibold">임시닉네임</span>
              <button className="relative bottom-px flex items-center justify-center col-span-2 w-4/12 justify-self-end px-4 py-3 text-sm font-bold bg-white text-gray-800 border border-gray-400 hover:bg-gray-100">
                변경
              </button>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}