import React from 'react';

export default function BackofficeDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
      <p className="mt-2 text-gray-600">
        이곳에 관리자 관련 주요 지표와 정보가 표시됩니다. (현재는 임시 UI입니다.)
      </p>
      {/* TODO: 추후 백엔드 API 연동 후 실제 데이터가 표시됩니다. */}
    </div>
  );
}
