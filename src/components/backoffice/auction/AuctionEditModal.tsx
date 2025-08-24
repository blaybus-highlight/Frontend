"use client"

import { useState, useEffect } from "react"
import { updateAuction, UpdateAuctionRequest, getAuctionById } from "@/api/auction"

interface AuctionEditModalProps {
  isOpen: boolean
  onClose: () => void
  auctionId: number | null
  onSuccess: () => void
}

const AuctionEditModal = ({ isOpen, onClose, auctionId, onSuccess }: AuctionEditModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    shippingCost: '',
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 모달이 열릴 때 경매 데이터 가져오기
  useEffect(() => {
    const fetchAuctionData = async () => {
      if (isOpen && auctionId) {
        setIsLoading(true)
        try {
          const auctionData = await getAuctionById(auctionId.toString())
          console.log('받은 경매 데이터:', auctionData)
          
          // 날짜와 시간 분리
          const formatDate = (dateString: string) => {
            const date = new Date(dateString)
            return date.toISOString().split('T')[0] // YYYY-MM-DD 형식
          }
          
          const formatTime = (dateString: string) => {
            const date = new Date(dateString)
            return date.toTimeString().slice(0, 5) // HH:MM 형식
          }
          
          setFormData({
            productName: auctionData.product?.productName || '',
            startDate: auctionData.scheduledStartTime ? formatDate(auctionData.scheduledStartTime) : '',
            startTime: auctionData.scheduledStartTime ? formatTime(auctionData.scheduledStartTime) : '',
            endDate: auctionData.scheduledEndTime ? formatDate(auctionData.scheduledEndTime) : '',
            endTime: auctionData.scheduledEndTime ? formatTime(auctionData.scheduledEndTime) : '',
            startPrice: auctionData.startPrice?.toString() || '',
            buyNowPrice: auctionData.buyItNowPrice?.toString() || '',
            maxBidAmount: auctionData.maxBid?.toString() || '',
            minimumBid: auctionData.bidUnit?.toString() || '',
            pickupOption: auctionData.isPickupAvailable ? 'possible' : 'impossible',
            shippingCost: auctionData.shippingFee?.toString() || '',
            description: auctionData.description || ''
          })
          setErrors({})
        } catch (error) {
          console.error("경매 데이터 조회 실패:", error)
          alert("경매 데이터를 불러오는데 실패했습니다.")
          onClose()
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchAuctionData()
  }, [isOpen, auctionId, onClose])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // 에러 제거
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.startDate) newErrors.startDate = '시작 날짜를 선택해주세요'
    if (!formData.startTime) newErrors.startTime = '시작 시간을 선택해주세요'
    if (!formData.endDate) newErrors.endDate = '마감 날짜를 선택해주세요'
    if (!formData.endTime) newErrors.endTime = '마감 시간을 선택해주세요'
    if (!formData.startPrice) newErrors.startPrice = '시작 가격을 입력해주세요'
    if (!formData.buyNowPrice) newErrors.buyNowPrice = '즉시 구매 가격을 입력해주세요'
    if (!formData.maxBidAmount) newErrors.maxBidAmount = '최대 인상폭을 입력해주세요'
    if (!formData.minimumBid) newErrors.minimumBid = '최소 인상폭을 입력해주세요'
    if (!formData.pickupOption) newErrors.pickupOption = '픽업 여부를 선택해주세요'
    if (!formData.shippingCost) newErrors.shippingCost = '배송비용을 입력해주세요'

    // 날짜 유효성 검사
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = '마감 시간은 시작 시간보다 이후여야 합니다'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !auctionId) {
      return
    }

    setIsSubmitting(true)

         try {
       console.log('수정할 경매 ID:', auctionId)
       
       // 날짜와 시간을 합쳐서 UTC 시간으로 변환
       const formatDateTime = (date: string, time: string) => {
         if (!date || !time) return ''
         // 한국 시간을 UTC로 변환 (9시간 빼기)
         const koreaDateTime = new Date(`${date}T${time}:00+09:00`)
         return koreaDateTime.toISOString()
       }

       const scheduledStartTime = formatDateTime(formData.startDate, formData.startTime)
       const scheduledEndTime = formatDateTime(formData.endDate, formData.endTime)

       const auctionData: UpdateAuctionRequest = {
         scheduledStartTime: scheduledStartTime,
         scheduledEndTime: scheduledEndTime,
         startPrice: parseInt(formData.startPrice) || 0,
         bidUnit: parseInt(formData.minimumBid) || 1000,
         maxBid: parseInt(formData.maxBidAmount) || 0,
         minimumBid: parseInt(formData.minimumBid) || 1000,
         buyItNowPrice: parseInt(formData.buyNowPrice) || 10000,
         shippingFee: parseInt(formData.shippingCost) || 0,
         isPickupAvailable: formData.pickupOption === 'possible',
         description: formData.description || formData.productName
       }

       console.log('전송할 경매 데이터:', auctionData)
       await updateAuction(auctionId, auctionData)
      alert("경매가 성공적으로 수정되었습니다.")
      onSuccess()
      onClose()
         } catch (error: any) {
       console.error("경매 수정 실패:", error)
       console.error("에러 응답:", error.response?.data)
       console.error("에러 상태:", error.response?.status)
       
       const errorMessage = error.response?.data?.message || "경매 수정에 실패했습니다. 다시 시도해주세요."
       alert(errorMessage)
     } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

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
        
        <h2 className="text-2xl font-bold text-center mb-4">경매 수정</h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">경매 데이터를 불러오는 중...</div>
          </div>
        ) : (
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input 
                    type="date" 
                    id="startDate" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full shadow-sm p-2 border ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required 
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
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
                      errors.startTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required 
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
                  )}
                </div>
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
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required 
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
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
                      errors.endTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required 
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-left pt-2">경매가</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startPrice" className="block text-base font-semibold text-black mb-1">시작 가격</label>
                <input 
                  type="text" 
                  id="startPrice" 
                  name="startPrice"
                  value={formData.startPrice}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className={`w-full shadow-sm p-2 border ${
                    errors.startPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required 
                />
                {errors.startPrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.startPrice}</p>
                )}
              </div>
              <div>
                <label htmlFor="buyNowPrice" className="block text-base font-semibold text-black mb-1">즉시 구매 가격</label>
                <input 
                  type="text" 
                  id="buyNowPrice" 
                  name="buyNowPrice"
                  value={formData.buyNowPrice}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className={`w-full shadow-sm p-2 border ${
                    errors.buyNowPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required 
                />
                {errors.buyNowPrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.buyNowPrice}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxBidAmount" className="block text-base font-semibold text-black mb-1">최대 인상폭</label>
                  <input 
                    type="text" 
                    id="maxBidAmount" 
                    name="maxBidAmount"
                    value={formData.maxBidAmount}
                    onChange={handleInputChange}
                    placeholder="0" 
                    className={`w-full shadow-sm p-2 border ${
                      errors.maxBidAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required 
                  />
                  {errors.maxBidAmount && (
                    <p className="text-red-500 text-xs mt-1">{errors.maxBidAmount}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="minimumBid" className="block text-base font-semibold text-black mb-1">최소 인상폭</label>      
                  <input 
                    type="text" 
                    id="minimumBid" 
                    name="minimumBid"
                    value={formData.minimumBid}
                    onChange={handleInputChange}
                    placeholder="0" 
                    className={`w-full shadow-sm p-2 border ${
                      errors.minimumBid ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required 
                  />
                  {errors.minimumBid && (
                    <p className="text-red-500 text-xs mt-1">{errors.minimumBid}</p>
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
                    errors.pickupOption ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">픽업 여부를 선택하세요</option>
                  <option value="possible">가능</option>
                  <option value="impossible">불가능</option>
                </select>
                {errors.pickupOption && (
                  <p className="text-red-500 text-xs mt-1">{errors.pickupOption}</p>
                )}
              </div>
              <div>
                <label htmlFor="shippingCost" className="block text-base font-semibold text-black mb-1">배송비용</label>
                <input 
                  type="text" 
                  id="shippingCost" 
                  name="shippingCost"
                  value={formData.shippingCost}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className={`w-full shadow-sm p-2 border ${
                    errors.shippingCost ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required 
                />
                {errors.shippingCost && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingCost}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-6">
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-gray-800 py-3 flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : '수정하기'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="bg-white text-black border border-gray-300 hover:bg-gray-100 py-3 flex-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuctionEditModal
