import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import { Login } from "../pages/login";

import { Registerpage } from "../pages/Register";
const Routes = (
    <>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
    </>
)

const Routes = (
    <>
<Route path="/" element={<Homepage />} />;
<Route path="/register" element={<Registerpage/>} />;
    </>
)
export const routes = createRoutesFromElements(Routes);

