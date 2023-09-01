import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import { Layout } from "../pages/layout";    
import { Login } from "../pages/login";

import { Registerpage } from "../pages/register";
const Routes = (
    <>
        <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Homepage />} />;
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registerpage />} />;
    </>
);

export const routes = createRoutesFromElements(Routes);

