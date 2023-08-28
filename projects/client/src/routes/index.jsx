import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";

const Routes = <Route path="/" element={<Homepage />} />;

export const routes = createRoutesFromElements(Routes);
