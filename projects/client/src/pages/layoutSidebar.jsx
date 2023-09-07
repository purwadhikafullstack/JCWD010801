import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { useSelector } from "react-redux";
import { Error404PageView } from "../views/Error404";

const LayoutSidebar = () => {
	const data = useSelector((state) => state.user.value);
	return (
		<>
			{data.RoleId === 1 ? (
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
