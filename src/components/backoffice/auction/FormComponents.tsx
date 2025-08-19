import React from "react"

// 1. 일반 텍스트 입력 컴포넌트 (한 줄 입력)
export const FormInput = ({ label, name, value, onChange, placeholder }: { 
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
export const FormSelect = ({ label, name, value, onChange, options }: { 
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
export const FormTextArea = ({ 
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
