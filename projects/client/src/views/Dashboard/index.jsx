import Spinner from "../../components/spinner";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { BranchAdminDashboardButton } from "./components/branchAdmin";
import { SuperAdminDashboardButton } from "./components/superAdmin";

export const AdminDashboardButton = () => {
	const { RoleId } = useSelector((state) => state?.user?.value);

	return (
		<>
			<Suspense fallback={<Spinner />}>
				{RoleId === 3 ? <SuperAdminDashboardButton /> : RoleId === 2 ? <BranchAdminDashboardButton /> : null}
			</Suspense>
		</>
	);
};