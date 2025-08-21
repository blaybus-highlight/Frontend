import { ProductRegistrationRequest } from '@/types/auction';

// 카테고리 매핑 - 한국어를 영어로 변환
const categoryMapping: Record<string, 'PROPS' | 'FURNITURE' | 'HOME_APPLIANCES' | 'SCULPTURE' | 'FASHION' | 'CERAMICS' | 'PAINTING'> = {
  '소품': 'PROPS',
  '가구': 'FURNITURE',
  '가전': 'HOME_APPLIANCES',
  '조형': 'SCULPTURE',
  '패션': 'FASHION',
  '도예': 'CERAMICS',
  '회화': 'PAINTING'
} as const;

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
  // 디버깅을 위한 로그 추가
  console.log('폼 데이터에서 카테고리:', formData.productCategory);
  console.log('카테고리 매핑 결과:', categoryMapping[formData.productCategory]);
  console.log('전체 카테고리 매핑:', categoryMapping);
  
  const mappedCategory = categoryMapping[formData.productCategory];
  if (!mappedCategory) {
    console.error('카테고리 매핑 실패:', {
      input: formData.productCategory,
      availableKeys: Object.keys(categoryMapping)
    });
  }
  
  return {
    productName: formData.productName || '',
    shortDescription: formData.productDescription || '',
    history: formData.productHistory || '',
    expectedEffects: formData.expectedEffect || '',
    detailedInfo: formData.additionalInfo || '',
    category: mappedCategory || 'PROPS',
    productCount: parseInt(formData.quantity) || 1,
    material: formData.material || '',
    size: formData.size || '',
    brand: formData.brandName || '',
    manufactureYear: parseInt(formData.productionYear) || 1800,
    condition: formData.conditionDescription || '',
    rank: rankMapping[formData.productCondition] || 'GOOD',
    isPremium: formData.salesCategory === 'true', // 프리미엄 여부 추가
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

/**
 * 영어 카테고리를 한국어로 변환
 * @param englishCategory - 영어 카테고리
 * @returns 한국어 카테고리
 */
export const convertEnglishCategoryToKorean = (englishCategory: string): string => {
  const reverseCategoryMapping: Record<string, string> = {
    'PROPS': '소품',
    'FURNITURE': '가구',
    'HOME_APPLIANCES': '가전',
    'SCULPTURE': '조형',
    'FASHION': '패션',
    'CERAMICS': '도예',
    'PAINTING': '회화'
  };
  
  return reverseCategoryMapping[englishCategory] || englishCategory;
};

/**
 * API 응답 데이터를 폼 데이터로 변환
 * @param apiData - API에서 받은 상품 데이터
 * @returns 폼에서 사용할 데이터
 */
export const transformApiDataToFormData = (apiData: any): Record<string, string> => {
  return {
    productName: apiData.productName || '',
    productDescription: apiData.shortDescription || '',
    productHistory: apiData.history || '',
    expectedEffect: apiData.expectedEffects || '',
    additionalInfo: apiData.detailedInfo || '',
    productCategory: convertEnglishCategoryToKorean(apiData.category) || '소품',
    quantity: String(apiData.productCount || 1),
    material: apiData.material || '',
    size: apiData.size || '',
    brandName: apiData.brand || '',
    productionYear: String(apiData.manufactureYear || ''),
    conditionDescription: apiData.condition || '',
    productCondition: apiData.rank || 'GOOD',
    salesCategory: String(apiData.isPremium || false)
  };
};
