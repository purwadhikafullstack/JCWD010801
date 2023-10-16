import { Navigate } from "react-router-dom";
import { VoucherPageView } from "../views/Voucher"

const VoucherPage = () => {
    const token = localStorage.getItem("token");
	return token ? <VoucherPageView /> : <Navigate to="*" />;
}

export default VoucherPage;