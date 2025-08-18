import React from 'react';

// 대시보드 메인 페이지 (홈)
export default function BackofficeHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">대시보드 홈</h1>
      <p className="mt-2 text-gray-600">
        관리자 대시보드의 메인 페이지입니다. 주요 지표와 현황을 이곳에 표시합니다.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* TODO: 실제 데이터와 위젯으로 채워질 영역 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">총 사용자 수</h2>
          <p className="mt-2 text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">진행중인 경매</h2>
          <p className="mt-2 text-3xl font-bold">56</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">오늘의 매출</h2>
          <p className="mt-2 text-3xl font-bold">₩ 12,345,678</p>
        </div>
      </div>
    </div>
  );
}
