import Axios from "axios";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setValue } from "./redux/userSlice";
import { AppRouter } from "./routes/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const token = localStorage.getItem("token");
	const dispatch = useDispatch();

	useEffect(() => {
		const keepLogin = async () => {
			try {
				const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/keeplogin`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				dispatch(setValue(response.data));
			} catch (error) {
				localStorage.removeItem("token");
				toast.warn("Please login into your AlphaMart account for a better shopping experience.", {
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			}
		};
		keepLogin();
	}, [dispatch, token]);

	return <RouterProvider router={AppRouter} />;
}

export default App;
