'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signUpUser } from '@/api/signup';
import { verificationPhoneNumber } from '@/api/signup/VerificationNumberRequest';
import { verify_number } from '@/api/signup/VerificationNumberResponse';
import EyeClose from '@/assets/eye-close.svg';
import EyeOpen from '@/assets/eye-open.svg';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    verificationCode: '',
    userId: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    allAgreed: false,
    isOver14: false,
    agreedToTerms: false,
    marketingEnabled: false,
    eventSnsEnabled: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isphoneNumberVerified, setIsphoneNumberVerified] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAllAgreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      allAgreed: checked,
      isOver14: checked,
      agreedToTerms: checked,
      marketingEnabled: checked,
      eventSnsEnabled: checked,
    }));
  };

  // 카운트다운 포맷팅 함수
  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleIndividualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: checked,
      };

      const allChecked =
        newState.isOver14 &&
        newState.agreedToTerms &&
        newState.marketingEnabled &&
        newState.eventSnsEnabled;

      return {
        ...newState,
        allAgreed: allChecked,
      };
    });
  };

  const handleVerify = async () => {
    const { phoneNumber } = formData;
    if (!phoneNumber) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      alert('인증번호가 발송되었습니다.');
      const data = await verificationPhoneNumber({ phoneNumber });
      console.log('인증번호 발송 응답:', data);
      
      // 인증번호 발송 성공 시 카운트다운 시작
      setIsVerificationSent(true);
      setCountdown(300); // 5분 = 300초
      
      // 카운트다운 타이머 시작
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            setIsVerificationSent(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      alert('인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error('인증번호 발송 에러:', error);
    }
  };

  const handleConfirmCode = async () => {
    const { phoneNumber, verificationCode } = formData;
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      const data = await verify_number({ phoneNumber, verificationCode });
      if (data.success) {
        setIsphoneNumberVerified(true);
        alert('휴대폰 인증이 완료되었습니다.');
      } else {
        alert(data.message || '인증에 실패했습니다. 번호를 다시 확인해주세요.');
      }
    } catch (error) {
      alert('인증에 실패했습니다. 번호를 다시 확인해주세요.');
      console.error('인증 확인 에러:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isphoneNumberVerified) {
      alert('휴대폰 인증을 완료해야 합니다.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      alert('닉네임은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }
    if (!formData.isOver14 || !formData.agreedToTerms) {
      alert('필수 약관에 동의해야 합니다.');
      return;
    }

    try {
      const { passwordConfirm, allAgreed, ...signUpData } = formData;
      const response = await signUpUser(signUpData);

      if (response.success) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        router.push('/login');
      } else {
        alert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
      console.error('회원가입 에러:', error);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center py-12'>
      <div className='w-full max-w-[448px] space-y-[24px]'>
        <h1 className='pb-[8px] text-center text-[36px]/[40px] font-bold text-[#0D141C]'>
          회원가입
        </h1>
        <form className='flex flex-col gap-[24px]' onSubmit={handleSubmit}>
          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='phoneNumber'>
              휴대폰 번호
            </label>
            <div className='flex gap-[6px]'>
              <input
                className='w-full flex-grow border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='phoneNumber'
                name='phoneNumber'
                placeholder='전화번호 입력 (- 없이)'
                type='tel'
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isphoneNumberVerified}
              />
              <button
                className='h-[44px] w-[100px] shrink-0 bg-black px-4 text-[14px] font-bold text-white disabled:bg-gray-400'
                type='button'
                onClick={handleVerify}
                disabled={isphoneNumberVerified || isVerificationSent}
              >
                인증하기
              </button>
            </div>
            
            {/* 카운트다운 표시 */}
            {isVerificationSent && countdown !== null && (
              <div className='text-gray-500 text-sm mt-1'>
                인증번호 유효시간: {formatCountdown(countdown)}
              </div>
            )}
            
            <div className='mt-[4px] flex gap-[6px]'>
              <input
                className='w-full flex-grow border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
                id='verificationCode'
                name='verificationCode'
                placeholder='인증번호 입력'
                type='text'
                value={formData.verificationCode}
                onChange={handleChange}
                disabled={isphoneNumberVerified}
              />
              <button
                className='h-[44px] w-[100px] shrink-0 bg-black px-4 text-[14px] font-bold text-white disabled:bg-gray-400'
                type='button'
                onClick={handleConfirmCode}
                disabled={isphoneNumberVerified}
              >
                인증 확인
              </button>
            </div>
            {isphoneNumberVerified && (
              <p className='mt-2 text-sm text-green-600'>
                ✅ 휴대폰 인증이 완료되었습니다.
              </p>
            )}
          </div>

          <div className='space-y-[8px]'>
            <label className='block text-[16px]/[22px]' htmlFor='userId'>
              아이디
            </label>
            <input
              required
              className='w-full border border-[#E0E0E0] px-[16px] py-[10px] text-[16px]/[22px] placeholder-[#9E9E9E]'
              id='userId'
              name='userId'
              placeholder='아아디 입력 2~20자 (영문, 숫자, 특수문자 가능)'
              type='text'
              value={formData.userId}
              onChange={handleChange}
            />
          </div>

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

          <div className='space-y-[12px]'>
            <label className='block text-[16px]/[22px]'>약관동의</label>

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

              <div className='space-y-[12px]'>
                <div className='flex items-center'>
                  <input
                    checked={formData.isOver14}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='isOver14'
                    name='isOver14'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='isOver14'
                  >
                    만 14세 이상입니다{' '}
                    <span className='text-[14px] text-[#6C918B]'>(필수)</span>
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    checked={formData.agreedToTerms}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='agreedToTerms'
                    name='agreedToTerms'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='agreedToTerms'
                  >
                    이용약관{' '}
                    <span className='text-[14px] text-[#6C918B]'>(필수)</span>
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    checked={formData.marketingEnabled}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='marketingEnabled'
                    name='marketingEnabled'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='marketingEnabled'
                  >
                    개인정보 마케팅 활용 동의{' '}
                    <span className='text-[14px] text-[#BDBDBD]'>(선택)</span>
                  </label>
                </div>

                <div className='flex items-center'>
                  <input
                    checked={formData.eventSnsEnabled}
                    className='size-[16px] rounded border-[#E5E5E5] focus:ring-black'
                    id='eventSnsEnabled'
                    name='eventSnsEnabled'
                    type='checkbox'
                    onChange={handleIndividualChange}
                  />
                  <label
                    className='ml-[6px] block text-[16px]/[20px]'
                    htmlFor='eventSnsEnabled'
                  >
                    이벤트, 쿠폰, 특가 알림 메일 및 SMS 등 수신{' '}
                    <span className='text-[14px] text-[#BDBDBD]'>(선택)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

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