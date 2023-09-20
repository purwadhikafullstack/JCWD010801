import { useSelector } from "react-redux";
import { SuperAdminOrdersList } from "../views/OrdersList/components/superAdminOrderList";
import { BranchAdminOrdersList } from "../views/OrdersList/components/branchAdminOrderList";
import { Error404PageView } from "../views/Error404";

const OrdersList = () => {
	const data = useSelector((state) => state?.user?.value);
	return (
		<>
			{data.RoleId === 3 ? (
				<SuperAdminOrdersList />
			) : data.RoleId === 2 ? (
				<BranchAdminOrdersList />
			) : (
				<Error404PageView />
			)}
		</>
	);
};

export default OrdersList;
