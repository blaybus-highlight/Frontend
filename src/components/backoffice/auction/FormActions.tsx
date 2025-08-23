'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteProduct } from '@/hooks/useDeleteProduct';

interface FormActionsProps {
  onSubmit: () => void;
  onSaveDraft: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
  isSavingDraft: boolean;
  isDeleting: boolean;
  submitText?: string;
  submittingText?: string;
  saveDraftText?: string;
  savingDraftText?: string;
  deleteText?: string;
  deletingText?: string;
}

export const FormActions = ({ 
  onSubmit, 
  onSaveDraft, 
  onDelete,
  isSubmitting, 
  isSavingDraft,
  isDeleting,
  submitText = "상품 등록하기",
  submittingText = "등록 중...",
  saveDraftText = "초안으로 저장",
  savingDraftText = "저장 중...",
  deleteText = "삭제하기",
  deletingText = "삭제 중..."
}: FormActionsProps) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      alert('상품 ID를 찾을 수 없습니다.');
      return;
    }
    
    deleteProductMutation.mutate(parseInt(productId), {
      onSuccess: (data) => {
        alert('상품이 성공적으로 삭제되었습니다.');
        router.push('/backoffice/products');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || '상품 삭제 중 오류가 발생했습니다.';
        alert(`삭제 실패: ${errorMessage}`);
      }
    });
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
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
              disabled={isSubmitting || isSavingDraft || isDeleting}
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
              disabled={isSubmitting || isSavingDraft || isDeleting}
            >
              {isSavingDraft ? savingDraftText : saveDraftText}
            </button>
          </div>

          {/* 오른쪽 삭제 버튼 */}
          <button 
            type="button" 
            className={`py-2 px-6 font-bold transition-colors rounded-md ${
              deleteProductMutation.isPending
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-gray-600 text-gray-800 hover:bg-gray-100'
            }`}
            onClick={handleDeleteClick}
            disabled={isSubmitting || isSavingDraft || deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? deletingText : deleteText}
          </button>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">상품 삭제 확인</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 상품을 삭제하시겠습니까?<br />
              <span className="font-medium text-red-600">이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteProductMutation.isPending}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  deleteProductMutation.isPending
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleteProductMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
