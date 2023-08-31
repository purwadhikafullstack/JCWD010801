import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar"
import { Outlet } from "react-router-dom";

export const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer/>
        </>
    )
}