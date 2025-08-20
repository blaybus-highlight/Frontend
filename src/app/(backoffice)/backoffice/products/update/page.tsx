"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/backoffice/auction/PageHeader"
import { TabNavigation } from "@/components/backoffice/auction/TabNavigation"
import { IndividualRegistrationSection } from "@/components/backoffice/auction/IndividualRegistrationSection"
import { BulkUploadSection } from "@/components/backoffice/auction/BulkUploadSection"
import { updateProduct, createProductDraft, updateProductStatus, uploadProductImages, getProductDetail } from "@/api/auction"
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
export default function ProductUpdatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')

  // '개별 등록', '일괄 등록' 탭 상태 관리
  const [activeTab, setActiveTab] = useState("individual");
  
  // 로딩 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // 상품 ID가 없으면 목록 페이지로 리다이렉트
  useEffect(() => {
    if (!productId) {
      alert('상품 ID가 없습니다.');
      router.push('/backoffice/products');
      return;
    }
  }, [productId, router]);

  // 기존 상품 데이터 로드
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        const response = await getProductDetail(parseInt(productId));
        
        if (response.success && response.data) {
          const product = response.data;
          
          // API 응답 데이터를 폼 데이터로 변환
          setFormData({
            salesCategory: product.isPremium ? "true" : "false",
            productCategory: product.category || "",
            productName: product.productName || "",
            size: product.size || "",
            quantity: product.productCount?.toString() || "",
            material: product.material || "",
            productionYear: product.manufactureYear?.toString() || "",
            brandName: product.brand || "",
            productCondition: product.rank || "",
            conditionDescription: product.condition || "",
            productDescription: product.shortDescription || "",
            productHistory: product.history || "",
            expectedEffect: product.expectedEffects || "",
            additionalInfo: product.detailedInfo || "",
          });
        } else {
          alert('상품 정보를 불러올 수 없습니다.');
          router.push('/backoffice/products');
        }
      } catch (error) {
        console.error('상품 정보 로드 실패:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
        router.push('/backoffice/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, router]);

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

  // 폼 제출 핸들러 (상품 수정)
  const handleSubmit = async () => {
    if (isSubmitting || !productId) return; // 중복 제출 방지
    
    try {
      setIsSubmitting(true);
      
      // 폼 데이터 유효성 검사
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        alert(`입력 오류:\n${validation.errors.join('\n')}`);
        return;
      }

      const apiRequestData = transformFormDataToApiRequest(formData);
      
      // 상품 수정 API 호출
      const updateResponse = await updateProduct(parseInt(productId), apiRequestData);
      
      console.log('상품 수정 응답:', updateResponse);
      
      if (!updateResponse.success) {
        throw new Error(updateResponse.message || '상품 수정에 실패했습니다.');
      }

      // =================================================================
      // 이미지 파일 업로드 (새로 추가된 이미지가 있는 경우)
      // =================================================================
      if (uploadedImages.length > 0) {
        try {
          const imageFiles = uploadedImages.map(img => img.file);
          await uploadProductImages(parseInt(productId), imageFiles);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          // 이미지 업로드 실패는 경고만 표시하고 계속 진행
          alert('상품 정보는 수정되었지만 이미지 업로드에 실패했습니다.');
        }
      }

      // =================================================================
      // 상품 상태를 '활성'으로 변경
      // =================================================================
      await updateProductStatus(parseInt(productId), 'ACTIVE');
      
      alert('상품 수정이 성공적으로 완료되었습니다!');
      
      // 상품 목록 페이지로 이동
      router.push('/backoffice/products');
      
    } catch (error) {
      console.error('상품 수정 실패:', error);
      alert(`상품 수정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 초안 저장 핸들러
  const handleSaveDraft = async () => {
    if (isSavingDraft || !productId) return; // 중복 저장 방지
    
    try {
      setIsSavingDraft(true);
      
      // 폼 데이터 유효성 검사
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        alert(`입력 오류:\n${validation.errors.join('\n')}`);
        return;
      }
      
      // API 요청 데이터로 변환
      const apiRequestData = transformFormDataToApiRequest(formData);
      
      // 상품 수정 API 호출
      const response = await updateProduct(parseInt(productId), apiRequestData);
      
      console.log('초안 저장 응답:', response);
      
      if (response.success) {
        alert('상품이 초안으로 저장되었습니다.');
        router.push('/backoffice/products');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-60 py-6">
      {/* 페이지 최상단 헤더 */}
      <PageHeader 
        title="상품 수정" 
        subtitle="상품 정보를 수정하세요." 
      />
      
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
          submitText="상품 수정하기"
          submittingText="수정 중..."
          saveDraftText="초안으로 저장"
          savingDraftText="저장 중..."
          formErrors={formErrors}
          hasFieldError={hasFieldError}
        />
      ) : (
        <BulkUploadSection />
      )}
    </div>
  );
}
