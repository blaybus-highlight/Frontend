import { ProductRegistrationRequest } from '@/types/auction';

// 카테고리 매핑
const categoryMapping: Record<string, 'PROPS' | 'FURNITURE' | 'HOME_APPLIANCES' | 'SCULPTURE' | 'FASHION' | 'CERAMICS' | 'PAINTING'> = {
  'props': 'PROPS',
  'furniture': 'FURNITURE',
  'home_appliances': 'HOME_APPLIANCES',
  'sculpture': 'SCULPTURE',
  'fashion': 'FASHION',
  'ceramics': 'CERAMICS',
  'painting': 'PAINTING'
};

// 상태 등급 매핑
const rankMapping: Record<string, 'BEST' | 'GREAT' | 'GOOD'> = {
  'BEST': 'BEST',
  'GREAT': 'GREAT',
  'GOOD': 'GOOD'
};

/**
 * 폼 데이터를 API 요청 형식으로 변환
 * @param formData - 폼에서 입력된 데이터
 * @param images - 업로드된 이미지 파일들 (선택사항)
 * @returns ProductRegistrationRequest
 */
export const transformFormDataToApiRequest = (
  formData: Record<string, string>,
  images: any[] = []
): ProductRegistrationRequest => {
  return {
    productName: formData.productName || '',
    shortDescription: formData.productDescription || '',
    history: formData.productHistory || '',
    expectedEffects: formData.expectedEffect || '',
    detailedInfo: formData.additionalInfo || '',
    category: categoryMapping[formData.productCategory] || 'PROPS',
    productCount: parseInt(formData.quantity) || 1,
    material: formData.material || '',
    size: formData.size || '',
    brand: formData.brandName || '',
    manufactureYear: parseInt(formData.productionYear) || 1800,
    condition: formData.conditionDescription || '',
    rank: rankMapping[formData.productCondition] || 'GOOD',
    images: [], // 상품 등록 시에는 빈 배열로 전송 (이미지는 별도 API로 업로드)
    draft: false // 상품 등록 시에는 false로 설정
  };
};

/**
 * 폼 데이터 유효성 검사
 * @param formData - 폼에서 입력된 데이터
 * @returns { isValid: boolean, errors: string[] }
 */
export const validateFormData = (formData: Record<string, string>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 필수 필드 검사
  if (!formData.productName?.trim()) {
    errors.push('상품명을 입력해주세요.');
  }

  if (!formData.productCategory) {
    errors.push('카테고리를 선택해주세요.');
  }

  if (!formData.productDescription?.trim()) {
    errors.push('상품 소개를 입력해주세요.');
  }

  if (!formData.brandName?.trim()) {
    errors.push('브랜드명을 입력해주세요.');
  }

  if (!formData.productCondition) {
    errors.push('상품 상태 등급을 선택해주세요.');
  }

  // 숫자 필드 검사
  const productionYear = parseInt(formData.productionYear);
  if (formData.productionYear && (isNaN(productionYear) || productionYear < 1800 || productionYear > new Date().getFullYear())) {
    errors.push('올바른 생산년도를 입력해주세요.');
  }

  const quantity = parseInt(formData.quantity);
  if (formData.quantity && (isNaN(quantity) || quantity < 1 || quantity > 100)) {
    errors.push('올바른 개수를 입력해주세요.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
