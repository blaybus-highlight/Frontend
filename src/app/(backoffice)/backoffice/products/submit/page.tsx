"use client"

import { useState } from "react"
import { PageHeader } from "@/components/backoffice/auction/PageHeader"
import { TabNavigation } from "@/components/backoffice/auction/TabNavigation"
import { IndividualRegistrationSection } from "@/components/backoffice/auction/IndividualRegistrationSection"
import { BulkUploadSection } from "@/components/backoffice/auction/BulkUploadSection"
import { registerProduct, saveProductDraft } from "@/api/auction"
import { transformFormDataToApiRequest, validateFormData } from "@/utils/productFormUtils"

// --- 메인 페이지 컴포넌트 ---
export default function AuctionSubmitPage() {
  // '개별 등록', '일괄 등록' 탭 상태 관리
  const [activeTab, setActiveTab] = useState("individual");
  
  // 로딩 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // 모든 폼 입력 값을 하나의 객체로 관리
  const [formData, setFormData] = useState<Record<string, string>>({
    salesCategory: "", productCategory: "", productName: "", size: "",
    quantity: "", material: "", productionYear: "", brandName: "",
    productCondition: "", conditionDescription: "", productDescription: "",
    productHistory: "", expectedEffect: "", additionalInfo: "",
  });

  // 어떤 입력 필드든 값이 변경될 때 호출되는 단일 이벤트 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (isSubmitting) return; // 중복 제출 방지
    
    try {
      setIsSubmitting(true);
      
      // 폼 데이터 유효성 검사
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        alert(`입력 오류:\n${validation.errors.join('\n')}`);
        return;
      }

      // API 요청 데이터로 변환
      const apiRequestData = transformFormDataToApiRequest(formData);
      
      // 상품 등록 API 호출
      const response = await registerProduct(apiRequestData);
      
      if (response.success) {
        alert('상품이 성공적으로 등록되었습니다.');
        // 폼 초기화 또는 다른 페이지로 이동
        setFormData({
          salesCategory: "", productCategory: "", productName: "", size: "",
          quantity: "", material: "", productionYear: "", brandName: "",
          productCondition: "", conditionDescription: "", productDescription: "",
          productHistory: "", expectedEffect: "", additionalInfo: "",
        });
      } else {
        alert(`상품 등록 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('상품 등록 중 오류 발생:', error);
      alert('상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 초안 저장 핸들러
  const handleSaveDraft = async () => {
    if (isSavingDraft) return; // 중복 저장 방지
    
    try {
      setIsSavingDraft(true);
      
      // API 요청 데이터로 변환 (draft: true로 설정)
      const apiRequestData = transformFormDataToApiRequest(formData);
      apiRequestData.draft = true;
      
      // 초안 저장 API 호출
      const response = await saveProductDraft(apiRequestData);
      
      if (response.success) {
        alert('상품이 초안으로 저장되었습니다.');
      } else {
        alert(`초안 저장 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('초안 저장 중 오류 발생:', error);
      alert('초안 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-60 py-6">
      {/* 페이지 최상단 헤더 */}
      <PageHeader />
      
      {/* 탭 네비게이션 바 */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 현재 활성화된 탭에 따라 다른 내용을 표시 */}
      {activeTab === "individual" ? (
        <IndividualRegistrationSection 
          formData={formData}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          isSubmitting={isSubmitting}
          isSavingDraft={isSavingDraft}
        />
      ) : (
        <BulkUploadSection />
      )}
    </div>
  );
}

