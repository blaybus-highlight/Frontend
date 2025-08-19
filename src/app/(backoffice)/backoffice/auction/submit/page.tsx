"use client"

import React, { useState } from "react"

export default function AuctionSubmitPage() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const closeModal = () => setIsModalOpen(false);

    if (!isModalOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={closeModal}
        >
            <div
                // [수정] p-8 -> p-6 로 내부 여백 축소
                className="bg-white shadow-xl w-full max-w-2xl p-6 m-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                {/* [수정] mb-6 -> mb-4 로 제목 아래 여백 축소 */}
                <h2 className="text-2xl font-bold text-center mb-4">경매 설정</h2>

                {/* [수정] space-y-6 -> space-y-4 로 요소 간 세로 간격 축소 */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="productName" className="block text-base font-semibold text-black mb-1">상품명</label>
                        <input type="text" id="productName" placeholder="상품명을 입력하세요" className="peer w-full border-gray-300 shadow-sm p-2 border" required />
                        <p className="invisible peer-invalid:visible text-red-500 text-xs mt-1">상품명을 입력해주세요</p>
                    </div>

                    {/* [수정] pt-4 -> pt-2 로 제목 위 여백 축소 */}
                    <h3 className="text-2xl font-bold text-left pt-2">경매 일시</h3>
                    
                    <div>
                        <label htmlFor="startTime" className="block text-base font-semibold text-black mb-1">경매 시작일시</label>
                        <div className="flex items-start gap-2">
                             <div className="flex-1">
                                <input type="datetime-local" id="startTime" className="peer w-full border-gray-300 shadow-sm p-2 border invalid:text-gray-400 valid:text-black" required />
                                <p className="invisible peer-invalid:visible text-red-500 text-xs mt-1">경매 시작일시를 선택해주세요</p>
                            </div>
                            <button type="button" className="bg-black text-white hover:bg-gray-800 px-4 py-2 mt-px">즉시 시작</button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="endTime" className="block text-base font-semibold text-black mb-1">경매 마감일시</label>
                        <input type="datetime-local" id="endTime" className="peer w-full border-gray-300 shadow-sm p-2 border invalid:text-gray-400 valid:text-black" required />
                        <p className="invisible peer-invalid:visible text-red-500 text-xs mt-1">경매 마감일시를 선택해주세요</p>
                    </div>

                    {/* [수정] pt-4 -> pt-2 로 제목 위 여백 축소 */}
                    <h3 className="text-2xl font-bold text-left pt-2">경매가</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startPrice" className="block text-base font-semibold text-black mb-1">시작 가격</label>
                            <input type="number" id="startPrice" placeholder="0" className="peer w-full border-gray-300 shadow-sm p-2 border" required />
                            <p className="invisible peer-invalid:visible text-red-500 text-xs mt-1">시작가격을 입력해주세요</p>
                        </div>
                        <div>
                            <label htmlFor="buyNowPrice" className="block text-base font-semibold text-black mb-1">즉시 구매 가격</label>
                            <input type="number" id="buyNowPrice" placeholder="0" className="peer w-full border-gray-300 shadow-sm p-2 border" required />
                            <p className="invisible peer-invalid:visible text-red-500 text-xs mt-1">즉시 구매가격을 입력해주세요</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-base font-semibold text-black mb-1">경매가 최대 증액 범위</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                {/* [삭제] '금액 (원)' 소제목 라벨 제거 */}
                                <input type="number" id="maxBidAmount" placeholder="0" className="w-full border-gray-300 shadow-sm p-2 border" />
                                <p className="text-black text-xs mt-1 font-bold">예상 첫 경매 최대 입력가</p>
                            </div>
                            <div>
                                {/* [삭제] '비율 (%)' 소제목 라벨 제거 */}
                                <input type="number" id="maxBidPercent" placeholder="0" className="peer w-full border-gray-300 shadow-sm p-2 border" required />
                                <p className="invisible peer-invalid:visible text-red-500 text-xs mt-1">즉시 구매가격을 입력해주세요</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* [수정] mt-8 -> mt-6 로 버튼 위 여백 축소 */}
                <div className="flex gap-4 mt-6">
                    <button type="button" className="bg-black text-white hover:bg-gray-800 py-3 flex-1">설정하기</button>
                    <button type="button" onClick={closeModal} className="bg-white text-black border border-gray-300 hover:bg-gray-100 py-3 flex-1">취소</button>
                </div>
            </div>
        </div>
    );
}