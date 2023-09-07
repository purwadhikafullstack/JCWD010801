import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Error404PageView } from "../views/Error404";
import { AdminSidebar } from "../components/navigation/adminSidebar";

const LayoutSidebar = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const data = useSelector((state) => state.user.value);
	useEffect(() => {
		if (!token) navigate("/");
	});
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
