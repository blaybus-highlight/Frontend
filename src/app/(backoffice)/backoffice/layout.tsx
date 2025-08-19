"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import DashboardHeader from "@/components/backoffice/DashboardHeader"
import DashboardSidebar from "@/components/backoffice/DashboardSidebar"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BackofficeLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const [activeMenu, setActiveMenu] = useState<string>("홈")
	const [alertOpen, setAlertOpen] = useState<boolean>(false)
	const [alertMessage, setAlertMessage] = useState<string>("")

	// 로그인 페이지에서는 헤더/사이드바 레이아웃을 적용하지 않음
	if (pathname === "/backoffice/login") {
		return <>{children}</>
	}

	const showSidebar = pathname !== "/backoffice/auction/submit"; // New condition

	return (
		<div className="flex h-screen flex-col">
			<div className="sticky top-0 z-10">
				<DashboardHeader
					onBellClick={() => {
						setAlertMessage("새로운 알림이 3개 있습니다")
						setAlertOpen(true)
					}}
					onHelpClick={() => {
						setAlertMessage("고객센터로 연결됩니다")
						setAlertOpen(true)
					}}
				/>
			</div>

			<div className="flex flex-1 min-h-0">
				{showSidebar && <DashboardSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />}
				<main className={`p-4 bg-white overflow-y-auto ${showSidebar ? "flex-1" : "w-full"}`}>{children}</main>
			</div>

			<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>안내</AlertDialogTitle>
						<AlertDialogDescription>{alertMessage}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setAlertOpen(false)}>확인</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}


