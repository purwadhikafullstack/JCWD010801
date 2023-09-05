import { Outlet } from "react-router-dom";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navigation/navbar";

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
