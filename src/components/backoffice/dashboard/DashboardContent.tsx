"use client"

import { useState, useEffect } from "react";
import vintageWatch from "@/assets/vintage-watch.png";
import { getDashboardStats, getDashboardItems, DashboardStats, DashboardItem } from "@/api/auction";

const DashboardContent = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 대시보드 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 대시보드 통계와 히스토리 아이템 데이터를 병렬로 로드
        const [statsResponse, itemsResponse] = await Promise.all([
          getDashboardStats(),
          getDashboardItems()
        ]);

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

        if (itemsResponse.success) {
          // 최대 3개만 표시
          setDashboardItems(itemsResponse.data.slice(0, 3));
        }

      } catch (err) {
        console.error('대시보드 데이터 로드 실패:', err);
        setError('대시보드 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // 30초마다 실시간 데이터 갱신
    const interval = setInterval(() => {
      getDashboardItems()
        .then(response => {
          if (response.success) {
            setDashboardItems(response.data.slice(0, 3));
          }
        })
        .catch(err => {
          console.error('실시간 데이터 갱신 실패:', err);
        });
    }, 30000);

    // 5초마다 히스토리 아이템 슬라이드
    const slideInterval = setInterval(() => {
      setCurrentItemIndex(prev => {
        if (dashboardItems.length === 0) return 0;
        return (prev + 1) % dashboardItems.length;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(slideInterval);
    };
  }, []);

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">대시보드 데이터를 불러오는 중...</div>
      </div>
    );
  }

  // 오류 상태 표시
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      <div className="self-stretch bg-background h-[1087px]">
        <div className="flex items-start self-stretch px-[140px]">
          <div className="flex flex-1 flex-col items-start pt-8 pb-[77px]">
            {/* Home Title */}
            <span className="text-[#111416] text-[28px] font-bold mb-[1px] ml-4 mr-[265px]">
              홈
            </span>
            
            {/* Auction Status Header */}
            <div className="flex items-center self-stretch p-4">
              <span className="flex-1 text-[#111416] text-xl font-bold">
                경매 상태
              </span>
              <div className="flex flex-col shrink-0 items-start bg-nafal-black py-2 px-8">
                <span className="text-nafal-white text-sm">
                  상품 등록하러가기
                </span>
              </div>
            </div>

            {/* Status Cards */}
            <div className="flex items-start self-stretch p-4">
              <div className="flex flex-1 flex-col items-start py-[25px] mr-4 rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  진행 중
                </span>
                <span className="text-[#111416] text-2xl font-bold mb-[1px] mx-[25px]">
                  {dashboardStats?.inProgress || 0}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start py-[25px] mr-[17px] rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  보류중
                </span>
                <span className="text-[#111416] text-2xl font-bold mb-[1px] mx-[25px]">
                  {dashboardStats?.pending || 0}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start py-[25px] rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  완료됨
                </span>
                <span className="text-[#111416] text-2xl font-bold mb-[1px] mx-[25px]">
                  {dashboardStats?.completed || 0}
                </span>
              </div>
            </div>

            {/* Reports Title */}
            <span className="text-[#111416] text-xl font-bold my-5 ml-4">
              리포트
            </span>

            {/* Report Cards */}
            <div className="flex items-start self-stretch px-4 gap-4">
              {/* Revenue Chart */}
              <div className="flex flex-1 flex-col items-start py-[25px] rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  경매 수익
                </span>
                <span className="text-[#111416] text-[28px] font-bold mb-[9px] mx-[25px]">
                  120,000원
                </span>
                <div className="flex items-start self-stretch mb-[46px] mx-[25px] gap-1">
                  <div className="flex flex-col shrink-0 items-center pb-[1px]">
                    <span className="text-[#607589] text-base font-bold">
                      지난 30일
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-center pb-[1px]">
                    <span className="text-[#FF5142] text-base font-bold">
                      +15%
                    </span>
                  </div>
                </div>
                {/* Chart Placeholder */}
                <div className="self-stretch h-[148px] mb-8 mx-[25px] bg-gradient-to-b from-[#E5EDEC] to-transparent rounded"></div>
                <div className="flex items-start self-stretch mx-[25px]">
                  <span className="flex-1 text-[#757575] text-xs font-bold mx-[19px]">
                    10월 1일
                  </span>
                  <span className="text-[#757575] text-xs font-bold mb-[1px]">
                    10월 8일
                  </span>
                  <span className="text-[#757575] text-xs font-bold mb-[1px]">
                    10월 15일
                  </span>
                  <span className="text-[#757575] text-xs font-bold mb-[1px]">
                    10월 22일
                  </span>
                  <span className="text-[#757575] text-xs font-bold mb-[1px]">
                    10월 29일
                  </span>
                </div>
              </div>

              {/* Product Registration Chart */}
              <div className="flex flex-1 flex-col items-start py-[25px] rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  제품 등록
                </span>
                <span className="text-[#111416] text-[28px] font-bold mb-[9px] mx-[25px]">
                  50
                </span>
                <div className="flex items-start self-stretch mb-2 mx-[25px] gap-1">
                  <div className="flex flex-col shrink-0 items-center pb-[1px]">
                    <span className="text-[#607589] text-base font-bold">
                      지난 30일
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-center pb-[1px]">
                    <span className="text-[#FF5142] text-base font-bold">
                      +10%
                    </span>
                  </div>
                </div>
                <div className="flex items-start self-stretch mx-[25px] gap-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex flex-1 flex-col mt-[57px]">
                      <div 
                        className="self-stretch h-[137px]"
                        style={{
                          background: "linear-gradient(180deg, #E5EDEC, #F4FEFC00)"
                        }}
                      />
                      <span className="text-[#757575] text-xs font-bold text-center mb-7">
                        10월 {8 + index * 7}일
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-start self-stretch gap-4">
              {/* History Section */}
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#111416] text-xl font-bold my-5 ml-4 mr-36">
                  히스토리
                </span>
                {dashboardItems.length > 0 ? (
                  <div className="flex flex-col items-start bg-background py-[13px] px-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[#111416] text-base font-bold">
                        {dashboardItems[currentItemIndex]?.productName}
                      </span>
                    </div>
                    <span className="text-[#616161] text-sm mr-12">
                      경매 ID: {dashboardItems[currentItemIndex]?.auctionId}
                    </span>
                    <span className="text-[#616161] text-sm mr-12">
                      현재 입찰가: {dashboardItems[currentItemIndex]?.currentBid?.toLocaleString()}원
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-start bg-background py-[13px] px-4">
                    <span className="text-[#616161] text-sm">
                      히스토리 데이터가 없습니다.
                    </span>
                  </div>
                )}
              </div>

              {/* Real-time Auction Feed */}
              <div className="flex flex-1 flex-col items-start">
                <span className="text-[#111416] text-xl font-bold my-5 ml-4">
                  실시간 경매 피드
                </span>
                {dashboardItems.length > 0 ? (
                  <div className="flex items-start bg-background py-3 px-4 gap-[15px]">
                    <img
                      src={dashboardItems[currentItemIndex]?.productImageUrl || vintageWatch.src}
                      alt={dashboardItems[currentItemIndex]?.productName}
                      className="w-[70px] h-[70px] object-fill"
                    />
                    <div className="flex flex-col shrink-0 items-start py-0.5">
                      <span className="text-[#111416] text-base font-bold mb-[1px] mr-[103px]">
                        {dashboardItems[currentItemIndex]?.productName}
                      </span>
                      <span className="text-[#616161] text-sm mb-[1px] mr-[101px]">
                        현재 입찰가 {dashboardItems[currentItemIndex]?.currentBid?.toLocaleString()}원
                      </span>
                      <span className="text-[#616161] text-sm mb-[1px] mr-[77px]">
                        경매 ID {dashboardItems[currentItemIndex]?.auctionId}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start bg-background py-3 px-4">
                    <span className="text-[#616161] text-sm">
                      현재 진행 중인 경매가 없습니다.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
