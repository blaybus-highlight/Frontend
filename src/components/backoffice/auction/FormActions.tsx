'use client';

import React from 'react';
interface FormActionsProps {
  onSubmit: () => void;
  onSaveDraft: () => void;
  onDelete: () => void; // ✅ 삭제 함수 추가
  isSubmitting: boolean;
  isSavingDraft: boolean;
  isDeleting: boolean; // ✅ 삭제 상태 추가
  submitText?: string;
  submittingText?: string;
  saveDraftText?: string;
  savingDraftText?: string;
  deleteText?: string; // ✅ 삭제 텍스트 추가
  deletingText?: string; // ✅ 삭제 중 텍스트 추가
}

export const FormActions = ({ 
  onSubmit, 
  onSaveDraft, 
  onDelete, // ✅ props로 받기
  isSubmitting, 
  isSavingDraft,
  isDeleting, // ✅ props로 받기
  submitText = "상품 등록하기",
  submittingText = "등록 중...",
  saveDraftText = "초안으로 저장",
  savingDraftText = "저장 중...",
  deleteText = "삭제하기", // ✅ 기본값 설정
  deletingText = "삭제 중..." // ✅ 기본값 설정
}: FormActionsProps) => {
  return (
    <div className="w-full mt-8 ml-4 pr-4 mb-12">
      <div className="flex justify-between gap-4">
       {/* 왼쪽 버튼 그룹 */}
       <div className="flex gap-4">
        <button 
          type="submit" 
          className={`py-2 px-6 font-bold transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
          onClick={onSubmit}
          disabled={isSubmitting || isSavingDraft || isDeleting} // ✅ 모든 작업 중 비활성화
          >
        
          {isSubmitting ? submittingText : submitText}
        </button>
        <button 
          type="button" 
          className={`py-2 px-6 font-bold transition-colors rounded-md ${
            isSavingDraft 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-600 text-gray-800 hover:bg-gray-100'
          }`}
          onClick={onSaveDraft}
          disabled={isSubmitting || isSavingDraft || isDeleting} // ✅ 모든 작업 중 비활성화
        >
          {isSavingDraft ? savingDraftText : saveDraftText}
        </button>
      </div>

       {/* 오른쪽 삭제 버튼 */}
       <button 
          type="button" 
          className={`py-2 px-6 font-bold transition-colors rounded-md ${
            isDeleting 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-600 text-gray-800 hover:bg-gray-100'
          }`}
          onClick={onDelete}
          disabled={isSubmitting || isSavingDraft || isDeleting} // ✅ 모든 작업 중 비활성화
        >
          {isDeleting ? deletingText : deleteText}
        </button>
    </div>
    </div>
  );
};
