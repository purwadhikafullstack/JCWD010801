import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import { Layout } from "../pages/layout";

const Routes = (
    <Route path="/" element={<Layout/>}>
        <Route path="/" element={<Homepage />} />;
    </Route>
)

export const routes = createRoutesFromElements(Routes);
