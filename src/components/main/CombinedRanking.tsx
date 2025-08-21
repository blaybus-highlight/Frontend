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

const RankingItem = ({ user, isTreeKeeper = false }: { user: RankingUser; isTreeKeeper?: boolean }) => (
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
      <span className="text-sm text-gray-600">
        {isTreeKeeper ? `${user.auctionCount}나팔꽃 기부` : `${user.auctionCount}회 경매 성공`}
      </span>
    </div>
  </div>
);

// 사용자 거래 랭킹 데이터
const userRankingData: RankingUser[] = [
  { userId: 1, nickname: '전우선', auctionCount: 24, ranking: 1 },
  { userId: 2, nickname: '탁찬홍', auctionCount: 21, ranking: 2 },
  { userId: 3, nickname: '이주혜', auctionCount: 19, ranking: 3 },
  { userId: 4, nickname: '이수영', auctionCount: 17, ranking: 4 },
  { userId: 5, nickname: '이승윤', auctionCount: 13, ranking: 5 },
  { userId: 6, nickname: '류미란', auctionCount: 12, ranking: 6 },
  { userId: 7, nickname: '박강원', auctionCount: 10, ranking: 7 },
];

// 나무지킴이 랭킹 데이터
const treeKeeperRankingData: RankingUser[] = [
  { userId: 11, nickname: '박강원', auctionCount: 10, ranking: 1 },
  { userId: 12, nickname: '류미란', auctionCount: 8, ranking: 2 },
  { userId: 13, nickname: '이승윤', auctionCount: 7, ranking: 3 },
  { userId: 14, nickname: '이수영', auctionCount: 5, ranking: 4 },
  { userId: 15, nickname: '이주혜', auctionCount: 4, ranking: 5 },
  { userId: 16, nickname: '탁찬홍', auctionCount: 3, ranking: 6 },
  { userId: 17, nickname: '전우선', auctionCount: 1, ranking: 7 },
];

export const CombinedRanking = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'treekeeper'>('user');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentRankings = activeTab === 'user' ? userRankingData : treeKeeperRankingData;
  const topFiveUsers = currentRankings.slice(0, 5);
  const nextFiveUsers = currentRankings.slice(5, 10);

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* 탭 헤더 */}
          <div className="mb-4 flex items-center">
            <button
              onClick={() => {
                setActiveTab('user');
                setIsExpanded(false);
              }}
              className={`text-xl font-bold transition-colors ${
                activeTab === 'user' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              사용자 거래 랭킹
            </button>
            <span className="mx-3 text-gray-400">|</span>
            <button
              onClick={() => {
                setActiveTab('treekeeper');
                setIsExpanded(false);
              }}
              className={`text-xl font-bold transition-colors ${
                activeTab === 'treekeeper' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              나무 지킴이 랭킹
            </button>
          </div>
          
          {/* 랭킹 내용 */}
          <div className="space-y-1">
            {topFiveUsers.map((user) => (
              <RankingItem key={user.userId} user={user} isTreeKeeper={activeTab === 'treekeeper'} />
            ))}
          </div>

          {nextFiveUsers.length > 0 && (
            <>
              {isExpanded && (
                <div className="space-y-1 mt-2">
                  {nextFiveUsers.map((user) => (
                    <RankingItem key={user.userId} user={user} isTreeKeeper={activeTab === 'treekeeper'} />
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