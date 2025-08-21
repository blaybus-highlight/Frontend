'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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

// 나무지킴이 랭킹 데이터 (1-10위)
const treeKeeperRankingData: RankingUser[] = [
  { userId: 11, nickname: '나무지킴이', auctionCount: 59, ranking: 1 },
  { userId: 12, nickname: '나무지킴이', auctionCount: 55, ranking: 2 },
  { userId: 13, nickname: '나무지킴이', auctionCount: 52, ranking: 3 },
  { userId: 14, nickname: '나무지킴이', auctionCount: 48, ranking: 4 },
  { userId: 15, nickname: '나무지킴이', auctionCount: 45, ranking: 5 },
  { userId: 16, nickname: '나무지킴이', auctionCount: 42, ranking: 6 },
  { userId: 17, nickname: '나무지킴이', auctionCount: 39, ranking: 7 },
  { userId: 18, nickname: '나무지킴이', auctionCount: 36, ranking: 8 },
  { userId: 19, nickname: '나무지킴이', auctionCount: 33, ranking: 9 },
  { userId: 20, nickname: '나무지킴이', auctionCount: 30, ranking: 10 },
];

export const TreeKeeperRanking = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const rankings = treeKeeperRankingData;
  const topFiveUsers = rankings.slice(0, 5);
  const nextFiveUsers = rankings.slice(5, 10);

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">나무 지킴이 랭킹</h2>
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