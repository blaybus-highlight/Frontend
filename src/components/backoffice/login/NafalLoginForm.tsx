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
      const token = await loginAdmin({ adminId, password });
      if (token) {
        // 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', token);
        router.push('/backoffice/dashboard');
      } else {
        setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center self-stretch py-[120px] mb-[1px]">
      <div className="flex flex-col items-center gap-[31px]">
        <span className="text-nafal-text-dark text-4xl font-bold">
          관리자 로그인
        </span>
        <div className="flex flex-col items-center gap-6">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col items-start gap-6 w-full max-w-[400px]">
            {/* adminId Field */}
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
                  aria-label="관리자 아이디"
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            </div>

            {/* Password Field */}
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
                >
                  <img
                    src={eyeIcon.src}
                    alt="비밀번호 표시/숨기기"
                    className="w-6 h-6 object-fill"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            className="h-[56px] w-full max-w-[400px] bg-black text-[16px]/[22px] font-bold text-white disabled:bg-black-400"
            onClick={handleLogin}
            disabled={isLoading || !adminId || !password}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* Bottom Links */}
          <div className="flex items-start px-[78px]">
            <span className="text-foreground text-sm my-2.5 ml-4 mr-[17px] cursor-pointer hover:underline">
              비밀번호 찾기
            </span>
            <span className="text-foreground text-sm my-2.5 ml-4 mr-[17px] cursor-pointer hover:underline">
              아이디 찾기
            </span>
            <span className="text-foreground text-sm my-2.5 mx-4 cursor-pointer hover:underline">
              회원가입
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NafalLoginForm;