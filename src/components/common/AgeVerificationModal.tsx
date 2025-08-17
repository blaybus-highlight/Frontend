'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgeVerificationModal({
  isOpen,
  onClose,
}: AgeVerificationModalProps) {
  const handlePaymentRegister = () => {
    // TODO: 결제수단 등록 로직 구현
    onClose();
  };

  const handleRegisterLater = () => {
    // TODO: 나중에 등록하기 로직 구현
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='mx-auto max-w-md overflow-hidden rounded-lg border-0 bg-white p-0 shadow-xl'>
        <div className='px-8 py-6'>
          {/* 제목 */}
          <h2 className='mb-4 text-center text-xl font-bold text-gray-900'>
            가입완료
          </h2>

          {/* 설명 텍스트 */}
          <div className='mb-6 space-y-1 text-center text-sm leading-relaxed text-gray-600'>
            <p>법정스토어의 소품부터 작가 작품까지,</p>
            <p>나만의 취향에 맞는 특별한 상품을 발견해보세요</p>
          </div>

          <Button
            className='mb-3 w-full rounded-md bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800'
            onClick={handlePaymentRegister}
          >
            결제수단 등록하고 바로 입장하러가기
          </Button>

          <Button
            className='w-full rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'
            variant='outline'
            onClick={handleRegisterLater}
          >
            나중에 등록하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
