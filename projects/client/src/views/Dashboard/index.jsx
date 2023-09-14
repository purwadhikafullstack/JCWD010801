import { useSelector } from "react-redux";
import { BranchAdminDashboardButton } from "./components/branchAdmin";
import { SuperAdminDashboardButton } from "./components/superAdmin";

export const AdminDashboardButton = () => {
	const user = useSelector((state) => state.user.value);
	return <>{user.RoleId === 3 ? <SuperAdminDashboardButton /> : <BranchAdminDashboardButton />}</>;
};
