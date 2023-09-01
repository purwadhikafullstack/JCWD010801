import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar"
import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";

export const Layout = () => {
    return (
        <>
        <Navbar />
            <Container maxW='1440px'>
                <Outlet />
            </Container>
        <Footer/>
        </>
    )
}