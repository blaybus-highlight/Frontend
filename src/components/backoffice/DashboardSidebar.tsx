"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { isSuperAdmin } from "@/lib/tokenUtils"

interface SidebarProps {
  activeMenu: string
  onMenuClick: (menu: string) => void
}

export default function Sidebar({ activeMenu, onMenuClick }: SidebarProps) {
  const router = useRouter()
  const [hasSuperAdminAccess, setHasSuperAdminAccess] = useState(false)
  
  useEffect(() => {
    setHasSuperAdminAccess(isSuperAdmin())
  }, [])

  const baseMenus = ["경매", "상품", "고객"]
  const adminMenus = hasSuperAdminAccess ? ["권한"] : []
  const commonMenus = ["설정"]
  const menus = [...baseMenus, ...adminMenus, ...commonMenus]
  
  const menuToPath: Record<string, string> = {
    "경매": "/backoffice/auction",
    "상품": "/backoffice/products",
    "고객": "/backoffice/customers",
    "권한": "/backoffice/roles",
    "설정": "/backoffice/settings",
  }

  return (
    <div className="flex flex-col shrink-0 items-start bg-white pt-8 pb-[1131px]">
      <img
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MOVF8BjaY8/jz9fow6c_expires_30_days.png"
        className="w-[168px] h-10 mb-[15px] mx-4 object-fill cursor-pointer"
        alt="홈 아이콘"
        onClick={() => {
          onMenuClick("홈")
          router.push("/backoffice/dashboard")
        }}
      />
      {menus.map((menu) => (
        <div
          key={menu}
          className={`flex flex-col items-center py-2 pl-3 pr-[121px] mb-4 mx-4 hover:bg-[#F4FEFC] cursor-pointer ${
            activeMenu === menu ? "bg-[#F4FEFC]" : "bg-white"
          }`}
          onClick={() => {
            onMenuClick(menu)
            const targetPath = menuToPath[menu]
            if (targetPath) router.push(targetPath)
          }}
        >
          <span className={`text-xl font-bold ${activeMenu === menu ? "text-[#111416]" : "text-[#9E9E9E]"}`}>
            {menu}
          </span>
        </div>
      ))}
    </div>
  )
}