import React from "react"

// 1. 일반 텍스트 입력 컴포넌트 (한 줄 입력)
export const FormInput = ({ label, name, value, onChange, placeholder, error }: { 
  label: string | React.ReactNode, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  placeholder: string,
  error?: string
}) => (
  <div className="flex flex-col flex-1">
    <span className="text-[#111416] text-base mb-1">{label}</span>
    <input
      type="text"
      name={name}
      className={`border px-3 py-2 text-base w-full placeholder:text-[#9E9E9E] ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

// 2. 드롭다운 선택 컴포넌트
export const FormSelect = ({ label, name, value, onChange, options, error }: { 
  label: string | React.ReactNode, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, 
  options: { value: string, label: string }[],
  error?: string
}) => (
  <div className="flex flex-col flex-1">
    <span className="text-[#111416] text-base mb-1">{label}</span>
    <select
      name={name}
      className={`border px-3 py-2 text-base w-full ${
        value === "" ? "text-[#9E9E9E]" : "text-black"
      } ${error ? 'border-red-500' : 'border-gray-300'}`}
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
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

// 3. 여러 줄 텍스트 입력 컴포넌트 (높이가 큰 박스)
export const FormTextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 2,
  error
}: { 
  label: string | React.ReactNode, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
  placeholder: string, 
  rows?: number,
  error?: string
}) => (
    <div className="flex flex-col w-full">
        <span className="text-[#111416] text-base mb-1">{label}</span>
        <textarea
            name={name}
            className={`border px-3 py-2 text-base w-full placeholder:text-[#9E9E9E] resize-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
        />
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
);
