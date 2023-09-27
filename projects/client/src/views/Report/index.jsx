import { Navigate } from "react-router-dom";
import { Report } from "./pages/report";
import { useSelector } from "react-redux";

export const ReportPageView = () => {
	const reduxStore = useSelector((state) => state?.user);
	const roleId = reduxStore?.value?.RoleId;
	const token = localStorage.getItem("token");

	if (token) {
		if (roleId) {
			if (roleId === 2 || roleId === 3) {
				return <Report />;
			} else {
				return <Navigate to="*" />;
			}
		}
	} else {
		return <Navigate to="*" />;
	}
};
