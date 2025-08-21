"use client"

import { Filter, Menu } from "lucide-react"
import { useMemo, useState } from "react"


type Inquiry = {
  id: string
  priority: "일반" | "긴급"
  type: "경매 문의" | "제품 배송"
  userId: string
  content: string
  title?: string
  date: string
  status: "미응답" | "완료"
  response?: string
}

function CustomersContent() {
  // --- 상태 선언 ---
  const [customerFilter, setCustomerFilter] = useState("전체") // 선택된 필터
  const [showFilter, setShowFilter] = useState(false) // dropdown 표시 여부
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)


  // 모달 내부 입력 필드 상태
  const [responseTitle, setResponseTitle] = useState("")
  const [responseContent, setResponseContent] = useState("")

  const inquiries = useMemo<Inquiry[]>(
    () => [
      { id: "#12348", priority: "일반", type: "경매 문의", userId: "pandas12", content: "경매 진행 방식에 대해 궁금합니다", title: "경매 진행 방식 문의", date: "2024-01-20", status: "완료", response: "경매는 시작가부터 시작하여 최고가 입찰자가 낙찰받는 방식입니다." },
      { id: "#12349", priority: "긴급", type: "제품 배송", userId: "rabbit2", content: "배송이 지연되고 있습니다", title: "배송 지연 문의", date: "2024-01-20", status: "미응답" },
      { id: "#12350", priority: "일반", type: "경매 문의", userId: "pandas12", content: "낙찰 후 결제 방법을 알고 싶습니다", title: "결제 방법 문의", date: "2024-01-20", status: "완료", response: "낙찰 후 24시간 내에 결제를 완료해주시면 됩니다." },
      { id: "#12351", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "배송 주소 변경 요청", title: "배송 주소 변경", date: "2024-01-20", status: "미응답" },
      { id: "#12352", priority: "일반", type: "경매 문의", userId: "pandas12", content: "비밀번호 재설정 문의", title: "계정 문의", date: "2024-01-20", status: "완료", response: "이메일로 비밀번호 재설정 링크를 발송해드렸습니다." },
      { id: "#12353", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "결제 오류 발생", date: "2024-01-20", status: "미응답" },
      { id: "#12354", priority: "일반", type: "경매 문의", userId: "pandas12", content: "경매 취소 정책 문의", title: "경매 취소 정책", date: "2024-01-20", status: "완료", response: "경매 시작 전까지는 취소가 가능합니다." },
      { id: "#12355", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "당일 배송 가능 여부", date: "2024-01-20", status: "미응답" },
      { id: "#12356", priority: "일반", type: "경매 문의", userId: "pandas12", content: "회원가입 인증 문제", date: "2024-01-20", status: "완료", response: "인증 메일을 다시 발송해드렸습니다." },
      { id: "#12357", priority: "긴급", type: "제품 배송", userId: "pandas12", content: "중복 결제 환불 요청", date: "2024-01-20", status: "미응답" },
    ],
    [],
  )

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((q) => {
      if (customerFilter === "전체") return true
      if (customerFilter === "미응답") return q.status === "미응답"
      if (customerFilter === "완료") return q.status === "완료"
      return true
    })
  }, [inquiries, customerFilter])

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage)

// --- 모달/답변 이벤트 ---
  const handleResponseClick = (inquiry: Inquiry) => {
    if (inquiry.status === "완료") return
    setSelectedInquiry(inquiry)
    setShowDetailModal(true)
    setResponseTitle(inquiry.response ? `RE: ${inquiry.title}` : "")
    setResponseContent(inquiry.response ?? "")
  }

  const handleModalClose = () => {
    setShowDetailModal(false)
    setSelectedInquiry(null)
    setResponseTitle("")
    setResponseContent("")
  }

  const handleRegisterResponse = () => {
    if (responseTitle.trim() && responseContent.trim()) {
      alert("답변이 등록되었습니다.")
      handleModalClose()
    }
  }

  return (
    // --- [주석] 이 div의 gap-6 값을 조절하여 제목, 필터, 표 사이의 전체 세로 간격을 변경할 수 있습니다. ---
    <div className="flex flex-col items-start self-stretch gap-6 p-4">
      {/* --- [주석] 이 span의 text-4xl 값을 조절하여 '고객 문의' 제목의 크기를 변경할 수 있습니다. --- */}
      <span className="text-[#111416] text-4xl font-bold">고객 문의</span>
      
     

    
    
       {/* --- 필터 영역 --- */}
      <div className="flex items-start self-stretch relative">
      {/* 필터 버튼 */}
      <button
            className="flex shrink-0 items-center bg-white text-left py-2.5 px-6 gap-2 rounded-lg border border-solid border-[#D5D6DA]"
            style={{ boxShadow: "rgba(10, 12, 18, 0.05) 0px 1px 2px" }}
            onClick={() => setShowFilter(!showFilter)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
              <path d="M4 6h16"></path>
            </svg>
            <span className="text-[#414651] text-sm font-bold">필터</span>
          </button>

      {/* Filter Dropdown */}
      {showFilter && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
          {["전체", "미응답", "완료"].map((filter) => (
            <button
              key={filter}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                customerFilter === filter ? "font-semibold text-blue-600" : ""
              }`}
              onClick={() => {
                setCustomerFilter(filter)
                setCurrentPage(1)
                setShowFilter(false)
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>





        {/* --- 테이블 영역 --- */}
      <div className="w-full overflow-x-auto">
        <div className="grid min-w-[1024px] grid-cols-[0.75fr_0.75fr_1fr_1fr_2fr_1fr_1fr] bg-white px-4 py-3 gap-2 border-b-4 border-black">
          <span className="text-[#616161] text-base font-bold text-left pl-2">ID</span>
          <span className="text-[#616161] text-base font-bold text-left">기준</span>
          <span className="text-[#616161] text-base font-bold text-left">문의 종류</span>
          <span className="text-[#616161] text-base font-bold text-left">작성 아이디</span>
          <span className="text-[#616161] text-base font-bold text-left">문의 내용</span>
          <span className="text-[#616161] text-base font-bold text-center">날짜</span>
          <span className="text-[#616161] text-base font-bold text-center">처리상태</span>
        </div>

        {currentInquiries.map((item, index) => (
          <div
            key={`${item.id}-${item.userId}-${index}`}
            className={`grid min-w-[1024px] grid-cols-[0.75fr_0.75fr_1fr_1fr_2fr_1fr_1fr] items-center px-4 py-6 gap-2 border-y border-gray-200 ${
              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <span className="text-black text-lg text-left pl-2">{item.id}</span>
            <span className="text-black text-lg text-left">{item.priority}</span>
            <span className="text-black text-lg text-left">{item.type}</span>
            <span className="text-black text-lg text-left">{item.userId}</span>
            <span className="text-black text-lg truncate text-left" title={item.content}>
              {item.content}
            </span>
            <span className="text-black text-lg text-center">{item.date}</span>
            <div className="flex justify-center">
              <button
                className={`flex items-center justify-center w-22 h-13 text-base transition-opacity ${
                  item.status === "미응답" 
                  ? "bg-black text-white hover:opacity-80 cursor-pointer" 
                  : "bg-transparent text-gray-500 cursor-default"
                }`}
                onClick={() => handleResponseClick(item)}
                disabled={item.status === "완료"}
              >
                {item.status}
              </button>
            </div>
          </div>
        ))}

          {/* --- 페이지네이션 --- */}
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

                {/* --- 모달 --- */}
      {showDetailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-start my-6 mx-8">
              <span className="text-[#1C160C] text-2xl font-bold mb-6">고객 문의</span>

              <div className="flex items-center mb-6">
                <span className="text-[#757575] text-base font-bold mr-[15px]">ID</span>
                <span className="text-black text-lg mr-[175px]">{selectedInquiry.id}</span>
                <span className="text-[#757575] text-base font-bold mr-3.5">날짜</span>
                <span className="text-black text-lg">{selectedInquiry.date}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-[#757575] text-base font-bold mr-3.5">기준</span>
                <span className="text-black text-lg mr-[193px]">{selectedInquiry.priority}</span>
                <span className="text-[#757575] text-base font-bold mr-3.5">문의 종류</span>
                <span className="text-black text-lg">{selectedInquiry.type}</span>
              </div>
              <div className="flex items-center mb-2 gap-[15px]">
                <span className="text-[#757575] text-base font-bold">회원 아이디</span>
                <span className="text-black text-lg">{selectedInquiry.userId}</span>
              </div>
              <div className="flex items-center mb-2 gap-3.5">
                <span className="text-[#757575] text-base font-bold">제목</span>
                <span className="text-black text-lg">{selectedInquiry.title ?? "제품 사이즈를 문의드립니다!"}</span>
              </div>
              <span className="text-[#757575] text-base font-bold mb-2">문의 내용</span>
              <span className="text-black text-lg mb-[23px]">{selectedInquiry.content}</span>
              <div className="self-stretch bg-[#E0E0E0] h-[1px] mb-[23px]"></div>

              <span className="text-[#111416] text-xl font-bold mb-3">문의 답변</span>
              <span className="text-black text-lg mb-[7px]">제목</span>
              <div className="flex flex-col items-start self-stretch bg-white py-[9px] mb-1 border border-solid border-[#FF5142]">
                <input 
                  type="text" 
                  placeholder="문의 제목" 
                  className="text-[#9E9E9E] text-lg ml-4 bg-transparent focus:outline-none w-full"
                  value={responseTitle}
                  onChange={(e) => setResponseTitle(e.target.value)}
                />
              </div>
              <span className="text-[#E6493B] text-sm mb-4">제목을 입력해주세요</span>
              <div className="flex flex-col items-start self-stretch mb-1.5">
                <span className="text-black text-lg">답변</span>
                <div className="flex flex-col items-start self-stretch bg-white py-2.5 border border-solid border-[#FCA19B]">
                  <textarea 
                    placeholder="문의 내용 입력해주세요" 
                    className="text-[#9E9E9E] text-lg ml-3.5 bg-transparent focus:outline-none w-full resize-none" 
                    rows={4}
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                  />
                </div>
              </div>
              <span className="text-[#F04437] text-base mb-[23px]">문의 내용을 입력해주세요</span>
              <div className="flex items-start self-stretch gap-[13px]">
                <button
                  onClick={handleRegisterResponse}
                  className="flex-1 bg-black py-[18px] text-white text-base font-bold hover:bg-gray-800 transition-colors text-center"
                >
                  등록하기
                </button>
                <button
                  onClick={handleModalClose}
                  className="flex-1 bg-white py-[18px] text-black text-base font-bold border border-[#9E9E9E] hover:bg-gray-50 transition-colors text-center"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersContent  