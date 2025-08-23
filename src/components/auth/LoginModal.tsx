'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '@/api/login';
import { saveTokens } from '@/lib/tokenUtils';

import EyeClose from '@/assets/eye-close.svg';
import EyeOpen from '@/assets/eye-open.svg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser({ userId, password });
      const { accessToken, refreshToken } = data.data;
      
      if (accessToken && refreshToken) {
        saveTokens(accessToken, refreshToken);
        
        // 로그인 성공 시 모달 닫고 콜백 실행
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        throw new Error('토큰이 응답에 포함되지 않았습니다.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      console.error('로그인 처리 중 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    onClose();
    router.push('/signup');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 배경 오버레이 */}
      <div 
        className='fixed inset-0 bg-black bg-opacity-50' 
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className='relative bg-white rounded-lg p-8 w-full max-w-[448px] mx-4'>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>

        <div className='space-y-[24px]'>
          <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
            로그인
          </h1>
          <form className='flex flex-col gap-[24px]' onSubmit={handleSubmit}>
            <div className='space-y-[8px]'>
              <label className='block text-[16px]/[22px]' htmlFor='modal-userId'>
                이메일
              </label>
              <input
                autoComplete='userId'
                className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='modal-userId'
                name='userId'
                placeholder='아이디 입력'
                type='text'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className='relative space-y-[8px]'>
              <label className='block text-[16px]/[22px]' htmlFor='modal-password'>
                비밀번호
              </label>
              <input
                autoComplete='current-password'
                className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='modal-password'
                name='password'
                placeholder='비밀번호 입력'
                type={showPassword ? 'password' : 'text'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className='absolute top-[39px] right-[16px]'
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeClose alt='비밀번호 숨기기' height={24} width={24} />
                ) : (
                  <EyeOpen alt='비밀번호 보기' height={24} width={24} />
                )}
              </button>
            </div>
            
            {/* 에러 메시지 표시 영역 */}
            {error && <p className="text-center text-red-500 text-sm">{error}</p>}

            <div>
              <button
                className='h-[56px] w-full bg-black text-[16px]/[22px] font-bold text-white disabled:bg-gray-400'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
          <div className='flex items-center justify-center gap-[16px] text-center text-[14px]/[20px]'>
            <button className='font-medium text-gray-600 hover:text-gray-800'>
              아이디 찾기
            </button>
            <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
            <button className='font-medium text-gray-600 hover:text-gray-800'>
              비밀번호 찾기
            </button>
            <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
            <button 
              className='font-medium text-gray-600 hover:text-gray-800'
              onClick={handleSignupClick}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}