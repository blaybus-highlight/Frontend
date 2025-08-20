import React from 'react'
import { FormInput, FormSelect, FormTextArea } from './FormComponents'

// --- 드롭다운 메뉴 데이터 정의 ---
// 각 드롭다운 메뉴에 표시될 선택지들을 배열로 관리합니다.
export const salesCategoryOptions = [
  { value: "true", label: "프리미엄" },
  { value: "false", label: "일반" },
];

export const productCategoryOptions = [
  { value: "PROPS", label: "소품" },
  { value: "FURNITURE", label: "가구" },
  { value: "HOME_APPLIANCES", label: "가전" },
  { value: "SCULPTURE", label: "조형" },
  { value: "FASHION", label: "패션" },
  { value: "CERAMICS", label: "도예" },
  { value: "PAINTING", label: "회화" },
];

export const quantityOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
}));

export const productConditionOptions = [
    { value: "BEST", label: "최상" },
    { value: "GREAT", label: "상" },
    { value: "GOOD", label: "중" },
];

// --- 폼 구조를 데이터로 정의 ---
// 폼의 각 행과 필드를 객체 배열로 설정하여, JSX를 직접 수정하지 않고 이 배열만으로 폼을 동적으로 생성합니다.

export interface FormField {
  component: React.ComponentType<any>;
  name: string;
  label: string | React.ReactNode;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export interface FormConfigRow {
  type: 'row';
  fields: FormField[];
}

export interface FormConfigFull {
  type: 'full';
  field: FormField;
}

export type FormConfig = FormConfigRow | FormConfigFull;

export const formConfig: FormConfig[] = [
  // 한 행에 두 개의 필드가 있는 경우
  {
    type: 'row', fields: [
      { component: FormSelect, name: 'salesCategory', label: '프리미엄 여부', options: salesCategoryOptions },
      { component: FormSelect, name: 'productCategory', label: '카테고리', options: productCategoryOptions }
    ]
  },
  // 한 행을 모두 차지하는 필드의 경우
  {
    type: 'full', field: { component: FormInput, name: 'productName', label: '상품명', placeholder: '상품명을 입력하세요' }
  },
  {
    type: 'row', fields: [
      { component: FormInput, name: 'size', label: '사이즈', placeholder: '사이즈를 입력하세요' },
      { component: FormSelect, name: 'quantity', label: '개수', options: quantityOptions }
    ]
  },
  {
    type: 'row', fields: [
      { component: FormInput, name: 'material', label: '재질', placeholder: '재질을 입력하세요' },
      { component: FormInput, name: 'productionYear', label: '생산년도', placeholder: '생산년도를 입력하세요' }
    ]
  },
  {
    type: 'row', fields: [
      { component: FormInput, name: 'brandName', label: '브랜드명', placeholder: '브랜드명을 입력하세요' },
      { component: FormSelect, name: 'productCondition', label: '상품 상태 등급', options: productConditionOptions }
    ]
  },
  {
    type: 'full', field: { component: FormInput, name: 'conditionDescription', label: <>상품 상태 설명 <span className="text-[#9E9E9E]">(선택)</span></>, placeholder: '상품의 상태를 자세하게 설명해주세요.' }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'productDescription', label: '상품 소개 (40자 이내)', placeholder: '고객에게 보여줄 상품 소개를 간략하게 입력해주세요.', rows: 4 }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'productHistory', label: <>상품 히스토리 소개 <span className="text-[#9E9E9E]">(선택)</span></>, placeholder: '상품의 히스토리를 간략하게 입력해주세요.', rows: 4 }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'expectedEffect', label: <>기대효과<span className="text-[#9E9E9E]"></span></>, placeholder: '기대효과를 간략하게 입력해주세요.', rows: 4 }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'additionalInfo', label: <>추가 설명 <span className="text-[#9E9E9E]"></span></>, placeholder: '추가적인 설명을 입력해주세요.', rows: 4 }
  }
];
