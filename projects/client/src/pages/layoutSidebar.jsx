import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Error404PageView } from "../views/Error404";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { Box } from "@chakra-ui/react";
import { SidebarMobile } from "../components/navigation/sidebarMobile";

const LayoutSidebar = ({ height }) => {
	const token = localStorage.getItem("token");
	const data = useSelector((state) => state?.user?.value);
	return (
		<>
			{data.RoleId === 1 || !token ? (
				<Error404PageView />
			) : (
				<>
					<Box display={["none", "none", "block", "block"]}>
						<AdminSidebar height={height || "100vh"} />
						<Outlet />
					</Box>
					<Box display={["block", "block", "none", "none"]}>
						<SidebarMobile />
						<Outlet />
					</Box>
				</>
			)}
		</>
	);
};

export default LayoutSidebar;
