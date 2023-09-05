import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/login";
import { Registerpage } from "../pages/register";
import { ProductDetail } from "../pages/productDetail";
import { Search } from "../pages/search";
import { SearchResponsiveBeta } from "../pages/search_resBeta";
import { VerificationPage } from "../pages/verification";
import Homepage from "../pages/Home";
import { Layout } from "../pages/layout";
import { Error404page } from "../pages/error404";

export const AppRouter = createBrowserRouter([
  { path: "/", element: <Layout />, children: [
    { path: "/", element: <Homepage /> },
    { path: "/search", element: <Search /> },
    { path: "/searchBeta", element: <SearchResponsiveBeta /> },
    { path: "/product/:id", element: <ProductDetail /> }
  ] },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Registerpage /> },
  { path: "/verification/:token", element:<VerificationPage /> },
  { path: "*", element:<Error404page /> },
]);