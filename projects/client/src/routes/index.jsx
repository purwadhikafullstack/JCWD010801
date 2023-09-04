import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/login";
import { Registerpage } from "../pages/register";
import { ProductDetail } from "../pages/productDetail";
import { Search } from "../pages/search";
import { SearchResponsiveBeta } from "../pages/search_resBeta";
import { VerificationPage } from "../pages/verification";

export const AppRouter = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/register", element: <Registerpage /> },
  { path: "/search", element: <Search /> },
  { path: "/searchBeta", element: <SearchResponsiveBeta /> },
  { path: "/verification/:token", element:<VerificationPage /> },
]);