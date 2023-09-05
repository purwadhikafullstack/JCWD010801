import { Footer } from "../components/footer";
import { Navbar } from "../components/navigation/navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<>
			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
};

export default Layout;
