"use client"

import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export default function AuctionPage() {
  const [activeFilter, setActiveFilter] = useState<string>("전체")

  const onFilterClick = (filter: string) => setActiveFilter(filter)
  const onStatusClick = (status: string, id: string) =>
    alert(`${status} 상태의 경매 ${id} 상세 정보를 표시합니다`)
  const onEditClick = (id: string) => alert(`경매 ${id} 설정을 수정합니다`)
  const onDeleteClick = (id: string) => {
    if (confirm(`경매 ${id}를 삭제하시겠습니까?`)) {
      alert(`경매 ${id}가 삭제되었습니다`)
    }
  }
  const onShippingClick = (id: string) =>
    alert(`경매 ${id}의 배송 관리 페이지로 이동합니다`)
  const onStatsClick = (type: string, count: number) =>
    alert(`${type}: ${count}건의 상세 목록을 표시합니다`)

  return (
    <div>
      <div className="flex flex-col items-start self-stretch gap-3">
        <span className="text-[#111416] text-[28px] font-bold ml-4 mr-[300px]">
          경매
        </span>
        <div className="w-80 h-[21px] ml-4"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch self-stretch p-4 gap-4">
        {[
          { label: "배송 중", count: 12 },
          { label: "배송 처리", count: 12 },
          { label: "배송 조회", count: 8 },
          { label: "배송 완료", count: 35 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-start py-[25px] gap-2 rounded border border-solid border-[#DBE0E5] cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onStatsClick(stat.label, stat.count)}
          >
            <span className="text-[#424242] text-base mx-[25px]">
              {stat.label}
            </span>
            <span className="text-[#111416] text-2xl font-bold mx-[25px]">
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-start self-stretch p-3 gap-3">
        {["전체", "진행중", "보류중", "완료됨"].map((filter) => (
          <button
            key={filter}
            className={`flex flex-col shrink-0 items-center text-left py-1.5 px-4 rounded-lg border-0 transition-colors ${
              activeFilter === filter
                ? "bg-black text-white"
                : "bg-neutral-100 text-black hover:bg-neutral-200"
            }`}
            onClick={() => onFilterClick(filter)}
          >
            <span className="text-sm">{filter}</span>
          </button>
        ))}
      </div>

      {/* 진행 중인 경매 */}
      <span className="text-[#111416] text-xl font-bold my-5 ml-4">
        진행 중인 경매
      </span>
      <div className="flex flex-col items-start self-stretch px-4">
        <div className="flex flex-col items-start self-stretch overflow-x-auto">
          {/* Table Header: match body grid exactly */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] min-w-[1024px] items-center bg-gray-50 mb-0.5 border-b px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">경매 ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">제품명</span>
            <span className="text-[#616161] text-sm font-bold text-center">현재 입찰가</span>
            <span className="text-[#616161] text-sm font-bold text-center">남은 시간</span>
            <span className="text-[#616161] text-sm font-bold text-center">상태</span>
            <span className="text-[#616161] text-sm font-bold text-center">작업</span>
          </div>
          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] min-w-[1024px] items-center border-b last:border-b-0 px-4 py-4 gap-2 bg-white"
            >
              <span className="truncate whitespace-nowrap text-[#616161] text-base text-center">
                1923-3003030
              </span>
              <span className="truncate whitespace-nowrap text-black text-base text-center">
                앤티크 꽃병
              </span>
              <span className="text-[#616161] text-base text-center">
                35,000 원
              </span>
              <span className="text-[#616161] text-base text-center">
                00시간 30분
              </span>
              <div className="flex justify-center">
                <button
                  className="bg-[#FFEEEC] text-black text-sm py-1 px-3 rounded-lg hover:bg-[#FFE0DD] transition-colors cursor-pointer"
                  onClick={() =>
                    onStatusClick("마감임박", `1923-3003030-${item}`)
                  }
                >
                  마감임박
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => onEditClick(`1923-3003030-${item}`)}
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 보류 중인 경매 */}
      <span className="text-[#111416] text-xl font-bold my-5 ml-4">
        보류 중인 경매
      </span>
      <div className="flex flex-col items-start self-stretch px-4">
        <div className="flex flex-col self-stretch overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] min-w-[880px] items-center bg-gray-50 border-b px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">경매 ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">제품명</span>
            <span className="text-[#616161] text-sm font-bold text-center">시작일시</span>
            <span className="text-[#616161] text-sm font-bold text-center">시작가</span>
            <span className="text-[#616161] text-sm font-bold text-center">상태</span>
            <span className="text-[#616161] text-sm font-bold text-center">작업</span>
          </div>
          <div className="self-stretch">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] min-w-[880px] items-center border-b last:border-b-0 px-4 py-4 gap-2 bg-white"
              >
                <span className="truncate whitespace-nowrap text-[#616161] text-base text-center">
                  1923-3003030
                </span>
                <span className="truncate whitespace-nowrap text-black text-base text-center">
                  앤티크 꽃병
                </span>
                <span className="text-[#616161] text-base text-center">2024-07-25</span>
                <span className="text-[#616161] text-base text-center">35,000 원</span>
                <div className="flex justify-center">
                  <button
                    className="bg-[#F4FEFC] text-[#616161] text-sm py-1 px-3 rounded-lg hover:bg-[#E8FDF8] transition-colors cursor-pointer"
                    onClick={() => onStatusClick("예정", `1923-3003030-${item}`)}
                  >
                    예정
                  </button>
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => onDeleteClick(`1923-3003030-${item}`)}
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => onEditClick(`1923-3003030-${item}`)}
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 완료된 경매 */}
      <span className="text-[#111416] text-xl font-bold my-5 ml-4">
        완료된 경매
      </span>
      <div className="flex flex-col items-start self-stretch px-4 pb-4">
        <div className="flex flex-col items-start self-stretch overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] min-w-[1024px] items-center bg-gray-50 mb-0.5 border-b px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">경매 ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">제품명</span>
            <span className="text-[#616161] text-sm font-bold text-center">최종 입찰가</span>
            <span className="text-[#616161] text-sm font-bold text-center">종료 날짜</span>
            <span className="text-[#616161] text-sm font-bold text-center">상태</span>
            <span className="text-[#616161] text-sm font-bold text-center">배송 단계</span>
            <span className="text-[#616161] text-sm font-bold text-center">배송 관리</span>
          </div>
          {/* Table Rows */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] min-w-[1024px] items-center border-b last:border-b-0 px-4 py-4 gap-2 bg-white"
            >
              <span className="truncate whitespace-nowrap text-[#616161] text-base text-center">
                1923-3003030
              </span>
              <span className="truncate whitespace-nowrap text-black text-base text-center">
                앤티크 꽃병
              </span>
              <span className="text-[#616161] text-base text-center">
                35,000 원
              </span>
              <span className="text-[#616161] text-base text-center">
                2024-07-25
              </span>
              <div className="flex justify-center">
                <div className="bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-lg">
                  마감
                </div>
              </div>
              <span className="text-[#616161] text-base text-center">
                배송 대기
              </span>
              <div className="flex justify-center">
                <button
                  className="bg-black text-white text-sm py-1.5 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => onShippingClick(`1923-3003030-${item}`)}
                >
                  배송 관리
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}