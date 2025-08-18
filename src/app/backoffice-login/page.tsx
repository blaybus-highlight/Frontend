'use client';

// 필요한 리액트 훅과 넥스트 컴포넌트를 가져옵니다.
import Link from 'next/link';
import { useState } from 'react';

// SVG 아이콘을 컴포넌트처럼 사용하기 위해 가져옵니다.
import EyeClose from '@/assets/eye-close.svg';
import EyeOpen from '@/assets/eye-open.svg';

// 관리자 로그인 페이지 컴포넌트
export default function BackofficeLoginPage() {
  // useState 훅을 사용하여 컴포넌트의 상태를 관리합니다.
  const [adminId, setAdminId] = useState(''); // 관리자 아이디 입력을 위한 상태
  const [password, setPassword] = useState(''); // 비밀번호 입력을 위한 상태
  const [showPassword, setShowPassword] = useState(true); // 비밀번호 보이기/숨기기 토글 상태

  // 폼 제출 이벤트를 처리하는 함수입니다.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막습니다.
    // TODO: 실제 관리자 로그인 API와 연동하는 로직을 이곳에 구현해야 합니다.
    alert('관리자 로그인 시도: ' + adminId);
  };

  // 화면에 렌더링될 JSX 코드입니다.
  return (
    // 전체 화면을 차지하고 컨텐츠를 중앙에 위치시키는 flexbox 레이아웃입니다.
    <div className='flex min-h-screen items-center justify-center'>
      {/* 로그인 폼의 최대 너비를 지정하고 내부 요소들의 간격을 설정합니다. */}
      <div className='w-full max-w-[448px] space-y-[24px]'>
        {/* 페이지 제목 */}
        <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
          관리자 로그인
        </h1>
        {/* 로그인 폼. onSubmit 이벤트에 handleSubmit 함수를 연결합니다. */}
        <form className='flex flex-col gap-[24px]' onSubmit={handleSubmit}>
          {/* 관리자 아이디 입력 필드 */}
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='adminId'>
              관리자 아이디
            </label>
            <input
              required
              autoComplete='username'
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='adminId'
              name='adminId'
              placeholder='관리자 아이디 입력'
              type='text'
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)} // 입력값이 변경될 때마다 adminId 상태를 업데이트합니다.
            />
          </div>
          {/* 비밀번호 입력 필드 */}
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
              type={showPassword ? 'password' : 'text'} // showPassword 상태에 따라 타입이 변경됩니다.
              value={password}
              onChange={(e) => setPassword(e.target.value)} // 입력값이 변경될 때마다 password 상태를 업데이트합니다.
            />
            {/* 비밀번호 보이기/숨기기 버튼 */}
            <button
              className='absolute top-[39px] right-[16px]'
              type='button'
              onClick={() => setShowPassword((prev) => !prev)} // 클릭 시 showPassword 상태를 반전시킵니다.
            >
              {showPassword ? (
                <EyeClose alt='비밀번호 숨기기' height={24} width={24} />
              ) : (
                <EyeOpen alt='비밀번호 보이기' height={24} width={24} />
              )}
            </button>
          </div>
          {/* 로그인 제출 버튼 */}
          <div>
            <button
              className='h-[56px] w-full bg-black text-[16px]/[22px] font-bold text-white'
              type='submit'
            >
              로그인
            </button>
          </div>
        </form>
        {/* 회원가입 및 다른 페이지로의 이동을 위한 링크 섹션 */}
        <div className='flex items-center justify-center gap-[16px] text-center text-[14px]/[20px]'>
          {/* TODO: 관리자용 아이디/비밀번호 찾기 페이지가 필요하다면 #을 수정하여 연결합니다. */}
          <Link className='font-medium' href='#'>
            아이디 찾기
          </Link>
          <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
          <Link className='font-medium' href='#'>
            비밀번호 찾기
          </Link>
          <span className='text-[12px]/[12px] text-[#E0E0E0]'>|</span>
          <Link className='font-medium' href='/backoffice-login/signup'>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
