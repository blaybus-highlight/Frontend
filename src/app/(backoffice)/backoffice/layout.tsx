"use client"

import { ReactNode, useState } from "react"
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
	const [activeMenu, setActiveMenu] = useState<string>("홈")
	const [alertOpen, setAlertOpen] = useState<boolean>(false)
	const [alertMessage, setAlertMessage] = useState<string>("")

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
				<DashboardSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
				<main className="p-4 bg-white flex-1 overflow-y-auto">{children}</main>
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


