import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import { Login } from "../pages/login";
import { Registerpage } from "../pages/register";
import { VerificationPage } from "../pages/verification";

const Routes = (
  <>
    <Route path="/" element={<Homepage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Registerpage />} />;
    <Route path="/verification/:token" element={<VerificationPage />} />;
  </>
);

export const routes = createRoutesFromElements(Routes);
