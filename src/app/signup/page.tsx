'use client';

import Link from 'next/link';
import { useState } from 'react';

import EyeClose from '@/assets/eye-close.svg';
import EyeOpen from '@/assets/eye-open.svg';

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
    alert('인증번호가 발송되었습니다. (실제 기능 구현 필요)');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      alert('닉네임은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }
    // Validate required terms
    if (!formData.ageAgreed || !formData.termsAgreed) {
      alert('필수 약관에 동의해야 합니다.');
      return;
    }
    // TODO: Implement actual signup logic
    alert('회원가입 시도: ' + formData.email);
  };

  return (
    <div className='flex min-h-screen items-center justify-center py-12'>
      <div className='w-full max-w-[448px] space-y-[24px]'>
        <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
          회원가입
        </h1>
        <form className='flex flex-col gap-[24px]' onSubmit={handleSubmit}>
          {/* Phone Number and Verification Code */}
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='phone'>
              휴대폰 번호
            </label>
            <div className='flex gap-[6px]'>
              <input
                required
                className='w-full flex-grow border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='phone'
                name='phone'
                placeholder='전화번호 입력'
                type='tel'
                value={formData.phone}
                onChange={handleChange}
              />
              <button
                className='h-[44px] shrink-0 bg-black px-4 text-[14px] font-bold text-white'
                type='button'
                onClick={handleVerify}
              >
                인증하기
              </button>
            </div>
            <input
              required
              className='mt-[4px] w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='verificationCode'
              name='verificationCode'
              placeholder='인증번호 입력'
              type='text'
              value={formData.verificationCode}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='email'>
              이메일
            </label>
            <input
              required
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='email'
              name='email'
              placeholder='abd@email.com'
              type='email'
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password and Password Confirm */}
          <div>
            <div className='relative flex flex-col gap-[8px]'>
              <label className='block text-[16px]/[22px]' htmlFor='password'>
                비밀번호
              </label>
              <input
                required
                className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='password'
                name='password'
                placeholder='비밀번호 입력'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                className='absolute top-[39px] right-[16px]'
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOpen alt='비밀번호 숨기기' height={24} width={24} />
                ) : (
                  <EyeClose alt='비밀번호 보기' height={24} width={24} />
                )}
              </button>
            </div>
            <div className='relative mt-[4px]'>
              <input
                required
                className='mt-[8px] w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='passwordConfirm'
                name='passwordConfirm'
                placeholder='비밀번호 재입력'
                type={showPasswordConfirm ? 'text' : 'password'}
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
              <button
                className='absolute top-[17px] right-[16px]'
                type='button'
                onClick={() => setShowPasswordConfirm((prev) => !prev)}
              >
                {showPasswordConfirm ? (
                  <EyeOpen alt='비밀번호 숨기기' height={24} width={24} />
                ) : (
                  <EyeClose alt='비밀번호 보기' height={24} width={24} />
                )}
              </button>
            </div>
          </div>

          {/* Nickname */}
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='nickname'>
              닉네임
            </label>
            <input
              required
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='nickname'
              name='nickname'
              placeholder='별명 (2~20자)'
              type='text'
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>

          {/* Terms Agreement Section */}
          <div className='space-y-[12px]'>
            <label className='block text-[16px]/[22px]'>약관동의</label>

            {/* All Agree Checkbox */}
            <div className='border border-[#E0E0E0] px-[16px] py-[24px]'>
              <div className='flex items-center'>
                <input
                  checked={formData.allAgreed}
                  className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                  id='allAgreed'
                  name='allAgreed'
                  type='checkbox'
                  onChange={handleAllAgreedChange}
                />
                <label
                  className='ml-[6px] block text-[16px]/[20px] font-medium'
                  htmlFor='allAgreed'
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
                    checked={formData.ageAgreed}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='ageAgreed'
                    name='ageAgreed'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='ageAgreed'
                  >
                    만 14세 이상입니다{' '}
                    <span className='text-[14px] text-[#6C918B]'>(필수)</span>
                  </label>
                </div>

                {/* Terms of Service */}
                <div className='flex items-center'>
                  <input
                    checked={formData.termsAgreed}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='termsAgreed'
                    name='termsAgreed'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='termsAgreed'
                  >
                    이용약관{' '}
                    <span className='text-[14px] text-[#6C918B]'>(필수)</span>
                  </label>
                </div>

                {/* Marketing */}
                <div className='flex items-center'>
                  <input
                    checked={formData.marketingAgreed}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='marketingAgreed'
                    name='marketingAgreed'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='marketingAgreed'
                  >
                    개인정보 마케팅 활용 동의{' '}
                    <span className='text-[14px] text-[#BDBDBD]'>(선택)</span>
                  </label>
                </div>

                {/* Event/Coupon */}
                <div className='flex items-center'>
                  <input
                    checked={formData.eventAgreed}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='eventAgreed'
                    name='eventAgreed'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='eventAgreed'
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
              className='h-[56px] w-full bg-black text-[16px]/[22px] font-bold text-white'
              type='submit'
            >
              가입하기
            </button>
          </div>
        </form>

        <div className='pt-[16px] text-center'>
          <p className='text-[16px]/[24px] text-[#424242]'>
            이미 아이디가 있으신가요?
            <Link className='px-[16px] font-semibold underline' href='/login'>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
