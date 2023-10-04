import { Navigate } from "react-router-dom";
import Order from "./components/order";

export const CheckoutPageView = () => {
	const token = localStorage.getItem("token");
	return token ? <Order /> : <Navigate to="*" />;
};
