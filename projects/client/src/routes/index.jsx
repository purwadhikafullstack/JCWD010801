import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import { Login } from "../pages/login";

const Routes = (
    <>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
    </>
)

export const routes = createRoutesFromElements(Routes);

