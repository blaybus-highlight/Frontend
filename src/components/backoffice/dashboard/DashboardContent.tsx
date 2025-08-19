import vintageWatch from "@/assets/vintage-watch.png";

const DashboardContent = () => {
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
                  12
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start py-[25px] mr-[17px] rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  보류중
                </span>
                <span className="text-[#111416] text-2xl font-bold mb-[1px] mx-[25px]">
                  8
                </span>
              </div>
              <div className="flex flex-1 flex-col items-start py-[25px] rounded border border-solid border-[#DBE0E5]">
                <span className="text-[#424242] text-base mb-[9px] mx-[25px]">
                  완료됨
                </span>
                <span className="text-[#111416] text-2xl font-bold mb-[1px] mx-[25px]">
                  35
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
                <div className="flex flex-col items-start bg-background py-[13px] px-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[#111416] text-base font-bold">
                      경매 #20231027-001 검토
                    </span>
                  </div>
                  <span className="text-[#616161] text-sm mr-12">
                    경매 ID: 20231027-001
                  </span>
                </div>
                <div className="flex flex-col items-start bg-background py-[13px] pl-4 pr-[43px]">
                  <span className="text-[#111416] text-base font-bold mr-[72px]">
                    제품 등록 승인
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#616161] text-sm">
                      제품 ID: P-20231026-005
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Auction Feed */}
              <div className="flex flex-1 flex-col items-start">
                <span className="text-[#111416] text-xl font-bold my-5 ml-4">
                  실시간 경매 피드
                </span>
                <div className="flex items-start bg-background py-3 px-4 gap-[15px]">
                  <img
                    src={vintageWatch.src}
                    alt="Vintage Watch"
                    className="w-[70px] h-[70px] object-fill"
                  />
                  <div className="flex flex-col shrink-0 items-start py-0.5">
                    <span className="text-[#111416] text-base font-bold mb-[1px] mr-[103px]">
                      Lot 3 빈티지 시계
                    </span>
                    <span className="text-[#616161] text-sm mb-[1px] mr-[101px]">
                      현재 입찰가 5,500원
                    </span>
                    <span className="text-[#616161] text-sm mb-[1px] mr-[77px]">
                      경매 ID 20231027-002
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
