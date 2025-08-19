"use client"

import { useState } from "react"

// --- 재사용 컴포넌트 정의 ---

// 1. 일반 텍스트 입력 컴포넌트 (한 줄 입력)
const FormInput = ({ label, name, value, onChange, placeholder }: { 
  label: string | React.ReactNode, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  placeholder: string 
}) => (
  <div className="flex flex-col flex-1">
    <span className="text-[#111416] text-base mb-1">{label}</span>
    <input
      type="text"
      name={name}
      className="border border-gray-300 px-3 py-2 text-base w-full placeholder:text-[#9E9E9E]"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// 2. 드롭다운 선택 컴포넌트
const FormSelect = ({ label, name, value, onChange, options }: { 
  label: string | React.ReactNode, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, 
  options: { value: string, label: string }[] 
}) => (
  <div className="flex flex-col flex-1">
    <span className="text-[#111416] text-base mb-1">{label}</span>
    <select
      name={name}
      className={`border border-gray-300 px-3 py-2 text-base w-full ${
        value === "" ? "text-[#9E9E9E]" : "text-black"
      }`}
      value={value}
      onChange={onChange}
    >
      <option value="">선택하세요</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// 3. 여러 줄 텍스트 입력 컴포넌트 (높이가 큰 박스)
const FormTextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 2 
}: { 
  label: string | React.ReactNode, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
  placeholder: string, 
  rows?: number 
}) => (
    <div className="flex flex-col w-full">
        <span className="text-[#111416] text-base mb-1">{label}</span>
        <textarea
            name={name}
            className="border border-gray-300 px-3 py-2 text-base w-full placeholder:text-[#9E9E9E] resize-none"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
        />
    </div>
);

// --- 드롭다운 메뉴 데이터 정의 ---
// 각 드롭다운 메뉴에 표시될 선택지들을 배열로 관리합니다.
const salesCategoryOptions = [
  { value: "auction", label: "경매" },
  { value: "buy_now", label: "즉시 구매" },
];
const productCategoryOptions = [
  { value: "clothing", label: "의류" },
  { value: "accessories", label: "액세서리" },
  { value: "electronics", label: "전자제품" },
  { value: "art", label: "미술품" },
];
const quantityOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
}));
const productConditionOptions = [
    { value: "최상", label: "최상" },
    { value: "상", label: "상" },
    { value: "중", label: "중" },
];

// --- 폼 구조를 데이터로 정의 ---
// 폼의 각 행과 필드를 객체 배열로 설정하여, JSX를 직접 수정하지 않고 이 배열만으로 폼을 동적으로 생성합니다.

interface FormField {
  component: React.ComponentType<any>;
  name: string;
  label: string | React.ReactNode;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

interface FormConfigRow {
  type: 'row';
  fields: FormField[];
}

interface FormConfigFull {
  type: 'full';
  field: FormField;
}

type FormConfig = FormConfigRow | FormConfigFull;

const formConfig: FormConfig[] = [
  // 한 행에 두 개의 필드가 있는 경우
  {
    type: 'row', fields: [
      { component: FormSelect, name: 'salesCategory', label: '판매 분류', options: salesCategoryOptions },
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
    type: 'full', field: { component: FormTextArea, name: 'productDescription', label: '상품 소개 (25자 이내)', placeholder: '고객에게 보여줄 상품 소개를 간략하게 입력해주세요.', rows: 4 }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'productHistory', label: <>상품 히스토리 소개 (25자 이내) <span className="text-[#9E9E9E]">(선택)</span></>, placeholder: '상품의 히스토리를 간략하게 입력해주세요.', rows: 4 }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'expectedEffect', label: <>기대효과 (25자 이내) <span className="text-[#9E9E9E]">(선택)</span></>, placeholder: '기대효과를 간략하게 입력해주세요.', rows: 4 }
  },
  {
    type: 'full', field: { component: FormTextArea, name: 'additionalInfo', label: <>추가 설명 <span className="text-[#9E9E9E]">(선택)</span></>, placeholder: '추가적인 설명을 입력해주세요.', rows: 4 }
  }
];

// --- 메인 페이지 컴포넌트 ---
export default function AuctionSubmitPage() {
  // '개별 등록', '일괄 등록' 탭 상태 관리
  const [activeTab, setActiveTab] = useState("individual");
  
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

  return (
    <div className="flex flex-col min-h-screen px-60 py-6">
      {/* 페이지 최상단 헤더 */}
      <div className="flex flex-col items-start self-stretch gap-3">
        <span className="text-[#111416] text-[28px] font-bold ml-4">상품 등록</span>
        <span className="text-[#757575] text-m ml-4">경매에 등록할 상품을 선택하세요.</span>
        <div className="w-80 h-[21px] ml-4"></div>
      </div>
      
      {/* 탭 네비게이션 바 */}
      <div className="flex items-start self-stretch p-3 gap-3 w-full border-b border-[#BDBDBD] mr-4">
        <button className={`py-2 px-4 transition-colors ${activeTab === "individual" ? "text-black border-b-2 border-black font-bold" : "text-[#BDBDBD] hover:text-black"}`} onClick={() => setActiveTab("individual")}>개별 등록</button>
        <button className={`py-2 px-4 transition-colors ${activeTab === "bulk" ? "text-black border-b-2 border-black font-bold" : "text-[#BDBDBD] hover:text-black"}`} onClick={() => setActiveTab("bulk")}>일괄 등록(Excel)</button>
      </div>

      {/* 현재 활성화된 탭에 따라 다른 내용을 표시 */}
      {activeTab === "individual" ? (
        <>
          {/* 상품 정보 입력 폼 섹션 */}
          <div className="flex flex-col items-start self-stretch gap-3 mt-4">
            <span className="text-[#111416] text-[20px] font-bold ml-4">상품 정보</span>
            {/* 위에서 정의한 formConfig 데이터를 기반으로 폼을 동적으로 렌더링 */}
            <div className="flex flex-col ml-4 gap-4 w-full pr-4">
              {formConfig.map((config, index) => {
                // type이 'row'인 경우, 한 행에 여러 필드를 렌더링
                if (config.type === 'row') {
                  return (
                    <div key={index} className="flex flex-row items-center w-full gap-4">
                      {config.fields.map(field => {
                        const Component = field.component;
                        return <Component key={field.name} {...field} value={formData[field.name] || ''} onChange={handleChange} />;
                      })}
                    </div>
                  );
                }
                // type이 'full'인 경우, 한 행에 하나의 필드를 렌더링
                if (config.type === 'full') {
                  const Component = config.field.component;
                  return <Component key={config.field.name} {...config.field} value={formData[config.field.name] || ''} onChange={handleChange} />;
                }
                return null;
              })}
            </div>
          </div>

          {/* 상품 이미지 업로드 섹션 */}
          <div className="flex flex-col items-start self-stretch gap-3 mt-4">
            <span className="text-[#111416] text-[20px] font-bold ml-4">상품 이미지</span>
            <div className="ml-4 w-full pr-4">
              <div className="flex flex-col justify-center items-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
                <span className="text-[#111416] text-[20px] font-bold">이미지 업로드</span>
                <span className="text-base text-black mt-2 text-center">
                  이미지를 드래그 앤 드롭하거나 찾아보기를 통해 업로드하세요.<br />
                  최대 5개의 이미지를 허용합니다.
                </span>
              </div>
            </div>
          </div>

          {/* 최종 등록 버튼 섹션 */}
          <div className="w-full mt-8 ml-4 pr-4 mb-12">
            <div className="flex justify-start gap-4">
              <button type="submit" className="py-2 px-6 bg-black text-white font-bold hover:bg-gray-800 transition-colors">상품 등록하기</button>
              <button type="button" className="py-2 px-6 bg-white border border-gray-600 text-gray-800 font-bold hover:bg-gray-100 transition-colors">초안으로 저장</button>
            </div>
          </div>
        </>
      ) : (
        // '일괄 등록' 탭이 활성화되었을 때 표시될 내용
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xl text-gray-500">일괄 등록 페이지입니다.</p>
        </div>
      )}
    </div>
  );
}

