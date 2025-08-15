'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import eyeopen from '@/assets/eye-open.svg';
import eyeclose from '@/assets/eye-close.svg';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    phone: '',
    verificationCode: '',
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    // Updated terms agreement states
    allAgreed: false,
    ageAgreed: false,
    termsAgreed: false,
    marketingAgreed: false,
    eventAgreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // New handler for "전체동의" checkbox
  const handleAllAgreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prevState) => ({
      ...prevState,
      allAgreed: checked,
      ageAgreed: checked,
      termsAgreed: checked,
      marketingAgreed: checked,
      eventAgreed: checked,
    }));
  };

  // Modified handleChange to handle individual checkboxes and update allAgreed
  const handleIndividualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked } = e.target;
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]:
          type === 'checkbox'
            ? checked
            : prevState[name as keyof typeof prevState], // Keep value for non-checkboxes
      };

      // Update allAgreed based on individual checkboxes
      const allChecked =
        newState.ageAgreed &&
        newState.termsAgreed &&
        newState.marketingAgreed &&
        newState.eventAgreed;
      return {
        ...newState,
        allAgreed: allChecked,
      };
    });
  };

  const handleVerify = () => {
    // TODO: Implement phone verification logic
    console.log('Verification request for:', formData.phone);
    alert('인증번호가 발송되었습니다. (실제 기능 구현 필요)');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // Validate required terms
    if (!formData.ageAgreed || !formData.termsAgreed) {
      alert('필수 약관에 동의해야 합니다.');
      return;
    }
    // TODO: Implement actual signup logic
    console.log('Signup attempt with:', formData);
    alert('회원가입 시도: ' + formData.email);
  };

  return (
    <div className='flex min-h-screen items-center justify-center py-12'>
      <div className='w-full max-w-[448px] space-y-[24px]'>
        <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
          회원가입
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
          {/* Phone Number and Verification Code */}
          <div className='space-y-[8px]'>
            <label htmlFor='phone' className='block text-[16px]/[22px]'>
              휴대폰 번호
            </label>
            <div className='flex gap-[6px]'>
              <input
                id='phone'
                name='phone'
                type='tel'
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder='전화번호 입력'
                className='w-full flex-grow border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              />
              <button
                type='button'
                onClick={handleVerify}
                className='h-[44px] shrink-0 bg-gray-800 px-4 text-[14px] font-bold text-white'
              >
                인증하기
              </button>
            </div>
            <input
              id='verificationCode'
              name='verificationCode'
              type='text'
              required
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder='인증번호 입력'
              className='mt-[4px] w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
            />
          </div>

          {/* Email */}
          <div className='space-y-[8px]'>
            <label htmlFor='email' className='block text-[16px]/[22px]'>
              이메일
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='abd@email.com'
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
            />
          </div>

          {/* Password and Password Confirm */}
          <div>
            <div className='relative flex flex-col gap-[8px]'>
              <label htmlFor='password' className='block text-[16px]/[22px]'>
                비밀번호
              </label>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder='비밀번호 입력'
                className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              />
              <button
                className='absolute top-[39px] right-[16px]'
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Image
                    src={eyeopen}
                    width={24}
                    height={24}
                    alt='비밀번호 숨기기'
                  />
                ) : (
                  <Image
                    src={eyeclose}
                    width={24}
                    height={24}
                    alt='비밀번호 보기'
                  />
                )}
              </button>
            </div>
            <div className='relative mt-[4px]'>
              <input
                id='passwordConfirm'
                name='passwordConfirm'
                type={showPasswordConfirm ? 'text' : 'password'}
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder='비밀번호 재입력'
                className='mt-[8px] w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              />
              <button
                className='absolute top-[17px] right-[16px]'
                type='button'
                onClick={() => setShowPasswordConfirm((prev) => !prev)}
              >
                {showPasswordConfirm ? (
                  <Image
                    src={eyeopen}
                    width={24}
                    height={24}
                    alt='비밀번호 숨기기'
                  />
                ) : (
                  <Image
                    src={eyeclose}
                    width={24}
                    height={24}
                    alt='비밀번호 보기'
                  />
                )}
              </button>
            </div>
          </div>

          {/* Nickname */}
          <div className='space-y-[8px]'>
            <label htmlFor='nickname' className='block text-[16px]/[22px]'>
              닉네임
            </label>
            <input
              id='nickname'
              name='nickname'
              type='text'
              required
              value={formData.nickname}
              onChange={handleChange}
              placeholder='별명 (2~20자)'
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
            />
          </div>

          {/* Terms Agreement Section */}
          <div className='space-y-[12px]'>
            <label className='block text-[16px]/[22px]'>약관동의</label>

            {/* All Agree Checkbox */}
            <div className='border border-[#E0E0E0] px-[16px] py-[24px]'>
              <div className='flex items-center'>
                <input
                  id='allAgreed'
                  name='allAgreed'
                  type='checkbox'
                  checked={formData.allAgreed}
                  onChange={handleAllAgreedChange}
                  className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                />
                <label
                  htmlFor='allAgreed'
                  className='ml-[6px] block text-[16px]/[20px] font-medium'
                >
                  전체동의
                </label>
              </div>

              <hr className='mt-[12px] mb-[19px] border-[#E0E0E0]' />

              {/* Individual Checkboxes */}
              <div className='space-y-[12px]'>
                {/* Age */}
                <div className='flex items-center'>
                  <input
                    id='ageAgreed'
                    name='ageAgreed'
                    type='checkbox'
                    checked={formData.ageAgreed}
                    onChange={handleIndividualChange}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                  />
                  <label
                    htmlFor='ageAgreed'
                    className='ml-[6px] block text-[16px]/[20px]'
                  >
                    만 14세 이상입니다{' '}
                    <span className='text-[14px] text-[#6C918B]'>(필수)</span>
                  </label>
                </div>

                {/* Terms of Service */}
                <div className='flex items-center'>
                  <input
                    id='termsAgreed'
                    name='termsAgreed'
                    type='checkbox'
                    checked={formData.termsAgreed}
                    onChange={handleIndividualChange}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                  />
                  <label
                    htmlFor='termsAgreed'
                    className='ml-[6px] block text-[16px]/[20px]'
                  >
                    이용약관{' '}
                    <span className='text-[14px] text-[#6C918B]'>(필수)</span>
                  </label>
                </div>

                {/* Marketing */}
                <div className='flex items-center'>
                  <input
                    id='marketingAgreed'
                    name='marketingAgreed'
                    type='checkbox'
                    checked={formData.marketingAgreed}
                    onChange={handleIndividualChange}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                  />
                  <label
                    htmlFor='marketingAgreed'
                    className='ml-[6px] block text-[16px]/[20px]'
                  >
                    개인정보 마케팅 활용 동의{' '}
                    <span className='text-[14px] text-[#BDBDBD]'>(선택)</span>
                  </label>
                </div>

                {/* Event/Coupon */}
                <div className='flex items-center'>
                  <input
                    id='eventAgreed'
                    name='eventAgreed'
                    type='checkbox'
                    checked={formData.eventAgreed}
                    onChange={handleIndividualChange}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                  />
                  <label
                    htmlFor='eventAgreed'
                    className='ml-[6px] block text-[16px]/[20px]'
                  >
                    이벤트, 쿠폰, 특가 알림 메일 및 SMS 등 수신{' '}
                    <span className='text-[14px] text-[#BDBDBD]'>(선택)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              className='h-[56px] w-full bg-black text-[16px]/[22px] font-bold text-white'
            >
              가입하기
            </button>
          </div>
        </form>

        <div className='pt-[16px] text-center'>
          <p className='text-[16px]/[24px] text-[#424242]'>
            이미 아이디가 있으신가요?
            <Link href='/login' className='px-[16px] font-semibold underline'>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
