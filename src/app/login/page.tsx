'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '@/api/login';
import Cookies from 'js-cookie';

import EyeClose from '@/assets/eye-close.svg';
import EyeOpen from '@/assets/eye-open.svg';

export default function LoginPage() {
  const [user_id, setuser_id] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('로그인 시도:', { user_id, password });
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 분리된 API 함수를 호출합니다.
      const data = await loginUser({ user_id, password });
    
      console.log('로그인 성공:', data);
      const token = data.data.accessToken; 
      console.log('받은 토큰:', token);
      // TODO: 응답 데이터(예: JWT 토큰)를 안전한 곳에 저장
      if (token) {
        localStorage.setItem('accessToken', token);
        Cookies.set('accessToken', token, { expires: 1 / 24 });
        console.log(`쿠키 확인 ${Cookies.get('accessToken')}`); 
        router.push('/'); // 로그인 성공 시 홈으로 이동
      } else {
        throw new Error('토큰이 응답에 포함되지 않았습니다.');
      }
    } catch (err) {
      // loginUser 함수에서 throw한 에러를 여기서 잡습니다.
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

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-[448px] space-y-[24px]'>
        <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
          로그인
        </h1>
        <form className='flex flex-col gap-[24px]' onSubmit={handleSubmit}>
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='user_id'>
              이메일
            </label>
            <input
              autoComplete='user_id'
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='user_id'
              name='user_id'
              placeholder='아이디 입력'
              type='user_id'
              value={user_id}
              onChange={(e) => setuser_id(e.target.value)}
            />
          </div>
          <div className='relative space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='password'>
              비밀번호
            </label>
            <input
              autoComplete='current-password'
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='password'
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
          <Link className='font-medium' href='/find-id'>
            아이디 찾기
          </Link>
          <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
          <Link className='font-medium' href='/find-password'>
            비밀번호 찾기
          </Link>
          <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
          <Link className='font-medium' href='/signup'>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}