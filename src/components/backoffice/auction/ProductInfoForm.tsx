import { formConfig } from '@/components/backoffice/auction/formConfig';

interface ProductInfoFormProps {
  formData: Record<string, string>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formErrors?: Record<string, string>;
  hasFieldError?: (fieldName: string) => boolean;
}

export const ProductInfoForm = ({ formData, onFormChange, formErrors, hasFieldError }: ProductInfoFormProps) => {
  return (
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
                  return (
                    <Component 
                      key={field.name} 
                      {...field} 
                      value={formData[field.name] || ''} 
                      onChange={onFormChange}
                      error={hasFieldError?.(field.name) ? formErrors?.[field.name] : undefined}
                    />
                  );
                })}
              </div>
            );
          }
          // type이 'full'인 경우, 한 행에 하나의 필드를 렌더링
          if (config.type === 'full') {
            const Component = config.field.component;
            return (
              <Component 
                key={config.field.name} 
                {...config.field} 
                value={formData[config.field.name] || ''} 
                onChange={onFormChange}
                error={hasFieldError?.(config.field.name) ? formErrors?.[config.field.name] : undefined}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
