import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Error404PageView } from "../views/Error404";
import { AdminSidebar } from "../components/navigation/adminSidebar";

const LayoutSidebar = () => {
	const token = localStorage.getItem("token");
	const data = useSelector((state) => state.user.value);
	return (
		<>
			{data.RoleId === 1 || !token ? (
				<Error404PageView />
			) : (
				<>
					<AdminSidebar />
					<Outlet />
				</>
			)}
		</>
	);
};

export default LayoutSidebar;
