"use client"

import Link from "next/link"
import { useState } from "react"
import NafalLoginHeader from "@/components/backoffice/login/NafalLoginHeader"
import NafalLoginFooter from "@/components/backoffice/login/NafalLoginFooter"
import { signUpAdmin } from "@/api/backoffice/login/signup"
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const [adminId, setId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const router = useRouter();

  const handleSignup = async () => {
    if (!adminId || !password || !confirmPw) {
      alert("모든 값을 입력해주세요.")
      return
    }
    if (password !== confirmPw) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    try {
      const data = await signUpAdmin({ adminId, password })
      console.log("회원가입 성공:", data)
      alert("회원가입이 완료되었습니다.")
      router.push("/backoffice/login");
    } catch (error) {
      console.error("회원가입 오류:", error)
      alert("회원가입 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* 상단 네비게이션 */}
      
      <NafalLoginHeader />

      {/* 메인 영역 */}
      <div className="flex flex-col items-center py-24 flex-grow">
        <h1 className="text-4xl font-bold mb-12">회원가입</h1>
        <div className="flex flex-col gap-6 w-[400px]">
          {/* 아이디 */}
          <div className="flex flex-col gap-2">
            <label className="text-black text-base">아이디</label>
            <input
              type="text"
              placeholder="아이디 입력"
              value={adminId}
              onChange={(e) => setId(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label className="text-black text-base">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="password"
              placeholder="비밀번호 재입력"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            onClick={handleSignup}
            className="bg-black text-white font-bold py-3 rounded"
          >
            회원가입하기
          </button>

          {/* 로그인 안내 */}
          <div className="flex justify-center text-base mt-4">
            <span className="text-gray-600">이미 아이디가 있으신가요?</span>
            <Link href="/login" className="ml-2 font-bold">
              로그인
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ 푸터 삽입 */}
      <NafalLoginFooter />
    </div>
  )
}