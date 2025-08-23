'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link"; // ✅ Link 컴포넌트 불러오기

export default function PremiumItemList() {
  const premiumItems = [
    { id: 1, imageUrl: '/images/sample.png' },
    { id: 2, imageUrl: '/images/sample.png' },
    { id: 3, imageUrl: '/images/sample.png' },
    { id: 4, imageUrl: '/images/sample.png' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 텍스트 부분 */}
      <div className="flex items-center justify-between">
        <span className="flex-1 text-[#111416] text-xl font-bold">
          프리미엄 아이템 소장 리스트
        </span>
        {/* ✅ '더보기'를 클릭 가능한 링크로 변경했습니다. */}
        <a href="#" className="text-[#9E9E9E] text-base font-bold my-2 mx-3 hover:underline">
          더보기
        </a>
      </div>

      {/* 이미지 부분 */}
      <div className="flex flex-nowrap items-start py-3 px-4 gap-2 overflow-x-auto">
        {premiumItems.map(item => (
          // ✅ Link 컴포넌트로 div를 감싸고 href 속성을 추가합니다.
          <Link key={item.id} href={`/items/${item.id}`} passHref>
             <div className="flex flex-col shrink-0 items-center relative cursor-pointer">
             
            
             {/* img 태그 사용 */}
            <img
              src={item.imageUrl}
              alt={`Premium Item ${item.id}`}
              className="w-[200px] h-[149px] object-fill"
            />
            <div className="flex items-center bg-black w-[84px] absolute top-0 left-0 py-[3px] px-2 gap-1">
              {/* ✅ 프리미엄 로고 샘플 이미지로 변경했습니다. */}
              <img
                src="uploaded:primium.png-6855c197-adae-4e15-93cf-0138a2f165a6"
                alt="Premium Logo"
                className="w-[18px] h-[18px] object-fill"
              />
              <span className="flex-1 text-white text-xs font-bold text-center">
                Premium
              </span>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { PremiumItemList };