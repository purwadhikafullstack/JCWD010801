import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setValue } from "./redux/userSlice";
import { AppRouter } from "./routes/index";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function App() {
	const [branches, setBranches] = useState([]);
	const [address, setAddress] = useState([]);
	const token = localStorage.getItem("token");
	const userLat = parseFloat(localStorage.getItem("lat"));
	const userLng = parseFloat(localStorage.getItem("lng"));
	const dispatch = useDispatch();
	const currentBranchId = localStorage.getItem("BranchId");
	const userFromRedux = useSelector((state) => state.user.value.id);
	const dataUser = useSelector((state) => state.user.value);

	const isUserExist = () => Object.keys(dataUser).length > 0;

	const fetchAddress = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address?sort=asc`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setAddress(response.data.result);
		} catch (error) {
			setAddress([]);
		}
	};
	const fetchBranchData = async () => {
		try {
			const { data } = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(data);
		} catch (error) {
			console.log(error);
		}
	};

	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(async function (position) {
			try {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
				localStorage.setItem("lat", latitude);
				localStorage.setItem("lng", longitude);
			} catch (error) {
				console.error("Error:", error);
			}
		});
	} else {
		console.log("Geolocation isn't supported in this device.");
	}

	useEffect(() => {
		const calculateDistance = (lat1, lon1, lat2, lon2) => {
			const R = 6371;
			const dLat = (lat2 - lat1) * (Math.PI / 180);
			const dLon = (lon2 - lon1) * (Math.PI / 180);
			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			const distance = R * c;
			return distance;
		};

		const findClosestBranch = (userLat, userLng, branchData) => {
			let closestBranch = null;
			let minDistance = Infinity;

			branchData.forEach((branch) => {
				const branchLat = parseFloat(branch.lat);
				const branchLng = parseFloat(branch.lng);
				const distance = calculateDistance(userLat, userLng, branchLat, branchLng);

				if (distance < minDistance) {
					minDistance = distance;
					closestBranch = branch;
				}
			});
			return closestBranch;
		};
		const closestBranch = findClosestBranch(userLat, userLng, branches);
		if (address.length !== 0) {
			const filteredBranch = branches.filter(
				(item) =>
					address[0].lat <= item.northeast_lat &&
					address[0].lat >= item.southwest_lat &&
					address[0].lng <= item.northeast_lng &&
					address[0].lng >= item.southwest_lng
			);
			if (filteredBranch.length > 0) {
				localStorage.setItem("BranchId", parseInt(filteredBranch[0].id));
			} else {
				closestBranch !== null
					? localStorage.setItem("BranchId", closestBranch?.id)
					: localStorage.setItem("BranchId", 1);
			}
		} else {
			closestBranch !== null
				? localStorage.setItem("BranchId", closestBranch?.id)
				: localStorage.setItem("BranchId", 1);
		}
	}, [userLat, userLng, address, currentBranchId]);

	useEffect(() => {
		fetchAddress();
		fetchBranchData();
	}, [userFromRedux]);

	useEffect(() => {
		if (!userLat && !userLng) {
			toast.warn("Please allow location access for a better shopping experience.", {
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
	}, [userLat, userLng]);

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
