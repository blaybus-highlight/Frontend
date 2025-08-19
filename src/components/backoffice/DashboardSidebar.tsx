"use client"

import { useRouter } from "next/navigation"

interface SidebarProps {
  activeMenu: string
  onMenuClick: (menu: string) => void
}

export default function Sidebar({ activeMenu, onMenuClick }: SidebarProps) {
  const router = useRouter()
  const menus = ["홈", "경매", "상품", "고객", "권한", "설정"]
  const menuToPath: Record<string, string> = {
    "홈": "/backoffice/dashboard",
    "경매": "/backoffice/auction",
    "상품": "/backoffice/products",
    "고객": "/backoffice/customers",
    "권한": "/backoffice/roles",
    "설정": "/backoffice/settings",
  }

  return (
    <div className="flex flex-col shrink-0 items-start bg-white pt-8 pb-[1131px]">
      
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