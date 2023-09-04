import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import { Login } from "../pages/login";
import { Registerpage } from "../pages/register";
import { BranchesList } from "../pages/brancheslist";
import { AdminsList } from "../pages/adminslist";

const Routes = (
  <>
    <Route path="/" element={<Homepage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Registerpage />} />
    <Route path="/brancheslist" element={<BranchesList />} />
    <Route path="/adminslist" element={<AdminsList />} />
  </>
);

export const routes = createRoutesFromElements(Routes);
