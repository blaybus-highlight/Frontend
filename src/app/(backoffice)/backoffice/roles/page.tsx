import RolesContent from "@/components/backoffice/roles/RolesContent";
import { SuperAdminGuard } from "@/components/backoffice/SuperAdminGuard";

export default function RolesPage() {
	return (
		<SuperAdminGuard>
			<RolesContent />
		</SuperAdminGuard>
	);
}


