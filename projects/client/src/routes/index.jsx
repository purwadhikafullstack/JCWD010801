import Spinner from "../components/spinner";
import Layout from "../pages/layout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Error404page } from "../pages/error404";
const LayoutSideBar = lazy(() => import("../pages/layoutSidebar"));
const Homepage = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/login"));
const RegisterPage = lazy(() => import("../pages/register"));
const VerificationPage = lazy(() => import("../pages/verification"));
const ProductDetail = lazy(() => import("../pages/productDetail"));
const Search = lazy(() => import("../pages/search"));
const AdminsList = lazy(() => import("../pages/adminsList"));
const ForgotPasswordPage = lazy(() => import("../pages/forgotPassword"));
const ResetPasswordPage = lazy(() => import("../pages/resetPassword"));
const ProductManagement = lazy(() => import("../pages/productManagement"));

export const AppRouter = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: (
					<Suspense fallback={<Spinner />}>
						<Homepage />
					</Suspense>
				),
			},
			{
				path: "adminslist",
				element: (
					<Suspense fallback={<Spinner />}>
						<AdminsList />
					</Suspense>
				),
			},
			{
				path: "/search",
				element: (
					<Suspense fallback={<Spinner />}>
						<Search />
					</Suspense>
				),
			},
			{
				path: "/product/:id",
				element: (
					<Suspense fallback={<Spinner />}>
						<ProductDetail />
					</Suspense>
				),
			},
		],
	},
	{
		path: "/admindashboard",
		element: <LayoutSideBar />,
		children: [
			{
				path: "adminslist",
				element: (
					<Suspense fallback={<Spinner />}>
						<AdminsList />
					</Suspense>
				),
			},
		],
	},
	{
		path: "/login",
		element: (
			<Suspense fallback={<Spinner />}>
				<Login />
			</Suspense>
		),
	},
	{
		path: "/register",
		element: (
			<Suspense fallback={<Spinner />}>
				<RegisterPage />
			</Suspense>
		),
	},
	{
		path: "/forgot-password",
		element: (
			<Suspense fallback={<Spinner />}>
				<ForgotPasswordPage />
			</Suspense>
		),
	},
	{
		path: "/reset-password/:token",
		element: (
			<Suspense fallback={<Spinner />}>
				<ResetPasswordPage />
			</Suspense>
		),
	},
	{
		path: "/verification/:token",
		element: (
			<Suspense fallback={<Spinner />}>
				<VerificationPage />
			</Suspense>
		),
	},
	{
		path: "product-management",
		element: (
			<Suspense fallback={<Spinner />}>
				<ProductManagement />
			</Suspense>
		),
	},
	{ path: "*", element: <Error404page /> },
]);
