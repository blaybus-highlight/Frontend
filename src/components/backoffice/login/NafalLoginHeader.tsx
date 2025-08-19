import nafalLogo from "@/assets/nafal-logo.png";
import React from 'react';

const NafalHeader = () => {
  return (
    // 헤더 전체 컨테이너입니다. 검은색 배경을 가집니다.
    <div className="flex items-center justify-between self-stretch bg-black py-4 px-6 sm:px-12 w-full">
      <div className="flex items-center">
        <img
          src={nafalLogo.src}
          alt="nafal"
          className="w-24 h-8 object-contain"
        />
      </div>
      <div>
        <div className="flex items-center space-x-8">
          <span className="text-white text-sm font-medium cursor-pointer hover:text-gray-300 transition-colors">
            로그인
          </span>
          <span className="text-white text-sm font-medium cursor-pointer hover:text-gray-300 transition-colors">
            회원가입
          </span>
          <span className="text-white text-sm font-medium cursor-pointer hover:text-gray-300 transition-colors">
            고객센터
          </span>
        </div>
      </div>
    </div>
  );
};

export default NafalHeader;