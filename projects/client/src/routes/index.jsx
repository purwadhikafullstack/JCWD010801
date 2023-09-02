import Homepage from "../pages/Home";
import { Route, createRoutesFromElements } from "react-router-dom";
import { Login } from "../pages/login";
import { Registerpage } from "../pages/register";
import { ProductDetail } from "../pages/productDetail";

const Routes = (
    <>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Registerpage />} />;
    </>
);

export const routes = createRoutesFromElements(Routes);