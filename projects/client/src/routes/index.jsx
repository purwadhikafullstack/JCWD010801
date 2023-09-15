import Spinner from "../components/spinner";
import Layout from "../pages/layout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Error404page } from "../pages/error404";
const AdminDashboard = lazy(() => import("../pages/adminDashboard"));
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
const ProfilePage = lazy(() => import("../pages/profile"));
const ProductManagement = lazy(() => import("../pages/productManagement"));
const CartPage = lazy(() => import("../pages/cart"));

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
				path: "/cart",
				element: (
					<Suspense fallback={<Spinner />}>
						<CartPage />
					</Suspense>
				)
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
		path: "/dashboard",
		element: (
			<Suspense fallback={<Spinner />}>
				<LayoutSideBar />
			</Suspense>
		),
		children: [
			{
				path: "/dashboard",
				element: (
					<Suspense fallback={<Spinner />}>
						<AdminDashboard />
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
		],
	},
	{
		path: "/dashboard/product-management",
		element: (
			<Suspense fallback={<Spinner />}>
				<ProductManagement />
			</Suspense>
		),
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
		path: "/profile",
		element: (
			<Suspense fallback={<Spinner />}>
				<ProfilePage />
			</Suspense>
		),
	},
	{ path: "*", element: <Error404page /> },
]);
