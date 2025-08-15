'use client';

import Link from 'next/link';
import { useState } from 'react';

import EyeClose from '@/assets/eye-close.svg';
import EyeOpen from '@/assets/eye-open.svg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login attempt with:', { email, password });
    alert('로그인 시도: ' + email);
  };

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-[448px] space-y-[24px]'>
        <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
          로그인
        </h1>
        <form className='flex flex-col gap-[24px]' onSubmit={handleSubmit}>
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='email'>
              이메일
            </label>
            <input
              required
              autoComplete='email'
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='email'
              name='email'
              placeholder='이메일 입력'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='relative space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='password'>
              비밀번호
            </label>
            <input
              required
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
                <EyeClose alt='비밀번호 보기' height={24} width={24} />
              ) : (
                <EyeOpen alt='비밀번호 보기' height={24} width={24} />
              )}
            </button>
          </div>
          <div>
            <button
              className='h-[56px] w-full bg-black text-[16px]/[22px] font-bold text-white'
              type='submit'
            >
              로그인
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
