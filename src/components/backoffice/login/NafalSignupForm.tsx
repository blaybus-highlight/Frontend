'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const NafalSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async () => {
    if (!adminId || !password || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      // 실제 API 호출 로직을 여기에 추가
      // const result = await signupAdmin({ adminId, password });
      
      // 임시로 성공 처리
      setTimeout(() => {
        alert("회원가입이 완료되었습니다!");
        router.push('/login');
      }, 1000);
      
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center self-stretch py-[120px] mb-[1px]">
      <div className="flex flex-col items-center gap-[31px]">
        <span className="text-nafal-text-dark text-4xl font-bold">
          회원가입
        </span>
        <div className="flex flex-col items-center gap-6">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col items-start gap-6 w-full max-w-[400px]">
            {/* 아이디 Field */}
            <div className="flex flex-col items-start gap-[7px] w-full">
              <span className="text-foreground text-base">
                아이디
              </span>
              <div className="flex flex-col items-start bg-background py-2.5 px-4 border border-solid border-[#E0E0E0] w-full">
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="아이디 입력"
                  className="text-nafal-gray text-base bg-transparent border-none outline-none placeholder:text-nafal-gray w-full"
                  aria-label="아이디"
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            </div>

            {/* 비밀번호 Field */}
            <div className="flex flex-col items-start gap-[7px] w-full">
              <span className="text-foreground text-base">
                비밀번호
              </span>
              <div className="flex items-center bg-background py-[9px] px-4 border border-solid border-[#E0E0E0] w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="text-nafal-gray text-base bg-transparent border-none outline-none placeholder:text-nafal-gray flex-1"
                  aria-label="비밀번호"
                  aria-invalid={error ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 비밀번호 재입력 Field */}
            <div className="flex flex-col items-start gap-[7px] w-full">
              <span className="text-foreground text-base">
                비밀번호 재입력
              </span>
              <div className="flex items-center bg-background py-[9px] px-4 border border-solid border-[#E0E0E0] w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 재입력"
                  className="text-nafal-gray text-base bg-transparent border-none outline-none placeholder:text-nafal-gray flex-1"
                  aria-label="비밀번호 재입력"
                  aria-invalid={error ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* 회원가입하기 Button */}
          <button
            className="h-[56px] w-full max-w-[400px] bg-black text-[16px]/[22px] font-bold text-white disabled:bg-black-400"
            onClick={handleSignup}
            disabled={isLoading || !adminId || !password || !confirmPassword}
          >
            {isLoading ? "가입 중..." : "회원가입하기"}
          </button>

          {/* Bottom Links */}
          <div className="flex items-center justify-center">
            <span className="text-foreground text-sm">
              이미 아이디가 있으신가요?{" "}
              <button 
                onClick={handleLoginClick}
                className="font-bold underline cursor-pointer hover:text-gray-700"
              >
                로그인
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NafalSignupForm;