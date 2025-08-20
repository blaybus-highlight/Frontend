'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import eyeIcon from "@/assets/eye-icon.png";
import { loginAdmin } from "@/api/backoffice/login/login";

const NafalLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // 타입을 string | null로 지정
  const router = useRouter();

  const handleLogin = async () => {
    if (!adminId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await loginAdmin({ adminId, password });
      // 토큰은 loginAdmin 함수 내에서 자동으로 저장됨
      
      // 토큰 저장 후 강제로 이벤트 발생
      window.dispatchEvent(new Event('tokenChanged'));
      
      // 잠시 대기 후 대시보드로 이동 (헤더 업데이트를 위해)
      setTimeout(() => {
        router.push('/backoffice/dashboard');
      }, 100);
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center self-stretch py-[120px] mb-[1px]">
      <div className="flex flex-col items-center self-stretch px-[60px] py-[40px] bg-white rounded-lg shadow-lg">
        <h1 className="text-[32px] font-bold text-[#111416] mb-[40px]">
          관리자 로그인
        </h1>
        
        <div className="w-full max-w-[400px] space-y-[24px]">
          {/* 아이디 입력 */}
          <div className="space-y-[8px]">
            <label className="block text-[16px] font-medium text-[#111416]">
              아이디
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-[16px] py-[12px] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-[8px]">
            <label className="block text-[16px] font-medium text-[#111416]">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-[16px] py-[12px] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[16px] top-1/2 transform -translate-y-1/2"
              >
                <img
                  src={eyeIcon.src}
                  alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="w-[20px] h-[20px]"
                />
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-[56px] bg-[#111416] text-white font-bold rounded-lg hover:bg-[#2C2C2C] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NafalLoginForm;