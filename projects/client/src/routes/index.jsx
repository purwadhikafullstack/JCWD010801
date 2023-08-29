import { Route, createRoutesFromElements } from "react-router-dom";

import Homepage from "../pages/Home";
import Cart from "../pages/Cart";

const Routes = (
  <>
    <Route path="/" element={<Homepage />} />
    <Route path="/cart" element={<Cart />} />
  </>
);

export const routes = createRoutesFromElements(Routes);
