"use client"

import React, { useState, useEffect } from "react"
import { createAuction, CreateAuctionRequest } from "@/api/auction"
import { ProductListItem } from "@/types/auction"

interface AuctionSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProduct: ProductListItem | null;
}

export default function AuctionSubmitModal({ isOpen, onClose, selectedProduct }: AuctionSubmitModalProps) {
    const [formData, setFormData] = useState({
        productName: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        startPrice: '',
        buyNowPrice: '',
        maxBidAmount: '',
        minimumBid: '',
        pickupOption: '',
        shippingCost: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // 선택된 상품이 변경되면 폼 데이터 업데이트
    useEffect(() => {
        if (selectedProduct) {
            setFormData(prev => ({
                ...prev,
                productName: selectedProduct.productName
            }));
        }
    }, [selectedProduct]);

    if (!isOpen) {
        // 모달이 닫힐 때 상태 초기화
        if (isSubmitted) {
            setIsSubmitted(false);
            setFieldErrors({});
        }
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const setCurrentDateTime = () => {
        // 한국 시간대로 현재 시간 계산
        const now = new Date();
        const koreaTimeOffset = 9 * 60; // 한국은 UTC+9
        const localTimeOffset = now.getTimezoneOffset(); // 로컬 시간대 오프셋 (분)
        const koreaTime = new Date(now.getTime() + (koreaTimeOffset + localTimeOffset) * 60 * 1000);
        
        const currentDate = koreaTime.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const currentTime = koreaTime.toTimeString().slice(0, 5); // HH:MM 형식
        
        setFormData(prev => ({
            ...prev,
            startDate: currentDate,
            startTime: currentTime
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitted(true);
        
        // 폼 유효성 검사
        const errors: Record<string, string> = {};
        
        if (!formData.startDate) errors.startDate = '시작 날짜를 선택해주세요';
        if (!formData.startTime) errors.startTime = '시작 시간을 선택해주세요';
        if (!formData.endDate) errors.endDate = '마감 날짜를 선택해주세요';
        if (!formData.endTime) errors.endTime = '마감 시간을 선택해주세요';
        if (!formData.startPrice) errors.startPrice = '시작 가격을 입력해주세요';
        if (!formData.buyNowPrice) errors.buyNowPrice = '즉시 구매 가격을 입력해주세요';
        if (!formData.maxBidAmount) errors.maxBidAmount = '최대 인상폭을 입력해주세요';
        if (!formData.minimumBid) errors.minimumBid = '최소 인상폭을 입력해주세요';
        if (!formData.pickupOption) errors.pickupOption = '픽업 여부를 선택해주세요';
        if (!formData.shippingCost) errors.shippingCost = '배송비용을 입력해주세요';
        
        // 날짜 유효성 검사
        if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
            
            // 한국 시간으로 현재 시간 계산
            const now = new Date();
            const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9 (한국 시간)
            
            // 현재 날짜와 시작 날짜가 같은 경우, 시간만 비교
            const today = koreaTime.toISOString().split('T')[0]; // YYYY-MM-DD 형식
            const startDateOnly = formData.startDate;
            
            if (startDateOnly === today) {
                // 오늘 날짜인 경우, 현재 시간보다 이후인지만 확인
                const currentTime = koreaTime.toTimeString().split(' ')[0]; // HH:MM:SS 형식
                if (formData.startTime <= currentTime) {
                    errors.startTime = '오늘 날짜를 선택한 경우, 시작 시간은 현재 시간보다 이후여야 합니다';
                }
            } else if (startDateOnly < today) {
                // 과거 날짜인 경우
                errors.startDate = '시작 날짜는 오늘 이후여야 합니다';
            }
            
            if (endDateTime <= startDateTime) {
                errors.endDate = '마감 시간은 시작 시간보다 이후여야 합니다';
            }
        }
        
        setFieldErrors(errors);
        
        // 오류가 있으면 제출하지 않음
        if (Object.keys(errors).length > 0) {
            return;
        }
        
        try {
            setLoading(true);
            setError(null);

            if (!selectedProduct) {
                setError('선택된 상품이 없습니다.');
                return;
            }

            // 날짜와 시간을 합쳐서 UTC 시간으로 변환
            const formatDateTime = (date: string, time: string) => {
                if (!date || !time) return '';
                // 한국 시간을 UTC로 변환 (9시간 빼기)
                const koreaDateTime = new Date(`${date}T${time}:00+09:00`);
                return koreaDateTime.toISOString();
            };

            const scheduledStartTime = formatDateTime(formData.startDate, formData.startTime);
            const scheduledEndTime = formatDateTime(formData.endDate, formData.endTime);

            const auctionData: CreateAuctionRequest = {
                productId: selectedProduct.id,
                startPrice: parseInt(formData.startPrice) || 0,
                bidUnit: parseInt(formData.minimumBid) || 1000,
                maxBid: parseInt(formData.maxBidAmount) || 0,
                minimumBid: parseInt(formData.minimumBid) || 1000,
                buyItNowPrice: parseInt(formData.buyNowPrice) || 10000,
                shippingFee: parseInt(formData.shippingCost) || 0,
                isPickupAvailable: formData.pickupOption === 'possible',
                scheduledStartTime: scheduledStartTime,
                scheduledEndTime: scheduledEndTime,
                description: formData.productName
            };

            const response = await createAuction(auctionData);
            console.log('경매 생성 성공:', response.data);
            
            // 성공 시 모달 닫기 및 상태 초기화
            onClose();
            setIsSubmitted(false);
            setFieldErrors({});
            alert('경매가 성공적으로 등록되었습니다.');
            
        } catch (err: any) {
            console.error('경매 생성 실패:', err);
            setError(err.response?.data?.message || '경매 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white shadow-xl w-full max-w-2xl p-6 m-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                                 <h2 className="text-2xl font-bold text-center mb-4">경매 설정</h2>

                 {selectedProduct && (
                     <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                         <h3 className="text-sm font-semibold text-gray-700 mb-2">선택된 상품</h3>
                         <p className="text-sm text-gray-600">상품명: {selectedProduct.productName}</p>
                         <p className="text-sm text-gray-600">카테고리: {selectedProduct.category}</p>
                         <p className="text-sm text-gray-600">상태: {selectedProduct.statusDescription}</p>
                     </div>
                 )}

                 <div className="space-y-4">
                     <div>
                         <label htmlFor="productName" className="block text-base font-semibold text-black mb-1">상품명</label>
                         <input 
                             type="text" 
                             id="productName" 
                             name="productName"
                             value={formData.productName}
                             onChange={handleInputChange}
                             placeholder="상품명을 입력하세요" 
                             className="peer w-full border-gray-300 shadow-sm p-2 border" 
                             required 
                             disabled
                         />
                         <p className="text-gray-500 text-xs mt-1">선택된 상품명이 자동으로 입력됩니다</p>
                     </div>

                    <h3 className="text-2xl font-bold text-left pt-2">경매 일시</h3>
                    
                                         <div>
                         <label htmlFor="startDate" className="block text-base font-semibold text-black mb-1">경매 시작일시</label>
                         <div className="flex items-start gap-2">
                             <div className="flex-1">
                                 <div className="grid grid-cols-2 gap-2">
                                     <div>
                                         <input 
                                             type="date" 
                                             id="startDate" 
                                             name="startDate"
                                             value={formData.startDate}
                                             onChange={handleInputChange}
                                             className={`w-full shadow-sm p-2 border ${
                                                 isSubmitted && fieldErrors.startDate ? 'border-red-500' : 'border-gray-300'
                                             }`}
                                             required 
                                         />
                                         {isSubmitted && fieldErrors.startDate && (
                                             <p className="text-red-500 text-xs mt-1">{fieldErrors.startDate}</p>
                                         )}
                                     </div>
                                     <div>
                                         <input 
                                             type="time" 
                                             id="startTime" 
                                             name="startTime"
                                             value={formData.startTime}
                                             onChange={handleInputChange}
                                             className={`w-full shadow-sm p-2 border ${
                                                 isSubmitted && fieldErrors.startTime ? 'border-red-500' : 'border-gray-300'
                                             }`}
                                             required 
                                         />
                                         {isSubmitted && fieldErrors.startTime && (
                                             <p className="text-red-500 text-xs mt-1">{fieldErrors.startTime}</p>
                                         )}
                                     </div>
                                 </div>
                             </div>
                             <button type="button" onClick={setCurrentDateTime} className="bg-black text-white hover:bg-gray-800 px-4 py-2 mt-px">즉시 시작</button>
                         </div>
                     </div>

                     <div>
                         <label htmlFor="endDate" className="block text-base font-semibold text-black mb-1">경매 마감일시</label>
                         <div className="grid grid-cols-2 gap-2">
                             <div>
                                 <input 
                                     type="date" 
                                     id="endDate" 
                                     name="endDate"
                                     value={formData.endDate}
                                     onChange={handleInputChange}
                                     className={`w-full shadow-sm p-2 border ${
                                         isSubmitted && fieldErrors.endDate ? 'border-red-500' : 'border-gray-300'
                                     }`}
                                     required 
                                 />
                                 {isSubmitted && fieldErrors.endDate && (
                                     <p className="text-red-500 text-xs mt-1">{fieldErrors.endDate}</p>
                                 )}
                             </div>
                             <div>
                                 <input 
                                     type="time" 
                                     id="endTime" 
                                     name="endTime"
                                     value={formData.endTime}
                                     onChange={handleInputChange}
                                     className={`w-full shadow-sm p-2 border ${
                                         isSubmitted && fieldErrors.endTime ? 'border-red-500' : 'border-gray-300'
                                     }`}
                                     required 
                                 />
                                 {isSubmitted && fieldErrors.endTime && (
                                     <p className="text-red-500 text-xs mt-1">{fieldErrors.endTime}</p>
                                 )}
                             </div>
                         </div>
                     </div>

                    <h3 className="text-2xl font-bold text-left pt-2">경매가</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                                                 <div>
                             <label htmlFor="startPrice" className="block text-base font-semibold text-black mb-1">시작 가격</label>
                             <input 
                                 type="number" 
                                 id="startPrice" 
                                 name="startPrice"
                                 value={formData.startPrice}
                                 onChange={handleInputChange}
                                 placeholder="0" 
                                 className={`w-full shadow-sm p-2 border ${
                                     isSubmitted && fieldErrors.startPrice ? 'border-red-500' : 'border-gray-300'
                                 }`}
                                 required 
                             />
                             {isSubmitted && fieldErrors.startPrice && (
                                 <p className="text-red-500 text-xs mt-1">{fieldErrors.startPrice}</p>
                             )}
                         </div>
                         <div>
                             <label htmlFor="buyNowPrice" className="block text-base font-semibold text-black mb-1">즉시 구매 가격</label>
                             <input 
                                 type="number" 
                                 id="buyNowPrice" 
                                 name="buyNowPrice"
                                 value={formData.buyNowPrice}
                                 onChange={handleInputChange}
                                 placeholder="0" 
                                 className={`w-full shadow-sm p-2 border ${
                                     isSubmitted && fieldErrors.buyNowPrice ? 'border-red-500' : 'border-gray-300'
                                 }`}
                                 required 
                             />
                             {isSubmitted && fieldErrors.buyNowPrice && (
                                 <p className="text-red-500 text-xs mt-1">{fieldErrors.buyNowPrice}</p>
                             )}
                         </div>
                    </div>
                    
                        <div>

                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label htmlFor="maxBidAmount" className="block text-base font-semibold text-black mb-1">최대 인상폭</label>
                                 <input 
                                     type="number" 
                                     id="maxBidAmount" 
                                     name="maxBidAmount"
                                     value={formData.maxBidAmount}
                                     onChange={handleInputChange}
                                     placeholder="0" 
                                     className={`w-full shadow-sm p-2 border ${
                                         isSubmitted && fieldErrors.maxBidAmount ? 'border-red-500' : 'border-gray-300'
                                     }`}
                                     required 
                                 />
                                 {isSubmitted && fieldErrors.maxBidAmount && (
                                     <p className="text-red-500 text-xs mt-1">{fieldErrors.maxBidAmount}</p>
                                 )}
                             </div>
                             <div>
                                 <label htmlFor="minimumBid" className="block text-base font-semibold text-black mb-1">최소 인상폭</label>      
                                 <input 
                                     type="number" 
                                     id="minimumBid" 
                                     name="minimumBid"
                                     value={formData.minimumBid}
                                     onChange={handleInputChange}
                                     placeholder="0" 
                                     className={`w-full shadow-sm p-2 border ${
                                         isSubmitted && fieldErrors.minimumBid ? 'border-red-500' : 'border-gray-300'
                                     }`}
                                     required 
                                 />
                                 {isSubmitted && fieldErrors.minimumBid && (
                                     <p className="text-red-500 text-xs mt-1">{fieldErrors.minimumBid}</p>
                                 )}
                             </div>
                         </div>
                     </div>

                     <h3 className="text-2xl font-bold text-left pt-2">배송 정보</h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                                                   <div>
                              <label htmlFor="pickupOption" className="block text-base font-semibold text-black mb-1">픽업여부</label>
                              <select 
                                  id="pickupOption" 
                                  name="pickupOption"
                                  value={formData.pickupOption}
                                  onChange={handleInputChange}
                                  className={`w-full shadow-sm p-2 border ${
                                      isSubmitted && fieldErrors.pickupOption ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  required
                              >
                                  <option value="">픽업 여부를 선택하세요</option>
                                  <option value="possible">가능</option>
                                  <option value="impossible">불가능</option>
                              </select>
                              {isSubmitted && fieldErrors.pickupOption && (
                                  <p className="text-red-500 text-xs mt-1">{fieldErrors.pickupOption}</p>
                              )}
                          </div>
                          <div>
                              <label htmlFor="shippingCost" className="block text-base font-semibold text-black mb-1">배송비용</label>
                              <input 
                                  type="number" 
                                  id="shippingCost" 
                                  name="shippingCost"
                                  value={formData.shippingCost}
                                  onChange={handleInputChange}
                                  placeholder="0" 
                                  className={`w-full shadow-sm p-2 border ${
                                      isSubmitted && fieldErrors.shippingCost ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  required 
                              />
                              {isSubmitted && fieldErrors.shippingCost && (
                                  <p className="text-red-500 text-xs mt-1">{fieldErrors.shippingCost}</p>
                              )}
                          </div>
                     </div>
                 </div>
                
                                 {error && (
                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                         {error}
                     </div>
                 )}
                 
                 <div className="flex gap-4 mt-6">
                     <button 
                         type="button" 
                         onClick={handleSubmit}
                         disabled={loading}
                         className="bg-black text-white hover:bg-gray-800 py-3 flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                         {loading ? '처리 중...' : '설정하기'}
                     </button>
                     <button 
                         type="button" 
                         onClick={onClose} 
                         disabled={loading}
                         className="bg-white text-black border border-gray-300 hover:bg-gray-100 py-3 flex-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                     >
                         취소
                     </button>
                 </div>
            </div>
        </div>
    );
}
