import { Route, createRoutesFromElements } from "react-router-dom";
import Homepage from "../pages/Home";
import { Login } from "../pages/login";
import { ProductDetail } from "../pages/productDetail";

const Routes = (
    <>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
    </>
)

export const routes = createRoutesFromElements(Routes);

