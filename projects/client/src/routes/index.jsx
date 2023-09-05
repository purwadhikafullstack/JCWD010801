import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Spinner from "../components/spinner";
import Layout from "../pages/layout";
const Homepage = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/login"));
const RegisterPage = lazy(() => import("../pages/register"));
const VerificationPage = lazy(() => import("../pages/verification"));
const ProductDetail = lazy(() => import("../pages/productDetail"));
const Search = lazy(() => import("../pages/search"));
const SearchByCategory = lazy(() => import("../pages/searchByCategory"));
const SearchResponsiveBeta = lazy(() => import("../pages/search_resBeta"));

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Suspense fallback={<Spinner />}><Homepage /></Suspense> },
      { path: "/search", element: <Suspense fallback={<Spinner />}><Search /></Suspense> },
      { path: "/search/category/:CategoryId", element: <Suspense fallback={<Spinner />}><SearchByCategory /></Suspense> },
      { path: "/searchBeta", element: <Suspense fallback={<Spinner />}><SearchResponsiveBeta /></Suspense> },
      { path: "/product/:id", element: <Suspense fallback={<Spinner />}><ProductDetail /></Suspense> },
    ],
  },
  { path: "/login", element: <Suspense fallback={<Spinner />}><Login /></Suspense> },
  { path: "/register", element: <Suspense fallback={<Spinner />}><RegisterPage /></Suspense> },
  { path: "/verification/:token", element: <Suspense fallback={<Spinner />}><VerificationPage /></Suspense> },
]);
