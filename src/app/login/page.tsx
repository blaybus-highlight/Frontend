'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import eyeopen from '@/assets/eye-open.svg';
import eyeclose from '@/assets/eye-close.svg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPassword, setIsPassword] = useState(true);

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
        <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
          <div className='space-y-[8px]'>
            <label htmlFor='email' className='block text-[16px]/[22px]'>
              이메일
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              placeholder='이메일 입력'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
            />
          </div>
          <div className='relative space-y-[8px]'>
            <label htmlFor='password' className='block text-[16px]/[22px]'>
              비밀번호
            </label>
            <input
              id='password'
              name='password'
              type={isPassword ? 'password' : 'text'}
              placeholder='비밀번호 입력'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
            />
            <button
              className='absolute top-[39px] right-[16px]'
              type='button'
              onClick={() => setIsPassword((prev) => !prev)}
            >
              {isPassword ? (
                <Image src={eyeclose} size={24} alt='비밀번호 보기' />
              ) : (
                <Image src={eyeopen} size={24} alt='비밀번호 보기' />
              )}
            </button>
          </div>
          <div>
            <button
              type='submit'
              className='h-[56px] w-full bg-black text-[16px]/[22px] font-bold text-white'
            >
              로그인
            </button>
          </div>
        </form>
        <div className='flex items-center justify-center gap-[16px] text-center text-[14px]/[20px]'>
          <Link href='/find-id' className='font-medium'>
            아이디 찾기
          </Link>
          <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
          <Link href='/find-password' className='font-medium'>
            비밀번호 찾기
          </Link>
          <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
          <Link href='/signup' className='font-medium'>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
