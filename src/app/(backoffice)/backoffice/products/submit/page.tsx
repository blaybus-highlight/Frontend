"use client"

import { useState } from "react"
import { PageHeader } from "@/components/backoffice/auction/PageHeader"
import { TabNavigation } from "@/components/backoffice/auction/TabNavigation"
import { IndividualRegistrationSection } from "@/components/backoffice/auction/IndividualRegistrationSection"
import { BulkUploadSection } from "@/components/backoffice/auction/BulkUploadSection"
import { registerProduct, createProductDraft, updateProductStatus, uploadProductImages } from "@/api/auction"
import { transformFormDataToApiRequest, validateFormData } from "@/utils/productFormUtils"

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  primary?: boolean;
}

// --- 메인 페이지 컴포넌트 ---
export default function ProductSubmitPage() {
  // '개별 등록', '일괄 등록' 탭 상태 관리
  const [activeTab, setActiveTab] = useState("individual");
  
  // 로딩 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // 이미지 상태 관리
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  
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

  // 이미지 변경 핸들러
  const handleImagesChange = (images: ImageFile[]) => {
    setUploadedImages(images);
  };

  // 폼 제출 핸들러 (3단계 프로세스)
  const handleSubmit = async () => {
    if (isSubmitting) return; // 중복 제출 방지
    
    let newProductId: number | null = null;
    
    try {
      setIsSubmitting(true);
      
      // 폼 데이터 유효성 검사
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        alert(`입력 오류:\n${validation.errors.join('\n')}`);
        return;
      }

      // =================================================================
      // 1단계: 상품 정보만으로 상품 등록 (이미지는 별도 업로드)
      // =================================================================
      alert('1/3: 상품 정보 저장 중...');
      const apiRequestData = transformFormDataToApiRequest(formData);
      
      const createResponse = await registerProduct(apiRequestData);
      
      console.log('생성된 상품 응답:', createResponse);
      
      // 다양한 응답 구조에 대응
      let productId: number | undefined;
      
      if (createResponse.success) {
        // 응답 구조에 따라 productId 추출
        productId = createResponse.productId || 
                   createResponse.data?.id || 
                   createResponse.id ||
                   createResponse.product?.id;
      }
      
      if (!productId) {
        console.error('응답에서 productId를 찾을 수 없습니다:', createResponse);
        throw new Error('상품 ID를 받아오지 못했습니다. 응답 구조를 확인해주세요.');
      }
      
      newProductId = productId;

      // =================================================================
      // 2단계: 발급받은 ID로 이미지 파일 업로드
      // =================================================================
      if (uploadedImages.length > 0) {
        alert('2/3: 이미지 업로드 중...');
        try {
          const imageFiles = uploadedImages.map(img => img.file);
          await uploadProductImages(newProductId, imageFiles);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      }

      // =================================================================
      // 3단계: 상품 상태를 '활성'으로 변경
      // =================================================================
      alert('3/3: 상품 등록 완료 중...');
      await updateProductStatus(newProductId, 'ACTIVE');
      
      alert('상품 등록이 성공적으로 완료되었습니다!');
      
      // 폼 초기화
      setFormData({
        salesCategory: "", productCategory: "", productName: "", size: "",
        quantity: "", material: "", productionYear: "", brandName: "",
        productCondition: "", conditionDescription: "", productDescription: "",
        productHistory: "", expectedEffect: "", additionalInfo: "",
      });
      setUploadedImages([]);
      
    } catch (error) {
      console.error('상품 등록 실패:', error);
      
      // 롤백: 생성된 임시 상품이 있다면 삭제 시도
      if (newProductId) {
        try {
          await updateProductStatus(newProductId, 'DRAFT');
          console.log('임시 상품 상태로 롤백 완료');
        } catch (rollbackError) {
          console.error('롤백 실패:', rollbackError);
        }
      }
      
      alert(`상품 등록 실패: ${error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 초안 저장 핸들러 (1단계만 실행)
  const handleSaveDraft = async () => {
    if (isSavingDraft) return; // 중복 저장 방지
    
    try {
      setIsSavingDraft(true);
      
      // 폼 데이터 유효성 검사
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        alert(`입력 오류:\n${validation.errors.join('\n')}`);
        return;
      }
      
      // API 요청 데이터로 변환 (이미지 정보 제외)
      const apiRequestData = transformFormDataToApiRequest(formData);
      
      // 초안 저장 API 호출 (1단계만)
      const response = await createProductDraft(apiRequestData);
      
      console.log('초안 저장 응답:', response);
      
      // 다양한 응답 구조에 대응
      let productId: number | undefined;
      
      if (response.success) {
        productId = response.productId || 
                   response.data?.id || 
                   response.id ||
                   response.product?.id;
      }
      
      if (response.success && productId) {
        alert('상품이 초안으로 저장되었습니다.');
        
        // 폼 초기화
        setFormData({
          salesCategory: "", productCategory: "", productName: "", size: "",
          quantity: "", material: "", productionYear: "", brandName: "",
          productCondition: "", conditionDescription: "", productDescription: "",
          productHistory: "", expectedEffect: "", additionalInfo: "",
        });
        setUploadedImages([]);
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
          onImagesChange={handleImagesChange}
        />
      ) : (
        <BulkUploadSection />
      )}
    </div>
  );
}

