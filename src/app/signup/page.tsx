'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    phone: '',
    verificationCode: '',
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
    if (!formData.termsAccepted) {
      alert('약관에 동의해야 합니다.');
      return;
    }
    // TODO: Implement actual signup logic
    console.log('Signup attempt with:', formData);
    alert('회원가입 시도: ' + formData.email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md my-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          회원가입
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              휴대폰 번호
            </label>
            <div className="flex space-x-2 mt-1">
              <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="flex-grow w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              <button type="button" onClick={handleVerify} className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700">
                인증하기
              </button>
            </div>
          </div>

          {/* Verification Code */}
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
              인증번호
            </label>
            <input id="verificationCode" name="verificationCode" type="text" required value={formData.verificationCode} onChange={handleChange} className="w-full px-3 py-2 mt-1 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 mt-1 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 mt-1 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* Password Confirm */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input id="passwordConfirm" name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleChange} className="w-full px-3 py-2 mt-1 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* Nickname */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input id="nickname" name="nickname" type="text" required value={formData.nickname} onChange={handleChange} className="w-full px-3 py-2 mt-1 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center">
            <input id="termsAccepted" name="termsAccepted" type="checkbox" checked={formData.termsAccepted} onChange={handleChange} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">이용약관</Link>에 동의합니다.
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
