import { ProductInfoForm } from './ProductInfoForm';
import { ProductImageUpload } from './ProductImageUpload';
import { FormActions } from './FormActions';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  primary?: boolean;
}

interface IndividualRegistrationSectionProps {
  formData: Record<string, string>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
  isSavingDraft: boolean;
  onImagesChange?: (images: ImageFile[]) => void;
}

export const IndividualRegistrationSection = ({ 
  formData, 
  onFormChange, 
  onSubmit, 
  onSaveDraft,
  isSubmitting,
  isSavingDraft,
  onImagesChange
}: IndividualRegistrationSectionProps) => {
  return (
    <>
      {/* 상품 정보 입력 폼 섹션 */}
      <ProductInfoForm formData={formData} onFormChange={onFormChange} />

      {/* 상품 이미지 업로드 섹션 */}
      <ProductImageUpload onImagesChange={onImagesChange} />

      {/* 최종 등록 버튼 섹션 */}
      <FormActions 
        onSubmit={onSubmit} 
        onSaveDraft={onSaveDraft} 
        isSubmitting={isSubmitting}
        isSavingDraft={isSavingDraft}
      />
    </>
  );
};
