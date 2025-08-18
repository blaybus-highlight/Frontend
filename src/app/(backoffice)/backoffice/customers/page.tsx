"use client"

import { Menu } from "lucide-react"
import { useMemo, useState } from "react"

type Inquiry = {
  id: string
  priority: "일반" | "긴급"
  type: "경매 문의" | "제품 배송"
  userId: string
  content: string
  title?: string
  date: string
  status: "미응답" | "답변"
  response?: string
}

export default function CustomerPage() {
  const [customerFilter, setCustomerFilter] = useState<string>("전체")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  const inquiries = useMemo<Inquiry[]>(
    () => [
      { id: "#12348", priority: "일반", type: "경매 문의", userId: "pandas12", content: "경매 진행 방식에 대해 궁금합니다", title: "경매 진행 방식 문의", date: "2024-01-20", status: "답변", response: "경매는 시작가부터 시작하여 최고가 입찰자가 낙찰받는 방식입니다." },
      { id: "#12349", priority: "긴급", type: "제품 배송", userId: "rabbit2", content: "배송이 지연되고 있습니다", title: "배송 지연 문의", date: "2024-01-20", status: "미응답" },
      { id: "#12350", priority: "일반", type: "경매 문의", userId: "pandas12", content: "낙찰 후 결제 방법을 알고 싶습니다", title: "결제 방법 문의", date: "2024-01-20", status: "답변", response: "낙찰 후 24시간 내에 결제를 완료해주시면 됩니다." },
      { id: "#12351", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "배송 주소 변경 요청", title: "배송 주소 변경", date: "2024-01-20", status: "미응답" },
      { id: "#12352", priority: "일반", type: "경매 문의", userId: "pandas12", content: "비밀번호 재설정 문의", title: "계정 문의", date: "2024-01-20", status: "답변", response: "이메일로 비밀번호 재설정 링크를 발송해드렸습니다." },
      { id: "#12353", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "결제 오류 발생", date: "2024-01-20", status: "미응답" },
      { id: "#12354", priority: "일반", type: "경매 문의", userId: "pandas12", content: "경매 취소 정책 문의", title: "경매 취소 정책", date: "2024-01-20", status: "답변", response: "경매 시작 전까지는 취소가 가능합니다." },
      { id: "#12355", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "당일 배송 가능 여부", date: "2024-01-20", status: "미응답" },
      { id: "#12356", priority: "일반", type: "경매 문의", userId: "pandas12", content: "회원가입 인증 문제", date: "2024-01-20", status: "답변", response: "인증 메일을 다시 발송해드렸습니다." },
      { id: "#12357", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "중복 결제 환불 요청", date: "2024-01-20", status: "미응답" },
    ],
    [],
  )

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((q) => {
      if (customerFilter === "전체") return true
      if (customerFilter === "미답변") return q.status === "미응답"
      if (customerFilter === "답변완료") return q.status === "답변"
      if (customerFilter === "긴급") return q.priority === "긴급"
      if (customerFilter === "경매문의") return q.type === "경매 문의"
      if (customerFilter === "배송문의") return q.type === "제품 배송"
      return true
    })
  }, [inquiries, customerFilter])

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage)

  const handleCustomerFilterClick = () => {
    const filters = ["전체", "미답변", "답변완료", "긴급", "경매문의", "배송문의"]
    const next = (filters.indexOf(customerFilter) + 1) % filters.length
    setCustomerFilter(filters[next])
    setCurrentPage(1)
  }

  const handleResponseClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setShowDetailModal(true)
  }

  return (
    <>
      <div className="flex flex-col items-start self-stretch gap-3">
        <span className="text-[#111416] text-[28px] font-bold ml-4 mr-[300px]">고객 문의</span>
        <div className="w-80 h-[21px] ml-4"></div>
      </div>

      <div className="flex items-start self-stretch p-3 gap-3">
        <button
          className="flex items-center justify-center py-2 px-3 rounded border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
          onClick={handleCustomerFilterClick}
        >
          <Menu className="w-4 h-4 mr-2" />
          <span className="text-sm">필터</span>
        </button>
      </div>

      {/* Responsive grid table */}
      <div className="flex flex-col items-start self-stretch px-4">
        <div className="flex flex-col items-start self-stretch overflow-x-auto">
          <div className="grid min-w-[1024px] grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_1fr] bg-gray-50 border-b px-4 py-3 gap-2">
            <span className="text-[#616161] text-sm font-bold text-center">ID</span>
            <span className="text-[#616161] text-sm font-bold text-center">기준</span>
            <span className="text-[#616161] text-sm font-bold text-center">문의 종류</span>
            <span className="text-[#616161] text-sm font-bold text-center">작성 아이디</span>
            <span className="text-[#616161] text-sm font-bold text-center">문의 내용</span>
            <span className="text-[#616161] text-sm font-bold text-center">날짜</span>
            <span className="text-[#616161] text-sm font-bold text-center">처리상태</span>
          </div>

          {currentInquiries.map((item, index) => (
            <div
              key={`${item.id}-${item.userId}-${index}`}
              className="grid min-w-[1024px] grid-cols-[1fr_1fr_1fr_1fr_2fr_1fr_1fr] border-b last:border-b-0 px-4 py-4 gap-2 bg-white"
            >
              <span className="text-[#616161] text-base text-center">{item.id}</span>
              <span className="text-black text-base text-center">{item.priority}</span>
              <span className="text-black text-base text-center">{item.type}</span>
              <span className="text-black text-base text-center">{item.userId}</span>
              <span className="text-black text-base truncate text-center" title={item.content}>
                {item.content}
              </span>
              <span className="text-[#616161] text-base text-center">{item.date}</span>
              <div className="flex justify-center">
                <button
                  className={`text-white text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity cursor-pointer ${
                    item.status === "미응답" ? "bg-black" : "bg-gray-400"
                  }`}
                  onClick={() => handleResponseClick(item)}
                >
                  {item.status}
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center self-stretch mt-8 gap-2">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors ${
                  page === currentPage ? "bg-gray-200 font-bold" : "text-gray-600"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            {totalPages > 10 && (
              <>
                <span className="text-gray-400">...</span>
                <button
                  className="px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors text-gray-600"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-start my-6 mx-8">
              <span className="text-[#1C160C] text-2xl font-bold mb-6">고객 문의</span>

              <div className="flex items-center mb-6">
                <span className="text-[#757575] text-sm font-bold mr-[15px]">ID</span>
                <span className="text-black text-base mr-[175px]">{selectedInquiry.id}</span>
                <span className="text-[#757575] text-sm font-bold mr-3.5">날짜</span>
                <span className="text-black text-base">{selectedInquiry.date}</span>
              </div>

              <div className="flex items-center mb-2">
                <span className="text-[#757575] text-sm font-bold mr-3.5">기준</span>
                <span className="text-black text-base mr-[193px]">{selectedInquiry.priority}</span>
                <span className="text-[#757575] text-sm font-bold mr-3.5">문의 종류</span>
                <span className="text-black text-base">{selectedInquiry.type}</span>
              </div>

              <div className="flex items-center mb-2 gap-[15px]">
                <span className="text-[#757575] text-sm font-bold">회원 아이디</span>
                <span className="text-black text-base">{selectedInquiry.userId}</span>
              </div>

              <div className="flex items-center mb-2 gap-3.5">
                <span className="text-[#757575] text-sm font-bold">제목</span>
                <span className="text-black text-base">{selectedInquiry.title ?? "제품 사이즈를 문의드립니다!"}</span>
              </div>

              <span className="text-[#757575] text-sm font-bold mb-2">문의 내용</span>
              <span className="text-black text-base mb-[23px]">{selectedInquiry.content}</span>

              <div className="self-stretch bg-[#E0E0E0] h-[1px] mb-[23px]"></div>

              <span className="text-[#111416] text-lg font-bold mb-3">문의 답변</span>

              <span className="text-black text-base mb-[7px]">제목</span>
              <div className="flex flex-col items-start self-stretch bg-white py-[9px] mb-1 border border-solid border-[#FF5142]">
                <input id="response-title" type="text" placeholder="문의 제목" className="text-[#9E9E9E] text-base ml-4 bg-transparent focus:outline-none w-full" />
              </div>
              <span className="text-[#E6493B] text-xs mb-4">제목을 입력해주세요</span>

              <div className="flex flex-col items-start self-stretch mb-1.5">
                <span className="text-black text-base">답변</span>
                <div className="flex flex-col items-start self-stretch bg-white py-2.5 border border-solid border-[#FCA19B]">
                  <textarea id="response-content" placeholder="문의 내용 입력해주세요" className="text-[#9E9E9E] text-base ml-3.5 bg-transparent focus:outline-none w-full resize-none" rows={4} />
                </div>
              </div>
              <span className="text-[#F04437] text-sm mb-[23px]">문의 내용을 입력해주세요</span>

              <div className="flex items-start self-stretch gap-[13px]">
                <button
                  onClick={() => {
                    const titleEl = document.getElementById("response-title") as HTMLInputElement
                    const contentEl = document.getElementById("response-content") as HTMLTextAreaElement
                    const title = titleEl?.value ?? ""
                    const content = contentEl?.value ?? ""
                    if (title.trim() && content.trim()) {
                      setSelectedInquiry((prev) => (prev ? { ...prev, title, response: content, status: "답변" } : prev))
                      setShowDetailModal(false)
                      alert("답변이 등록되었습니다.")
                    }
                  }}
                  className="flex-1 bg-black py-[18px] text-white text-sm font-bold hover:bg-gray-800 transition-colors text-center"
                >
                  등록하기
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-white py-[18px] text-black text-sm font-bold border border-[#9E9E9E] hover:bg-gray-50 transition-colors text-center"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}