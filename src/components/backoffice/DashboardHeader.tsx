"use client"

import { Bell } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface HeaderProps {
  onBellClick: () => void
  onHelpClick: () => void
}

export default function DashboardHeader({ onBellClick, onHelpClick }: HeaderProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm('로그아웃하시겠습니까?')) {
      logout();
    }
  };

  return (
    <div className="flex items-center self-stretch bg-black py-[15px] pl-16 pr-12">
      <img
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MOVF8BjaY8/kx9dcp7r_expires_30_days.png"
        className="w-24 h-8 mr-4 object-fill"
        alt="NAJAL Logo"
      />
      <span className="text-white text-2xl font-bold mr-0.5">판매자센터</span>
      <div className="flex flex-1 flex-col items-end">
        <div className="flex items-start">
          <button
            className="flex flex-col shrink-0 items-start bg-black text-left p-2.5 mr-2 rounded-lg border-0"
            onClick={onBellClick}
          >
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
          <button
            className="text-[#9E9E9E] text-base font-bold my-2.5 mx-4 hover:text-white cursor-pointer"
            onClick={onHelpClick}
          >
            고객센터
          </button>
          <button
            className="text-[#9E9E9E] text-base font-bold my-2.5 mx-4 hover:text-white cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}