"use client"

import { Edit, Trash2, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuctions } from "@/hooks/useAuctions"
import { AuctionItem, endAuction } from "@/api/auction"

const AuctionContent = () => {
  const [activeFilter, setActiveFilter] = useState<string>("전체")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [endingAuctionId, setEndingAuctionId] = useState<number | null>(null)

  // API 호출을 위한 훅 사용
  const { 
    auctions, 
    loading, 
    error, 
    totalCount, 
    currentPage, 
    totalPages, 
    refetch, 
    goToPage 
  } = useAuctions({
    status: activeFilter === "전체" ? undefined : activeFilter,
    searchTerm: searchTerm || undefined,
  })

  // 필터 상태에 따른 경매 분류 (statusDescription 기준)
  const activeAuctions = auctions.filter(auction => auction.statusDescription === "진행중")
  const pendingAuctions = auctions.filter(auction => auction.statusDescription === "예약됨")
  const endedAuctions = auctions.filter(auction => auction.actualEndTime !== null)

  const onFilterClick = (filter: string) => {
    setActiveFilter(filter)
    setShowFilter(false)
  }

  const onStatusClick = (status: string, id: number) =>
    alert(`${status} 상태의 경매 ${id} 상세 정보를 표시합니다`)
  
  const onEditClick = (id: number) => alert(`경매 ${id} 설정을 수정합니다`)

  const onEndAuctionClick = async (id: number) => {
    if (confirm(`경매 ${id}를 종료하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        setEndingAuctionId(id)
        await endAuction(id)
        alert(`경매 ${id}가 성공적으로 종료되었습니다.`)
        // 경매 목록 새로고침
        refetch()
      } catch (error) {
        alert(`경매 종료에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      } finally {
        setEndingAuctionId(null)
      }
    }
  }

  const onShippingClick = (id: number) =>
    alert(`경매 ${id}의 배송 관리 페이지로 이동합니다`)

  const onStatsClick = (type: string, count: number) =>
    alert(`${type}: ${count}건의 상세 목록을 표시합니다`)

  // 남은 시간 계산 함수
  const getRemainingTime = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return "마감"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}시간 ${minutes}분`
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number | null) => {
    if (price === null) return "미정"
    return price.toLocaleString() + " 원"
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">경매 목록을 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">오류: {error}</div>
      </div>
    )
  }

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
          { label: "진행중", count: activeAuctions.length },
          { label: "보류중", count: pendingAuctions.length },
          { label: "완료됨", count: endedAuctions.length },
          { label: "전체", count: totalCount },
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

      {/* Filter Controls */}
      <div className="flex items-center self-stretch p-4 mb-[5px] gap-4">
        <div className="flex shrink-0 items-center">
          <div className="relative">
            <button
              className="flex shrink-0 items-center bg-white text-left py-2.5 px-4 mr-4 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
              style={{ boxShadow: "0px 1px 2px #0A0C120D" }}
              onClick={() => setShowFilter(!showFilter)}
            >
              <Menu className="w-5 h-5" />
              <span className="text-[#414651] text-sm font-bold">필터</span>
            </button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                {["전체", "진행중", "보류중", "완료됨"].map((filter) => (
                  <button
                    key={filter}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => onFilterClick(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex shrink-0 items-center bg-white py-2.5 px-3.5 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
            style={{ boxShadow: "0px 1px 2px #0A0C120D" }}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                  stroke="#717680"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-[#717680] bg-transparent text-base w-[200px] border-0 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 진행 중인 경매 */}
      <span className="text-[#111416] text-xl font-bold my-5 ml-4">
        진행 중인 경매
      </span>
      <div className="flex flex-col items-start self-stretch px-4">
        <div className="flex flex-col items-start self-stretch overflow-x-auto w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] w-full items-center bg-gray-50 mb-0.5 border-b-2 border-gray-300 px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">상품 ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">제품명</span>
            <span className="text-[#616161] text-sm font-bold text-center">현재 입찰가</span>
            <span className="text-[#616161] text-sm font-bold text-center">남은 시간</span>
            <span className="text-[#616161] text-sm font-bold text-center">상태</span>
            <span className="text-[#616161] text-sm font-bold text-center">작업</span>
          </div>
          {/* Table Rows */}
          {activeAuctions.length > 0 ? (
            activeAuctions.map((auction) => (
              <div
                key={auction.productId}
                className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] w-full items-center border-b border-gray-200 last:border-b-0 px-4 py-4 gap-2 bg-white"
              >
                <span className="truncate whitespace-nowrap text-[#616161] text-base text-center">
                  {auction.productId}
                </span>
                <span className="truncate whitespace-nowrap text-black text-base text-center">
                  {auction.productName}
                </span>
                <span className="text-[#616161] text-base text-center">
                  {formatPrice(auction.currentHighestBid)}
                </span>
                <span className="text-[#616161] text-base text-center">
                  {getRemainingTime(auction.scheduledEndTime)}
                </span>
                <div className="flex justify-center">
                  <button
                    className="bg-[#FFEEEC] text-black text-sm py-1 px-3 rounded-lg hover:bg-[#FFE0DD] transition-colors cursor-pointer"
                    onClick={() => onStatusClick("진행중", auction.productId)}
                  >
                    진행중
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className={`p-2 rounded transition-colors ${
                      endingAuctionId === auction.productId 
                        ? 'bg-gray-200 cursor-not-allowed' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => onEndAuctionClick(auction.productId)}
                    disabled={endingAuctionId === auction.productId}
                    title="경매 종료"
                  >
                    {endingAuctionId === auction.productId ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              진행 중인 경매가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 보류 중인 경매 */}
      <span className="text-[#111416] text-xl font-bold my-5 ml-4">
        보류 중인 경매
      </span>
      <div className="flex flex-col items-start self-stretch px-4">
        <div className="flex flex-col self-stretch overflow-x-auto w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] w-full items-center bg-gray-50 border-b-2 border-gray-300 px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">상품 ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">제품명</span>
            <span className="text-[#616161] text-sm font-bold text-center">시작일시</span>
            <span className="text-[#616161] text-sm font-bold text-center">시작가</span>
            <span className="text-[#616161] text-sm font-bold text-center">상태</span>
            <span className="text-[#616161] text-sm font-bold text-center">작업</span>
          </div>
          <div className="self-stretch">
            {pendingAuctions.length > 0 ? (
              pendingAuctions.map((auction) => (
                <div
                  key={auction.productId}
                  className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] w-full items-center border-b border-gray-200 last:border-b-0 px-4 py-4 gap-2 bg-white"
                >
                  <span className="truncate whitespace-nowrap text-[#616161] text-base text-center">
                    {auction.productId}
                  </span>
                  <span className="truncate whitespace-nowrap text-black text-base text-center">
                    {auction.productName}
                  </span>
                  <span className="text-[#616161] text-base text-center">
                    {formatDate(auction.scheduledStartTime)}
                  </span>
                  <span className="text-[#616161] text-base text-center">
                    {formatPrice(auction.startPrice)}
                  </span>
                  <div className="flex justify-center">
                    <button
                      className="bg-[#F4FEFC] text-[#616161] text-sm py-1 px-3 rounded-lg hover:bg-[#E8FDF8] transition-colors cursor-pointer"
                      onClick={() => onStatusClick("보류중", auction.productId)}
                    >
                      보류중
                    </button>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => onEditClick(auction.productId)}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                보류 중인 경매가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 완료된 경매 */}
      <span className="text-[#111416] text-xl font-bold my-5 ml-4">
        완료된 경매
      </span>
      <div className="flex flex-col items-start self-stretch px-4 pb-4">
        <div className="flex flex-col items-start self-stretch overflow-x-auto w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] w-full items-center bg-gray-50 mb-0.5 border-b-2 border-gray-300 px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">상품 ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">제품명</span>
            <span className="text-[#616161] text-sm font-bold text-center">최종 입찰가</span>
            <span className="text-[#616161] text-sm font-bold text-center">종료 날짜</span>
            <span className="text-[#616161] text-sm font-bold text-center">상태</span>
            <span className="text-[#616161] text-sm font-bold text-center">배송 단계</span>
            <span className="text-[#616161] text-sm font-bold text-center">배송 관리</span>
          </div>
          {/* Table Rows */}
          {endedAuctions.length > 0 ? (
            endedAuctions.map((auction) => (
              <div
                key={auction.productId}
                className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] w-full items-center border-b border-gray-200 last:border-b-0 px-4 py-4 gap-2 bg-white"
              >
                <span className="truncate whitespace-nowrap text-[#616161] text-base text-center">
                  {auction.productId}
                </span>
                <span className="truncate whitespace-nowrap text-black text-base text-center">
                  {auction.productName}
                </span>
                <span className="text-[#616161] text-base text-center">
                  {formatPrice(auction.currentHighestBid)}
                </span>
                <span className="text-[#616161] text-base text-center">
                  {auction.actualEndTime ? formatDate(auction.actualEndTime) : "미정"}
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
                    onClick={() => onShippingClick(auction.productId)}
                  >
                    배송 관리
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              완료된 경매가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center self-stretch pt-5">
          <div className="flex items-start">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <span
                key={page}
                className={`font-bold my-2.5 mx-2 cursor-pointer hover:text-blue-500 transition-colors ${
                  page === currentPage ? "text-black text-base" : "text-[#717680] text-sm"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AuctionContent
