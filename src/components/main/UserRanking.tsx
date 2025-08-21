'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRanking } from '@/hooks/useRanking';
import { RankingUser } from '@/types/ranking';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return rank.toString();
  }
};

const getUserImage = (ranking: number) => {
  if (ranking === 1) return '/images/1위.png';
  if (ranking === 2) return '/images/2위.png';
  if (ranking === 3) return '/images/3위.png';
  return '/images/나머지.png';
};

const RankingItem = ({ user }: { user: RankingUser }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 flex items-center justify-center">
        {user.ranking <= 3 ? (
          <span className="text-lg">{getRankIcon(user.ranking)}</span>
        ) : (
          <span className="text-sm font-medium text-gray-600">{user.ranking}</span>
        )}
      </div>
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <Image
          src={getUserImage(user.ranking)}
          alt={`${user.ranking}위 프로필`}
          width={32}
          height={32}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 이미지 로드 실패시 대체 텍스트 표시
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<span class="text-xs">${user.ranking}</span>`;
          }}
        />
      </div>
      <span className="font-medium text-sm">{user.nickname}</span>
    </div>
    <div className="text-right">
      <span className="text-sm text-gray-600">{user.auctionCount}회 경매 성공</span>
    </div>
  </div>
);

// 임시 랭킹 데이터
const mockRankingData: RankingUser[] = [
  { userId: 1, nickname: '전우선', auctionCount: 59, ranking: 1 },
  { userId: 2, nickname: '탁찬홍', auctionCount: 39, ranking: 2 },
  { userId: 3, nickname: '이주혜', auctionCount: 34, ranking: 3 },
  { userId: 4, nickname: '이수영', auctionCount: 31, ranking: 4 },
  { userId: 5, nickname: '이승윤', auctionCount: 30, ranking: 5 },
  { userId: 6, nickname: '류미란', auctionCount: 28, ranking: 6 },
  { userId: 7, nickname: '박강원', auctionCount: 27, ranking: 7 },
  { userId: 8, nickname: '나무지킴이', auctionCount: 24, ranking: 8 },
  { userId: 9, nickname: '나무지킴이', auctionCount: 22, ranking: 9 },
  { userId: 10, nickname: '나무지킴이', auctionCount: 19, ranking: 10 },
];

export const UserRanking = () => {
  // 일단 API 연동을 비활성화하고 임시 데이터만 사용
  // const { data: rankingData, isLoading, error } = useRanking({ page: 0, size: 10 });
  
  // 임시로 항상 mock 데이터 사용
  const shouldUseMockData = true;
  const isLoading = false;
  const error = null;
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (isLoading) {
    return (
      <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">사용자 거래 랭킹</h2>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 py-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">사용자 거래 랭킹</h2>
        </div>
        <div className="text-center py-4">
          <span className="text-sm text-gray-500">랭킹 데이터를 불러올 수 없습니다.</span>
        </div>
        </div>
      </div>
    </section>
    );
  }

  const rankings = mockRankingData;
  const topFiveUsers = rankings.slice(0, 5);
  const nextFiveUsers = rankings.slice(5, 10); // 6-10위 표시

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">사용자 거래 랭킹</h2>
      </div>
      
      <div className="space-y-1">
        {topFiveUsers.map((user) => (
          <RankingItem key={user.userId} user={user} />
        ))}
      </div>

      {nextFiveUsers.length > 0 && (
        <>
          {isExpanded && (
            <div className="space-y-1 mt-2">
              {nextFiveUsers.map((user) => (
                <RankingItem key={user.userId} user={user} />
              ))}
            </div>
          )}
          <div className="mt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-600">
                  {isExpanded ? '접기' : '더보기'}
                </span>
              </div>
            </button>
          </div>
        </>
      )}
        </div>
      </div>
    </section>
  );
};