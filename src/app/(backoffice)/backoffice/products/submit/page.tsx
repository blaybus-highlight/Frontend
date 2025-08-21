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
    salesCategory: "false", productCategory: "", productName: "", size: "",
    quantity: "", material: "", productionYear: "", brandName: "",
    productCondition: "", conditionDescription: "", productDescription: "",
    productHistory: "", expectedEffect: "", additionalInfo: "",
  });

  // 폼 오류 상태 관리
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // 어떤 입력 필드든 값이 변경될 때 호출되는 단일 이벤트 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 필드가 터치되었음을 표시
    setTouchedFields(prev => new Set(prev).add(name));
    
    // 실시간 유효성 검사
    validateField(name, value);
  };

  // 필드별 실시간 유효성 검사
  const validateField = (fieldName: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (fieldName) {
      case 'productName':
        if (!value.trim()) {
          errors[fieldName] = '상품명을 입력해주세요.';
        }
        break;
      case 'productCategory':
        if (!value) {
          errors[fieldName] = '카테고리를 선택해주세요.';
        }
        break;
      case 'productDescription':
        if (!value.trim()) {
          errors[fieldName] = '상품 소개를 입력해주세요.';
        }
        break;
      case 'brandName':
        if (!value.trim()) {
          errors[fieldName] = '브랜드명을 입력해주세요.';
        }
        break;
      case 'productCondition':
        if (!value) {
          errors[fieldName] = '상품 상태 등급을 선택해주세요.';
        }
        break;
      case 'productionYear':
        if (value) {
          const year = parseInt(value);
          if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
            errors[fieldName] = '올바른 생산년도를 입력해주세요.';
          }
        }
        break;
      case 'quantity':
        if (value) {
          const quantity = parseInt(value);
          if (isNaN(quantity) || quantity < 1 || quantity > 100) {
            errors[fieldName] = '올바른 개수를 입력해주세요.';
          }
        }
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: errors[fieldName] || ''
    }));
  };

  // 필드가 터치되었는지 확인
  const isFieldTouched = (fieldName: string) => {
    return touchedFields.has(fieldName);
  };

  // 필드에 오류가 있는지 확인
  const hasFieldError = (fieldName: string): boolean => {
    return isFieldTouched(fieldName) && !!formErrors[fieldName];
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


      const apiRequestData = transformFormDataToApiRequest(formData);

      const createResponse = await registerProduct(apiRequestData);
      
      
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
      await updateProductStatus(newProductId, 'ACTIVE');
      
      alert('상품 등록이 성공적으로 완료되었습니다!');
      
      // 폼 초기화
      setFormData({
        salesCategory: "false", productCategory: "", productName: "", size: "",
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
          salesCategory: "false", productCategory: "", productName: "", size: "",
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
           formErrors={formErrors}
           hasFieldError={hasFieldError}
         />
      ) : (
        <BulkUploadSection />
      )}
    </div>
  );
}

