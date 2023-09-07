import Spinner from "../components/spinner";
import Layout from "../pages/layout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Error404page } from "../pages/error404";
import { AdminSidebar } from "../components/navigation/adminSidebar";
const Homepage = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/login"));
const RegisterPage = lazy(() => import("../pages/register"));
const VerificationPage = lazy(() => import("../pages/verification"));
const ProductDetail = lazy(() => import("../pages/productDetail"));
const Search = lazy(() => import("../pages/search"));
const SearchByCategory = lazy(() => import("../pages/searchByCategory"));
const SearchByQuery = lazy(() => import("../pages/searchByQuery"));
const AdminsList  = lazy(() => import("../pages/adminsList"));

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
				children: [
					{
						path: "",
						element: (
							<Suspense fallback={<Spinner />}>
								<Search />
							</Suspense>
						),
					},
					{
						path: "category/:CategoryId",
						element: (
							<Suspense fallback={<Spinner />}>
								<SearchByCategory />
							</Suspense>
						),
					},
					{
						path: "products/:query",
						element: (
							<Suspense fallback={<Spinner />}>
								<SearchByQuery />
							</Suspense>
						),
					},
				],
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
		path: "/verification/:token",
		element: (
			<Suspense fallback={<Spinner />}>
				<VerificationPage />
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
	{ path: "*", element: <Error404page /> },
	{ path: "/sidebar", element: <AdminSidebar /> },
]);
