interface FormActionsProps {
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
  isSavingDraft: boolean;
  submitText?: string;
  submittingText?: string;
  saveDraftText?: string;
  savingDraftText?: string;
}

export const FormActions = ({ 
  onSubmit, 
  onSaveDraft, 
  isSubmitting, 
  isSavingDraft,
  submitText = "상품 등록하기",
  submittingText = "등록 중...",
  saveDraftText = "초안으로 저장",
  savingDraftText = "저장 중..."
}: FormActionsProps) => {
  return (
    <div className="w-full mt-8 ml-4 pr-4 mb-12">
      <div className="flex justify-start gap-4">
        <button 
          type="submit" 
          className={`py-2 px-6 font-bold transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingText : submitText}
        </button>
        <button 
          type="button" 
          className={`py-2 px-6 font-bold transition-colors ${
            isSavingDraft 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-600 text-gray-800 hover:bg-gray-100'
          }`}
          onClick={onSaveDraft}
          disabled={isSavingDraft}
        >
          {isSavingDraft ? savingDraftText : saveDraftText}
        </button>
      </div>
    </div>
  );
};
