'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import eyeIcon from "@/assets/eye-icon.png";

const NafalLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to dashboard after login
    router.push('/backoffice/Dashboard');
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center self-stretch py-[120px] mb-[1px]">
      <div className="flex flex-col items-center gap-[31px]">
        <span className="text-nafal-text-dark text-4xl font-bold">
          관리자 로그인
        </span>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-start gap-6">
            {/* Username Field */}
            <div className="flex flex-col items-start gap-[7px]">
              <span className="text-foreground text-base">
                아이디
              </span>
              <div className="flex flex-col items-start bg-background py-2.5 pl-4 pr-[363px] border border-solid border-[#E0E0E0]">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디 입력"
                  className="text-nafal-gray text-base bg-transparent border-none outline-none placeholder:text-nafal-gray w-full"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col items-start gap-[7px]">
              <span className="text-foreground text-base">
                비밀번호
              </span>
              <div className="flex items-center bg-background py-[9px] px-4 border border-solid border-[#E0E0E0]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="text-nafal-gray text-base mr-[310px] bg-transparent border-none outline-none placeholder:text-nafal-gray"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={eyeIcon.src}
                    alt="Toggle password visibility"
                    className="w-6 h-6 object-fill"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button 
            className="flex flex-col items-start bg-nafal-black py-[17px] px-[203px] hover:bg-opacity-90 transition-colors"
            onClick={handleLogin}
          >
            <span className="text-nafal-white text-base font-bold">
              로그인
            </span>
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
