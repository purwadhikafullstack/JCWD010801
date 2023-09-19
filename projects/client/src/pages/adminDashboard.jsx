import { useSelector } from "react-redux";
import { AdminDashboardButton } from "../views/Dashboard";
import { Error404PageView } from "../views/Error404";

const AdminDashboard = () => {
	const token = localStorage.getItem("token");
	const data = useSelector((state) => state.user.value);
	return (
		<>
			{data.RoleId === 1 || !token ? (
				<Error404PageView />
			) : (
				<>
					<AdminDashboardButton />
				</>
			)}
		</>
	);
};

export default AdminDashboard;
