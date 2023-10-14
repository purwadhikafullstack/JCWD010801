import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-loading-skeleton/dist/skeleton.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import NoProduct from "../assets/public/404.png";
import NoDate from "../assets/public/404_calendar.jpeg";
import NoProductThumb from "../assets/public/404_thumb.gif";
import FirstPlace from "../assets/public/key_metrics_assets/1st_place.png";
import SecondPlace from "../assets/public/key_metrics_assets/2nd_place.png";
import ThirdPlace from "../assets/public/key_metrics_assets/3rd_place.png";
import AM1 from "../assets/public/AM_logo_only_trans.png";
import AM2 from "../assets/public/AM_logo_only_trans_180.png";
import React, { useEffect, useState } from "react";
import CategoryBarChart from "../components/stockReport/categoryBarChart";
import BranchBarChart from "../components/stockReport/branchBarChart";
import CategoryDoughnutChart from "../components/stockReport/categoryDoughnutChart";
import BranchDoughnutChart from "../components/stockReport/branchDoughnutChart";
import ActiveProductsBarChart from "../components/stockReport/activeProductsBarChart";
import DeactivatedProductsBarChart from "../components/stockReport/deactivatedProductsBarChart";
import DeletedProductsBarChart from "../components/stockReport/deletedProductsBarChart";
import ViewCountBarChart from "../components/stockReport/viewCountBarChart";
import LikeCountBarChart from "../components/stockReport/likeCountBarChart";
import StatusStackedBarChart from "../components/stockReport/statusStackedBarChart";
import BranchTxStackedBarChart from "../components/stockReport/branchTxStackedBarChart";
import StockMovementLineChart from "../components/stockReport/stockMovementLineChart";
import { debounce } from "lodash";
import { DateRangePicker } from "react-date-range";
import { toast } from "react-toastify";
import {
	Box,
	Flex,
	Image,
	Input,
	Radio,
	Select,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Badge,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../components/navigation/navbarAdmin";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { Pagination } from "../components/navigation/pagination";
import { sidebarEvent } from "../events/sidebarEvent";
import { BiSolidChevronsDown, BiSort } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { PiChartLineDown, PiChartLineUp } from "react-icons/pi";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { AiOutlineShop, AiTwotoneShop } from "react-icons/ai";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { LuPackagePlus, LuPackageMinus, LuPackageX, LuPackageCheck } from "react-icons/lu";
import { IconEyeMinus, IconEyePlus } from "@tabler/icons-react";

const useDelayedReset = (delay) => {
	const [isResetting, setIsResetting] = useState(false);

	const resetWithDelay = () => {
		setIsResetting(true);
		setTimeout(() => {
			setIsResetting(false);
		}, delay);
	};

	return [isResetting, resetWithDelay];
};

const StockReport = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const { username, lastName, gender, RoleId } = useSelector((state) => state?.user?.value);
	const adminBranchId = useSelector((state) => state?.user?.value?.BranchId);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [activeTab, setActiveTab] = useState(0);
	const [branches, setBranches] = useState([]);
	const [reload, setReload] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	//? Stock Movement States
	const [search, setSearch] = useState("");
	const [isSearchEmpty, setIsSearchEmpty] = useState(true);
	const [isDateFound, setIsDateFound] = useState(true);
	const [productDetails, setProductDetails] = useState({});
	const [movementHistory, setMovementHistory] = useState([]);
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("ASC");
	const itemLimits = [5, 10, 15, 20, 25, 50, 100];
	const [itemLimit, setItemLimit] = useState(15);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedBranch, setSelectedBranch] = useState(RoleId !== 3 ? adminBranchId : "");
	const [sortedData, setSortedData] = useState([]);
	const [administrators, setAdministrators] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedEntryTypes, setSelectedEntryTypes] = useState([]);
	const [multipleSelectToggled, setMultipleSelectToggled] = useState(false);
	const [dateRange, setDateRange] = useState([
		{
			startDate: null,
			endDate: null,
			key: "selection",
		},
	]);
	//? Changelogs States
	const [changelogsHistory, setChangelogsHistory] = useState([]);
	//? Stock Levels States
	const [levelsSearch, setLevelsSearch] = useState("");
	const [isLevelSearchEmpty, setIsLevelSearchEmpty] = useState(true);
	const [sortLevelBy, setSortLevelBy] = useState("productName");
	const [levelSortOrder, setLevelSortOrder] = useState("ASC");
	const [levelEntries, setLevelEntries] = useState([]);
	const levelItemLimits = [15, 30, 45, 60, 100];
	const [levelItemLimit, setLevelItemLimit] = useState(30);
	const [branchSortId, setBranchSortId] = useState(null);
	//? Key Metrics States
	const [selectedHighLevelOption, setSelectedHighLevelOption] = useState("");
	const [selectedSubOption, setSelectedSubOption] = useState("clear");
	const [keyMetricsBranch, setKeyMetricsBranch] = useState([]);
	const [keyMetricsTxBranch, setKeyMetricsTxBranch] = useState([]);
	const [keyMetricsTxBranchId, setKeyMetricsTxBranchId] = useState(1);
	const [keyMetricsCategory, setKeyMetricsCategory] = useState([]);
	const [isFilterChanged, setIsFilterChanged] = useState(false);
	const [isResetting, resetWithDelay] = useDelayedReset(2200);

	const handleHighLevelOptionChange = (e) => {
		const highLevelOption = e.target.value;
		setSelectedHighLevelOption(highLevelOption);
		setSelectedSubOption("clear");
	};

	const handleSubOptionChange = (e) => {
		const subOption = e.target.value;
		setIsFilterChanged(true);
		setSelectedSubOption(subOption);
		if (
			selectedHighLevelOption === "branch" &&
			subOption !== "clear" &&
			subOption !== "" &&
			subOption > 0 &&
			subOption < 6
		) {
			setKeyMetricsTxBranchId(subOption);
		}
		resetWithDelay();
	};

	useEffect(() => {
		if (isResetting) {
			setIsFilterChanged(false);
		}
	}, [isResetting]);

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear().toString().substring(2);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${day} ${month} ${year} ${hours}:${minutes}`;
	};

	const entryTypeOptions = [
		"Product Created",
		"Branch Stock Initialization",
		"Manual Adjustment",
		"Order Cancellation",
		"Customer Order",
		"Clear Selections (All Entries)",
	];

	const toggleEntryType = (entryType) => {
		setPage(1);
		if (entryType === "Clear Selections (All Entries)") {
			setSelectedEntryTypes([]);
			setMultipleSelectToggled(false);
		} else {
			if (selectedEntryTypes.includes(entryType)) {
				setMultipleSelectToggled(true);
				setItemLimit(100);
				setSelectedEntryTypes((prev) => prev.filter((selected) => selected !== entryType));
			} else {
				setMultipleSelectToggled(true);
				setItemLimit(100);
				setSelectedEntryTypes((prev) => [...prev, entryType]);
			}
		}
	};

	useEffect(() => {
		if (selectedEntryTypes.length === 0) {
			setMultipleSelectToggled(false);
			setItemLimit(15);
		}
		if (activeTab !== 1) {
			setMultipleSelectToggled(false);
			setItemLimit(15);
		}
	}, [selectedEntryTypes, activeTab]);

	useEffect(() => {
		if (activeTab === 1 && selectedEntryTypes.length > 0) {
			setMultipleSelectToggled(true);
			setItemLimit(100);
		}
	}, [selectedEntryTypes, activeTab]);

	let user = "";
	if (gender !== null) {
		if (gender === "Male") {
			user = `Mr. ${lastName}`;
		} else {
			user = `Ms. ${lastName}`;
		}
	} else {
		user = username;
	}

	const interval = 15000;
	useEffect(() => {
		const checkAuth = () => {
			if (!RoleId || RoleId < 2 || !token) {
				navigate("/404");
			}
		};
		checkAuth();
		const intervalId = setInterval(checkAuth, interval);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line
	}, [RoleId]);

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/infoadmins`)
			.then((response) => {
				setAdministrators(response.data.admins);
			})
			.catch((error) => {
				console.error("Error fetching random product info:", error);
			});
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/infousers`)
			.then((response) => {
				setUsers(response.data.users);
			})
			.catch((error) => {
				console.error("Error fetching users info:", error);
			});
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/branch/?limit=5`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				const branchData = response.data.result.map((data) => ({
					label: data.name,
					value: data.id,
				}));
				setBranches(branchData);
			})
			.catch((error) => {
				console.error("Error fetching branches info:", error);
			});
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/admin?limit=50`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				const categoryData = response.data.result.map((data) => ({
					label: data.category,
					value: data.id,
				}));
				setCategories(categoryData);
			})
			.catch((error) => {
				console.error("Error fetching categories info:", error);
			});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/random`)
			.then((response) => {
				setSearch(response.data.productName);
				setPage(1);
			})
			.catch((error) => {
				console.error("Error fetching random product info:", error);
			});
	}, [activeTab]);

	const currentBranchInfo = branches.find((branch) => branch.value === adminBranchId);
	const currentBranchName = currentBranchInfo?.label;

	useEffect(() => {
		const handleSidebarSizeChange = (newSize) => {
			setMarginStyles((prevState) => {
				const newMarginLeftMainContainer = newSize === "small" ? "100px" : "168px";
				const newMarginLeftHeading = newSize === "small" ? "10px" : "13px";
				const newMarginLeftDescription = newSize === "small" ? "12px" : "15px";
				const newContentContainerWidth = newSize === "small" ? "1325px" : "1250px";
				const newSecondaryContainerWidth = newSize === "small" ? "1300px" : "1225px";
				const newProductOverviewWidth = newSize === "small" ? "1298px" : "1224px";
				const newSkeletonWidth = newSize === "small" ? "1293px" : "1220px";

				return {
					...prevState,
					marginLeftMainContainer: newMarginLeftMainContainer,
					marginLeftHeading: newMarginLeftHeading,
					marginLeftDescription: newMarginLeftDescription,
					contentContainerWidth: newContentContainerWidth,
					secondaryContainerWidth: newSecondaryContainerWidth,
					productOverviewWidth: newProductOverviewWidth,
					skeletonWidth: newSkeletonWidth,
				};
			});
		};

		sidebarEvent.on("sidebarSizeChange", handleSidebarSizeChange);

		return () => {
			sidebarEvent.off("sidebarSizeChange", handleSidebarSizeChange);
		};
	}, []);

	useEffect(() => {
		if (activeTab === 0) {
			fetchStockLevelsData(page);
		}
		// eslint-disable-next-line
	}, [levelsSearch, reload, levelItemLimit, sortLevelBy, levelSortOrder, branchSortId, activeTab]);

	useEffect(() => {
		if (activeTab === 1) {
			fetchMovementData(page);
		}
		// eslint-disable-next-line
	}, [search, reload, dateRange, selectedEntryTypes, itemLimit, selectedBranch, sortBy, sortOrder]);

	useEffect(() => {
		if (activeTab === 2) {
			fetchChangelogsData(page);
		}
		// eslint-disable-next-line
	}, [search, reload, dateRange, itemLimit, selectedBranch, sortBy, sortOrder]);

	useEffect(() => {
		if (activeTab === 3) {
			fetchBranchKeyMetricsData();
			fetchCategoriesKeyMetricsData();
		}
		// eslint-disable-next-line
	}, [reload, selectedHighLevelOption, selectedSubOption]);

	const fetchStockLevelsData = async (pageNum) => {
		try {
			setIsLoading(true);
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product-report/levels/?search=${levelsSearch}&page=${pageNum}&sortBy=${sortLevelBy}&sortOrder=${levelSortOrder}`;

			if (selectedCategory) {
				apiURL += `&CategoryId=${selectedCategory}`;
			}
			if (branchSortId) {
				apiURL += `&BranchId=${branchSortId}`;
			}
			if (levelItemLimit) {
				apiURL += `&itemLimit=${levelItemLimit}`;
			}

			const levelsResponse = await Axios.get(apiURL);
			const { result, currentPage, totalPages } = levelsResponse.data;
			setLevelEntries(result);
			setPage(currentPage);
			setTotalPages(totalPages);
			setIsLevelSearchEmpty(false);

			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		} catch (error) {
			setIsLevelSearchEmpty(true);
			toast.warn(`No matches found for "${levelsSearch}"`, {
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

	const fetchMovementData = async (pageNum) => {
		try {
			setIsLoading(true);
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product-report/?productName=${search}&page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
			const { startDate, endDate } = dateRange[0];
			if (startDate && endDate) {
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(23, 59, 59, 999);
				const formattedStartDate = startDate.toISOString();
				const formattedEndDate = endDate.toISOString();
				apiURL += `&startDate=${formattedStartDate}`;
				apiURL += `&endDate=${formattedEndDate}`;
			}

			if (selectedBranch) {
				apiURL += `&BranchId=${selectedBranch}`;
			}
			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}
			const movementResponse = await Axios.get(apiURL);
			const { product_details, movement_history: movementHistory, currentPage, totalPages } = movementResponse.data;
			if (startDate && endDate && startDate !== endDate && movementHistory.length === 0) {
				setIsDateFound(false);
				const adjustedStartDate = new Date(startDate);
				adjustedStartDate.setHours(adjustedStartDate.getHours() + 7);
				toast.warn(
					`No entry found for the range ${adjustedStartDate.toISOString().split("T")[0]} to ${
						endDate.toISOString().split("T")[0]
					}. Please broaden your date query range.`,
					{
						position: "top-right",
						autoClose: 4000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "dark",
					}
				);
				return;
			}
			setPage(currentPage);
			setTotalPages(totalPages);
			setProductDetails(product_details);
			setMovementHistory(movementHistory);
			setIsDateFound(true);
			setIsSearchEmpty(false);
			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		} catch (error) {
			setIsSearchEmpty(true);
			if (search !== "") {
				toast.warn(`No product found for "${search}"`, {
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
		}
	};

	const fetchChangelogsData = async (pageNum) => {
		try {
			setIsLoading(true);
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product-report/changelogs/?productName=${search}&page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
			const { startDate, endDate } = dateRange[0];
			if (startDate && endDate) {
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(23, 59, 59, 999);
				const formattedStartDate = startDate.toISOString();
				const formattedEndDate = endDate.toISOString();
				apiURL += `&startDate=${formattedStartDate}`;
				apiURL += `&endDate=${formattedEndDate}`;
			}

			if (selectedBranch) {
				apiURL += `&BranchId=${selectedBranch}`;
			}
			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}
			const changelogsResponse = await Axios.get(apiURL);
			const { product_details, changelogs, currentPage, totalPages } = changelogsResponse.data;
			if (startDate && endDate && startDate !== endDate && changelogs.length === 0) {
				setIsDateFound(false);
				const adjustedStartDate = new Date(startDate);
				adjustedStartDate.setHours(adjustedStartDate.getHours() + 7);
				toast.warn(
					`No entry found for the range ${adjustedStartDate.toISOString().split("T")[0]} to ${
						endDate.toISOString().split("T")[0]
					}. Please broaden your date query range.`,
					{
						position: "top-right",
						autoClose: 4000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "dark",
					}
				);
				return;
			}
			setPage(currentPage);
			setTotalPages(totalPages);
			setProductDetails(product_details);
			setChangelogsHistory(changelogs);
			setIsDateFound(true);
			setIsSearchEmpty(false);
			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		} catch (error) {
			setIsSearchEmpty(true);
			if (search !== "") {
				toast.warn(`No product found for "${search}"`, {
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
		}
	};

	const fetchBranchKeyMetricsData = async () => {
		try {
			const baseMetrics = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product-report/branches/mostandleast`);
			setKeyMetricsBranch(baseMetrics.data.result);

			const txMetrics = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/branches/bestandworst/${keyMetricsTxBranchId}`
			);
			setKeyMetricsTxBranch(txMetrics.data);
		} catch (error) {
			console.log("Error fetching branch key metrics data", error);
		}
	};

	const fetchCategoriesKeyMetricsData = async () => {
		try {
			const baseMetrics = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product-report/categories/mostandleast`
			);
			setKeyMetricsCategory(baseMetrics.data.result);
		} catch (error) {
			console.log("Error fetching categories key metrics data", error);
		}
	};

	const handleSearchChange = (e) => {
		const query = e.target.value;
		handleSearchDebounced(query);
	};

	const handleSearchDebounced = debounce((query) => {
		setSearch(query);
		setPage(1);
	}, 2000);

	const handleLevelsSearchChange = (e) => {
		const query = e.target.value;
		handleLevelsSearchDebounced(query);
	};

	const handleLevelsSearchDebounced = debounce((query) => {
		setLevelsSearch(query);
		setPage(1);
	}, 2000);

	const findAdminNameById = (UID) => {
		const admin = administrators.find((admin) => admin.id === UID);
		const user = users.find((user) => user.id === UID);
		return admin ? admin.username : user ? `${user.username}(Customer)` : "Unknown";
	};

	const findBranchNameById = (BID) => {
		const branch = branches.find((branch) => branch.value === BID);
		return branch ? branch.label : "Unknown";
	};

	const renderLevelsEntries = (isLoading) => {
		if (isLoading) {
			return levelEntries.map((item, index) => {
				const isEvenIndex = index % 2 === 0;
				return (
					<Tr key={item.id}>
						<Td>
							<div
								style={{
									width: "10px",
									marginLeft: "-13px",
								}}
							>
								<Skeleton
									count={1}
									width={"1310px"}
									containerClassName="flex-1"
									height={"32px"}
									highlightColor="#141415"
									direction={isEvenIndex ? "rtl" : "ltr"}
								/>
							</div>
						</Td>
					</Tr>
				);
			});
		} else {
			return levelEntries.map((item, index) => {
				return (
					<Tr key={item.id}>
						<Td textAlign={"center"}>{index + 1}</Td>
						<Td textAlign={"left"}>{item.productName}</Td>
						<Td textAlign={"center"}>{item.aggregateStock} units</Td>
						<Td textAlign={"center"}>{getCategoryLabel(item.CategoryId)}</Td>
						<Td textAlign={"center"}>
							{item.Stocks.find((stock) => stock.BranchId === 1)
								? item.Stocks.find((stock) => stock.BranchId === 1).currentStock
								: 0}
							‎ Units
						</Td>
						<Td textAlign={"center"}>
							{item.Stocks.find((stock) => stock.BranchId === 2)
								? item.Stocks.find((stock) => stock.BranchId === 2).currentStock
								: 0}
							‎ Units
						</Td>
						<Td textAlign={"center"}>
							{item.Stocks.find((stock) => stock.BranchId === 3)
								? item.Stocks.find((stock) => stock.BranchId === 3).currentStock
								: 0}
							‎ Units
						</Td>
						<Td textAlign={"center"}>
							{item.Stocks.find((stock) => stock.BranchId === 4)
								? item.Stocks.find((stock) => stock.BranchId === 4).currentStock
								: 0}
							‎ Units
						</Td>
						<Td textAlign={"center"}>
							{item.Stocks.find((stock) => stock.BranchId === 5)
								? item.Stocks.find((stock) => stock.BranchId === 5).currentStock
								: 0}
							‎ Units
						</Td>
						<Td className="centered-td">
							{item.StockMovements.txCount !== 0 ? (
								<div className="centered-content">
									<Flex>
										<Text mr={"3px"}>{item.StockMovements.txCount}</Text> <LuPackagePlus size={20} color="green" />
									</Flex>
								</div>
							) : (
								<div className="centered-content">
									<Flex>
										<Text mr={"3px"}>{item.StockMovements.txCount}</Text> <LuPackageMinus size={20} color="#D11010" />
									</Flex>
								</div>
							)}
						</Td>
						<Td className="centered-td">
							{item.StockMovements.failedTxCount !== 0 ? (
								<div className="centered-content">
									<Flex>
										<Text mr={"3px"}>{item.StockMovements.failedTxCount}</Text> <LuPackageX size={20} color="#D11010" />
									</Flex>
								</div>
							) : (
								<div className="centered-content">
									<Flex>
										<Text mr={"3px"}>{item.StockMovements.failedTxCount}</Text>{" "}
										<LuPackageCheck size={20} color="green" />
									</Flex>
								</div>
							)}
						</Td>
						<Td className="centered-td">
							{item.viewCount !== 0 ? (
								<div className="centered-content">
									<Flex>
										<Text mr={"3px"}>{item.viewCount}</Text> <ImEye size={18} color="#DA9100" />
									</Flex>
								</div>
							) : (
								<div className="centered-content">
									<Flex>
										<Text mr={"3px"}>{item.viewCount}</Text> <ImEyeBlocked size={18} color="#D11010" />
									</Flex>
								</div>
							)}
						</Td>
					</Tr>
				);
			});
		}
	};

	const renderTableEntries = (data, isLoading) => {
		const filteredData =
			selectedEntryTypes.length === 0
				? data
				: data.filter((item) =>
						selectedEntryTypes.includes(
							item.isInitialization
								? "Product Created"
								: item.isBranchInitialization
								? "Branch Stock Initialization"
								: item.isAdjustment
								? "Manual Adjustment"
								: item.isAddition && !item.isInitialization && !item.isBranchInitialization && !item.isAdjustment
								? "Order Cancellation"
								: "Customer Order"
						)
				  );

		if (isLoading) {
			return filteredData.map((item, index) => {
				const isEvenIndex = index % 2 === 0;
				return (
					<Tr key={item.id}>
						<Td>
							<div
								style={{
									width: "10px",
									marginLeft: "-13px",
								}}
							>
								<Skeleton
									count={1}
									width={marginStyles.skeletonWidth}
									containerClassName="flex-1"
									height={"32px"}
									highlightColor="#141415"
									direction={isEvenIndex ? "rtl" : "ltr"}
								/>
							</div>
						</Td>
					</Tr>
				);
			});
		} else {
			if (filteredData.length === 0) {
				return (
					<Tr>
						<Td textAlign={"center"}>-</Td>
						<Td textAlign={"left"}>Entry Not Found</Td>
						<Td textAlign={"center"}>Please Refine</Td>
						<Td textAlign={"center"}>Your Search Filters</Td>
						<Td textAlign={"center"}>-</Td>
						<Td textAlign={"center"}>-</Td>
						<Td textAlign={"center"}>-</Td>
						<Td textAlign={"center"}>-</Td>
						<Td textAlign={"center"}>-</Td>
					</Tr>
				);
			}

			return filteredData.map((item, index) => {
				const createdAtDate = new Date(item.createdAt);
				const formattedDate = `${createdAtDate.getDate()} ${months[createdAtDate.getMonth()]} ${createdAtDate
					.getFullYear()
					.toString()
					.slice(-2)}`;
				const formattedTime = `${createdAtDate.getHours().toString().padStart(2, "0")}:${createdAtDate
					.getMinutes()
					.toString()
					.padStart(2, "0")}:${createdAtDate.getSeconds().toString().padStart(2, "0")}`;

				return (
					<Tr key={item.id}>
						<Td textAlign={"center"}>{index + 1}</Td>
						<Td textAlign={"left"}>
							{item.isInitialization
								? "Product Created"
								: item.isBranchInitialization
								? "Branch Stock Initialization"
								: item.isAdjustment
								? "Manual Adjustment"
								: item.isAddition && !item.isInitialization && !item.isBranchInitialization && !item.isAdjustment
								? "Order Cancellation"
								: "Customer Order"}
						</Td>
						<Td textAlign={"center"}>{item.oldValue} units</Td>
						<Td textAlign={"center"}>{item.change} units</Td>
						<Td textAlign={"center"}>{item.newValue} units</Td>
						<Td textAlign={"center"}>
							{findBranchNameById(item.BranchId) === "Jakarta" ? (
								<Badge background={"#E25668"} color={"white"} variant={"outline"}>
									Jakarta
								</Badge>
							) : findBranchNameById(item.BranchId) === "Bandung" ? (
								<Badge background={"#E28956"} color={"white"} variant={"outline"}>
									Bandung
								</Badge>
							) : findBranchNameById(item.BranchId) === "Jogjakarta" ? (
								<Badge background={"#68E256"} color={"white"} variant={"outline"}>
									Jogjakarta
								</Badge>
							) : findBranchNameById(item.BranchId) === "Surabaya" ? (
								<Badge background={"#56E2CF"} color={"white"} variant={"outline"}>
									Surabaya
								</Badge>
							) : (
								<Badge background={"#5668E2"} color={"white"} variant={"outline"}>
									Batam
								</Badge>
							)}
						</Td>
						<Td textAlign={"center"}>{findAdminNameById(item.UserId)}</Td>
						<Td textAlign={"center"}>{formattedDate}</Td>
						<Td textAlign={"center"}>{formattedTime}</Td>
					</Tr>
				);
			});
		}
	};

	const renderChangelogsTableEntries = (isLoading) => {
		if (isLoading) {
			return changelogsHistory.map((item, index) => {
				const isEvenIndex = index % 2 === 0;
				return (
					<Tr key={item.id}>
						<Td>
							<div
								style={{
									width: "10px",
									marginLeft: "-13px",
								}}
							>
								<Skeleton
									count={1}
									width={marginStyles.skeletonWidth}
									containerClassName="flex-1"
									height={"32px"}
									highlightColor="#141415"
									direction={isEvenIndex ? "rtl" : "ltr"}
								/>
							</div>
						</Td>
					</Tr>
				);
			});
		} else {
			return changelogsHistory.map((item, index) => {
				const createdAtDate = new Date(item.createdAt);
				const formattedDate = `${createdAtDate.getDate()} ${months[createdAtDate.getMonth()]} ${createdAtDate
					.getFullYear()
					.toString()
					.slice(-2)}`;
				const formattedTime = `${createdAtDate.getHours().toString().padStart(2, "0")}:${createdAtDate
					.getMinutes()
					.toString()
					.padStart(2, "0")}:${createdAtDate.getSeconds().toString().padStart(2, "0")}`;
				const startsWith = (str, prefix) => {
					return str.indexOf(prefix) === 0;
				};

				return (
					<Tr key={item.id}>
						<Td textAlign={"center"}>{index + 1}</Td>
						<Td textAlign={"left"}>
							{item.field === "productName"
								? "Product Name Change"
								: item.field === "price"
								? "Price Change"
								: item.field === "description"
								? "Description Change"
								: item.field === "weight"
								? "Weight Change"
								: item.field === "CategoryId"
								? "Category Change"
								: item.field === "imgURL"
								? "Image Change"
								: item.field === "activation"
								? "Product Activation"
								: item.field === "deactivation"
								? "Product Deactivation"
								: item.field === "deletion"
								? "Product Deletion"
								: item.field === "bulk_activation"
								? "Bulk Operation: Product Activation"
								: item.field === "bulk_deactivation"
								? "Bulk Operation: Product Deactivation"
								: item.field === "bulk_deletion"
								? "Bulk Operation: Product Deletion"
								: "Bulk Operation: Product Category Change"}
						</Td>
						<Td className="centered-td" textAlign={"center"}>
							<div className="centered-content">
								{item.oldValue === "initialization" ? (
									"Initialization Entry"
								) : item.oldValue === "active" ? (
									"Active"
								) : item.oldValue === "deactivated" ? (
									"Deactivated"
								) : item.oldValue === "not_deleted" ? (
									"Not Deleted"
								) : item.oldValue === "data_not_available" ? (
									"Old Category Not Recorded"
								) : startsWith(item.oldValue, "P-IMG") ? (
									<Image
										className="thumb-hover-zoom"
										boxSize={"21px"}
										borderRadius={"5px"}
										boxShadow={"1px 2px 3px black"}
										src={`${process.env.REACT_APP_BASE_URL}/products/${item.oldValue}`}
										cursor={"pointer"}
									/>
								) : item.field === "price" ? (
									`Rp. ${parseInt(item?.oldValue).toLocaleString("id-ID")}`
								) : item.field === "weight" ? (
									`${Number(parseInt(item?.oldValue) / 1000).toFixed(3)} Kg`
								) : item.field === "CategoryId" ? (
									getCategoryLabel(item?.oldValue)
								) : item.oldValue.length > 25 ? (
									`${item.oldValue.slice(0, 25)}...`
								) : (
									item.oldValue
								)}
							</div>
						</Td>
						<Td className="centered-td" textAlign={"center"}>
							<div className="centered-content">
								{item.newValue === "initialization" ? (
									"Initialization Entry"
								) : item.newValue === "active" ? (
									"Active"
								) : item.newValue === "deactivated" ? (
									"Deactivated"
								) : item.newValue === "deleted" ? (
									"Permanently Deleted"
								) : item.newValue === "data_not_available" ? (
									"Old Category Not Recorded"
								) : startsWith(item.newValue, "P-IMG") ? (
									<Image
										className="thumb-hover-zoom"
										boxSize={"21px"}
										borderRadius={"5px"}
										boxShadow={"1px 2px 3px black"}
										src={`${process.env.REACT_APP_BASE_URL}/products/${item.newValue}`}
										cursor={"pointer"}
									/>
								) : item.field === "price" ? (
									`Rp. ${parseInt(item?.newValue).toLocaleString("id-ID")}`
								) : item.field === "weight" ? (
									`${Number(parseInt(item?.newValue) / 1000).toFixed(3)} Kg`
								) : item.field === "CategoryId" ? (
									getCategoryLabel(item?.newValue)
								) : item.newValue.length > 25 ? (
									`${item.newValue.slice(0, 25)}...`
								) : (
									item.newValue
								)}
							</div>
						</Td>
						<Td textAlign={"center"}>{findAdminNameById(item.UserId)}</Td>
						<Td textAlign={"center"}>{formattedDate}</Td>
						<Td textAlign={"center"}>{formattedTime}</Td>
					</Tr>
				);
			});
		}
	};

	const updateSortedData = () => {
		const sorted = [...movementHistory];
		sorted.sort((a, b) => {
			switch (sortBy) {
				case "UserId":
					return sortOrder === "ASC" ? a.UserId - b.UserId : b.UserId - a.UserId;
				case "BranchId":
					return sortOrder === "ASC" ? a.BranchId - b.BranchId : b.BranchId - a.BranchId;
				case "change":
					return sortOrder === "ASC" ? a.change - b.change : b.change - a.change;
				default:
					return sortOrder === "ASC"
						? new Date(a.createdAt) - new Date(b.createdAt)
						: new Date(b.createdAt) - new Date(a.createdAt);
			}
		});
		setSortedData(sorted);
		setReload(true);
	};

	useEffect(() => {
		updateSortedData();
		// eslint-disable-next-line
	}, [movementHistory, sortBy, sortOrder]);

	const getCategoryLabel = (catId) => {
		const category = categories.find((category) => category.value === parseInt(catId));
		return category ? category.label : "Category Missing!";
	};

	const getBranchLabel = (branchId) => {
		const branch = branches.find((branch) => branch.value === parseInt(branchId));
		return branch ? branch.label : "Branch Missing!";
	};

	const nextPage = () => {
		if (page < totalPages) {
			setPage((prevPage) => +prevPage + 1);
			setReload(!reload);
		}
	};

	const prevPage = () => {
		if (page > 1) {
			setPage((prevPage) => +prevPage - 1);
			setReload(!reload);
		}
	};

	const goToPage = (page) => {
		setPage(page);
		setReload(!reload);
	};

	const [marginStyles, setMarginStyles] = useState({
		marginLeftMainContainer: "168px",
		marginLeftHeading: "13px",
		marginLeftDescription: "15px",
		contentContainerWidth: "1250px",
		secondaryContainerWidth: "1225px",
		productOverviewWidth: "1224px",
		skeletonWidth: "1220px",
	});

	const customInputStyle = {
		borderColor: "gray",
		_focus: {
			boxShadow: "0 0 3px 2px #39393C",
			borderColor: "#39393C",
		},
		_placeholder: {
			color: "#535256",
			fontSize: "14px",
		},
		color: "#535256",
	};

	const customRadioStyle = {
		borderColor: "gray",
		_checked: {
			boxShadow: "0 0 3px 2px #39393C",
			bg: "transparent",
			color: "gray.700",
			borderColor: "gray.700",
			_before: {
				content: '""',
				display: "block",
				width: "50%",
				height: "50%",
				borderRadius: "50%",
				bg: "#4A4A4A",
			},
		},
		_focus: {
			boxShadow: "0 0 3px 2px #39393C",
		},
	};

	const customSelectStyle = {
		borderColor: "gray",
		_focus: {
			boxShadow: "0 0 3px 2px #39393C",
			borderColor: "#39393C",
		},
		_placeholder: {
			color: "#000000",
			fontSize: "14px",
			align: "center",
		},
		color: "#000000",
		bgColor: "#FFFFFF",
		_option: {
			_hover: {
				boxShadow: "0 0 10px 100px #000000 inset",
			},
		},
	};

	return (
		<Box w={"100%"} h={"100%"} align={"center"} justify={"center"}>
			<AdminSidebar navSizeProp="large" navPosProp="fixed" />
			<NavbarAdmin />
			<Box className="transition-element" ml={marginStyles.marginLeftMainContainer} h={"200vh"}>
				<Flex h={"100px"} alignItems={"center"} justifyContent={"space-between"}>
					<Text
						className="pm-h"
						textAlign={"left"}
						h={"50px"}
						w={"700px"}
						alignSelf={"center"}
						ml={marginStyles.marginLeftHeading}
					>
						STOCK ANALYTICS
					</Text>
				</Flex>
				<Flex h={"25px"}>
					<Text
						className="pm-d"
						textAlign={"left"}
						h={"25px"}
						w={"700px"}
						alignSelf={"center"}
						ml={marginStyles.marginLeftDescription}
					>
						Welcome {user}.
					</Text>
				</Flex>
				<Flex h={"25px"}>
					<Text
						className="pm-d"
						textAlign={"left"}
						h={"25px"}
						w={"700px"}
						alignSelf={"center"}
						ml={marginStyles.marginLeftDescription}
					>
						AlphaMart {currentBranchName} Branch
					</Text>
				</Flex>
				<Box
					className="transition-element"
					w={marginStyles.contentContainerWidth}
					h={"160vh"}
					m={"5px"}
					py={"5px"}
					border={"1px solid #39393C"}
					borderRadius={"10px"}
					position={"relative"}
				>
					<Tabs
						className="transition-element"
						w={marginStyles.secondaryContainerWidth}
						align="left"
						value={activeTab}
						onChange={(index) => {
							setActiveTab(index);
							setSortBy("createdAt");
							setSortOrder("ASC");
							setSortLevelBy("productName");
							setLevelSortOrder("ASC");
							setPage(1);
							setSelectedBranch(RoleId !== 3 ? adminBranchId : "");
							setSelectedCategory("");
							setSearch("");
							setLevelsSearch("");
							setSelectedEntryTypes([]);
							setDateRange([
								{
									startDate: null,
									endDate: null,
									key: "selection",
								},
							]);
							setSelectedHighLevelOption("");
							setSelectedSubOption("clear");
						}}
					>
						<TabList>
							<Tab
								width="14%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 0 ? "#2E8B57" : "white",
									bgColor: activeTab === 0 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Stock Levels
							</Tab>
							<Tab
								width="14%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 1 ? "#2E8B57" : "white",
									bgColor: activeTab === 1 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Stock Movements
							</Tab>
							<Tab
								width="14%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 2 ? "#2E8B57" : "white",
									bgColor: activeTab === 2 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Changelogs
							</Tab>
							<Tab
								width="14%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 3 ? "#2E8B57" : "white",
									bgColor: activeTab === 3 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Key Metrics
							</Tab>
							<Tab
								width="14%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 4 ? "#2E8B57" : "white",
									bgColor: activeTab === 4 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Statistics
							</Tab>
						</TabList>
						{/* //! Stock Levels Tab */}
						{activeTab === 0 ? (
							<Flex
								className="transition-element"
								w={marginStyles.secondaryContainerWidth}
								h={"45px"}
								align={"center"}
								justify="space-between"
								fontWeight="bold"
								mb={"2px"}
								borderBottom={"1px solid #39393C"}
							>
								<Flex w={"240px"} h={"45px"} align="center" fontWeight="bold">
									<Input
										type="search"
										defaultValue={levelsSearch}
										mr={"5px"}
										w={"200px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										placeholder="Enter a Product Name"
										{...customInputStyle}
										onChange={handleLevelsSearchChange}
									/>
									<FaSearch
										size={20}
										onClick={() => {
											setPage(1);
											setReload(!reload);
										}}
										style={{ cursor: "pointer" }}
									/>
								</Flex>
								<Flex w={"280px"} h={"45px"} justify="left" align={"center"} fontWeight="bold" ml={"5px"}>
									<Select
										fontSize={"13px"}
										placeholder="All Categories"
										value={selectedCategory.toString()}
										onChange={(e) => {
											const selectedValue = parseInt(e.target.value, 10);
											setSelectedCategory(isNaN(selectedValue) ? "" : selectedValue);
											setPage(1);
											setReload(!reload);
										}}
										w={"130px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
										mr={"5px"}
									>
										{categories.map((category) => (
											<option
												key={category.value}
												value={category.value.toString()}
												style={{
													backgroundColor: selectedCategory === category.value ? "#F0F0F0" : "#FFFFFF",
													color: selectedCategory === category.value ? "#18181A" : "#535256",
													fontWeight: selectedCategory === category.value ? "bold" : "normal",
													fontSize: "13px",
													cursor: "pointer",
												}}
											>
												{category.label}
											</option>
										))}
									</Select>
									<Select
										placeholder="Select Number of IPP"
										value={levelItemLimit}
										onChange={(e) => {
											setLevelItemLimit(parseInt(e.target.value));
											setPage(1);
											setReload(!reload);
										}}
										w={"150px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
										fontSize={"13px"}
										ml={"2px"}
										isDisabled={multipleSelectToggled}
									>
										{levelItemLimits.map((limit) => (
											<option
												key={limit}
												value={limit}
												style={{
													backgroundColor: itemLimit === limit ? "#F0F0F0" : "#FFFFFF",
													color: itemLimit === limit ? "#18181A" : "#535256",
													fontWeight: itemLimit === limit ? "bold" : "normal",
													fontSize: "14px",
													cursor: "pointer",
												}}
											>
												{limit} Items Per Page
											</option>
										))}
									</Select>
								</Flex>
								<Flex
									w={"625px"}
									h={"31px"}
									justify="space-evenly"
									align="center"
									fontWeight="bold"
									ml={"2px"}
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "productName"}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("productName");
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>Alphabetical</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "aggregateStock"}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("aggregateStock");
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>Nationwide</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "branchStock" && branchSortId === 1}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("branchStock");
											setBranchSortId(1);
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>JKT</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "branchStock" && branchSortId === 2}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("branchStock");
											setBranchSortId(2);
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>BDG</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "branchStock" && branchSortId === 3}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("branchStock");
											setBranchSortId(3);
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>YGY</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "branchStock" && branchSortId === 4}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("branchStock");
											setBranchSortId(4);
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>SBY</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "branchStock" && branchSortId === 5}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("branchStock");
											setBranchSortId(5);
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>BTM</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "txCount"}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("txCount");
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>#TX</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "failedTxCount"}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("failedTxCount");
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>#Failed</Text>
									</Radio>
									<Radio
										size="sm"
										isChecked={sortLevelBy === "viewCount"}
										borderColor={"gray"}
										onChange={() => {
											setSortLevelBy("viewCount");
											setPage(1);
										}}
										{...customRadioStyle}
									>
										<Text ml={"-6px"}>Views</Text>
									</Radio>
								</Flex>
								<Flex
									justifyContent={"space-around"}
									w={"122px"}
									h={"31px"}
									ml={"2px"}
									justify="center"
									align="center"
									fontWeight="bold"
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									{sortLevelBy === "productName" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<AiOutlineSortAscending size={30} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<AiOutlineSortDescending size={30} />
											</Radio>
										</>
									)}
									{sortLevelBy === "aggregateStock" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortLevelBy === "branchStock" && branchSortId === 1 && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortLevelBy === "branchStock" && branchSortId === 2 && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortLevelBy === "branchStock" && branchSortId === 3 && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortLevelBy === "branchStock" && branchSortId === 4 && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortLevelBy === "branchStock" && branchSortId === 5 && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortLevelBy === "txCount" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<LuPackageMinus size={23} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<LuPackagePlus size={23} />
											</Radio>
										</>
									)}
									{sortLevelBy === "failedTxCount" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<LuPackageCheck size={23} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<LuPackageX size={23} />
											</Radio>
										</>
									)}
									{sortLevelBy === "viewCount" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "ASC"}
												onChange={() => {
													setLevelSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<IconEyeMinus size={23} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={levelSortOrder === "DESC"}
												onChange={() => {
													setLevelSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<IconEyePlus size={23} />
											</Radio>
										</>
									)}
								</Flex>
							</Flex>
						) : activeTab === 1 ? (
							<Flex
								className="transition-element"
								w={marginStyles.secondaryContainerWidth}
								h={"45px"}
								align="center"
								justify={"space-between"}
								fontWeight="bold"
								mb={"2px"}
								borderBottom={"1px solid #39393C"}
							>
								{/* //! Stock Movements Tab */}
								<Flex w={"240px"} h={"45px"} align="center" fontWeight="bold">
									<Input
										type={"search"}
										defaultValue={search}
										mr={"5px"}
										w={"200px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										placeholder="Enter a Product Name"
										{...customInputStyle}
										onChange={handleSearchChange}
									/>
									<FaSearch
										size={20}
										onClick={() => {
											setReload(!reload);
										}}
										style={{ cursor: "pointer" }}
									/>
								</Flex>
								<Flex
									w={"530px"}
									h={"45px"}
									justify="left"
									align={"center"}
									fontWeight="bold"
									justifyContent={"space-evenly"}
								>
									<Select
										placeholder="All Branches"
										value={selectedBranch.toString()}
										onChange={(e) => {
											const selectedValue = parseInt(e.target.value, 10);
											setSelectedBranch(isNaN(selectedValue) ? "" : selectedValue);
											setPage(1);
											setReload(!reload);
										}}
										w={"150px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
									>
										{branches.map((branch) => (
											<option
												key={branch.value}
												value={branch.value.toString()}
												style={{
													backgroundColor: selectedBranch === branch.value ? "#F0F0F0" : "#FFFFFF",
													color: selectedBranch === branch.value ? "#18181A" : "#535256",
													fontWeight: selectedBranch === branch.value ? "bold" : "normal",
													fontSize: "16px",
													cursor: "pointer",
												}}
											>
												{branch.label}
											</option>
										))}
									</Select>
									<Select
										placeholder="Select Number of IPP"
										value={itemLimit}
										onChange={(e) => {
											setItemLimit(parseInt(e.target.value));
											setPage(1);
											setReload(!reload);
										}}
										w={"155px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
										fontSize={"13px"}
										isDisabled={multipleSelectToggled}
									>
										{itemLimits.map((limit) => (
											<option
												key={limit}
												value={limit}
												style={{
													backgroundColor: itemLimit === limit ? "#F0F0F0" : "#FFFFFF",
													color: itemLimit === limit ? "#18181A" : "#535256",
													fontWeight: itemLimit === limit ? "bold" : "normal",
													fontSize: "14px",
													cursor: "pointer",
												}}
											>
												{limit} Items Per Page
											</option>
										))}
									</Select>
									<Menu>
										<MenuButton
											as={Button}
											w="190px"
											h="30px"
											border={"1px solid gray"}
											borderColor="gray"
											bgColor="white"
											fontWeight={selectedEntryTypes.length < 2 ? "normal" : "semibold"}
											fontSize={
												selectedEntryTypes.includes(entryTypeOptions[1]) && selectedEntryTypes.length === 1
													? "12px"
													: "16px"
											}
											rightIcon={<BiSolidChevronsDown size={18} />}
											overflow={"hidden"}
											textOverflow={"ellipsis"}
										>
											{selectedEntryTypes.length === 0
												? "Select Entry Types"
												: selectedEntryTypes.length === 1
												? selectedEntryTypes[0]
												: selectedEntryTypes.length === 2
												? "2 Selected"
												: selectedEntryTypes.length === 3
												? "3 Selected"
												: selectedEntryTypes.length === 4
												? "4 Selected"
												: "5 Selected"}
										</MenuButton>
										<MenuList>
											{entryTypeOptions.map((entryType) => (
												<MenuItem key={entryType} onClick={() => toggleEntryType(entryType)}>
													<Text fontWeight={selectedEntryTypes.includes(entryType) ? "bold" : "normal"} fontSize="16px">
														{entryType}
													</Text>
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</Flex>
								<Flex
									w={"325px"}
									h={"31px"}
									justify="space-evenly"
									align="center"
									fontWeight="bold"
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									<Radio
										size="sm"
										ml={"7px"}
										isChecked={sortBy === "createdAt"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("createdAt");
										}}
										{...customRadioStyle}
									>
										Entry Time
									</Radio>
									<Radio
										size="sm"
										ml={"7px"}
										isChecked={sortBy === "change"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("change");
										}}
										{...customRadioStyle}
										isDisabled={multipleSelectToggled}
									>
										Change Delta
									</Radio>
									<Radio
										size="sm"
										ml={"7px"}
										isChecked={sortBy === "BranchId"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("BranchId");
										}}
										{...customRadioStyle}
										isDisabled={multipleSelectToggled}
									>
										Branch
									</Radio>
								</Flex>
								<Flex
									justifyContent={"space-around"}
									w={"122px"}
									h={"31px"}
									ml={"8px"}
									justify="center"
									align="center"
									fontWeight="bold"
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									{sortBy === "createdAt" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={() => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<IoCalendarNumberOutline size={26} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={() => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
												isDisabled={multipleSelectToggled}
											>
												<CiCalendarDate size={32} />
											</Radio>
										</>
									)}
									{sortBy === "change" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={() => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineDown size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={() => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<PiChartLineUp size={25} />
											</Radio>
										</>
									)}
									{sortBy === "BranchId" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={() => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<AiOutlineShop size={30} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={() => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<AiTwotoneShop size={30} />
											</Radio>
										</>
									)}
								</Flex>
							</Flex>
						) : activeTab === 2 ? (
							<Flex
								className="transition-element"
								w={marginStyles.secondaryContainerWidth}
								justify={"space-between"}
								h={"45px"}
								align="center"
								fontWeight="bold"
								mb={"2px"}
								borderBottom={"1px solid #39393C"}
							>
								{/* //! Changelogs Tab */}
								<Flex w={"240px"} h={"45px"} align="center" fontWeight="bold">
									<Input
										type="search"
										defaultValue={search}
										mr={"5px"}
										w={"200px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										placeholder="Enter a Product Name"
										{...customInputStyle}
										onChange={handleSearchChange}
									/>
									<FaSearch
										size={20}
										onClick={() => {
											setReload(!reload);
										}}
										style={{ cursor: "pointer" }}
									/>
								</Flex>
								<Flex w={"530px"} h={"45px"} justify="left" align={"center"} fontWeight="bold">
									<Select
										ml={"165px"}
										placeholder="Select Number of IPP"
										value={itemLimit}
										onChange={(e) => {
											setItemLimit(parseInt(e.target.value));
											setPage(1);
											setReload(!reload);
										}}
										w={"157px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
										fontSize={"13px"}
									>
										{itemLimits.map((limit) => (
											<option
												key={limit}
												value={limit}
												style={{
													backgroundColor: itemLimit === limit ? "#F0F0F0" : "#FFFFFF",
													color: itemLimit === limit ? "#18181A" : "#535256",
													fontWeight: itemLimit === limit ? "bold" : "normal",
													fontSize: "14px",
													cursor: "pointer",
												}}
											>
												{limit} Items Per Page
											</option>
										))}
									</Select>
								</Flex>
								<Flex
									ml={"205px"}
									w={"120px"}
									h={"31px"}
									justify="space-evenly"
									align="center"
									fontWeight="bold"
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									<Radio
										size="sm"
										isChecked={sortBy === "createdAt"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("createdAt");
										}}
										{...customRadioStyle}
									>
										Entry Time
									</Radio>
								</Flex>
								<Flex
									justifyContent={"space-around"}
									w={"122px"}
									h={"31px"}
									ml={"8px"}
									justify="center"
									align="center"
									fontWeight="bold"
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									{sortBy === "createdAt" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={() => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<IoCalendarNumberOutline size={26} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={() => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<CiCalendarDate size={32} />
											</Radio>
										</>
									)}
								</Flex>
							</Flex>
						) : null}
						{/* //? End of Content Headers */}
						{/* //? Start of Tab Content */}
						<TabPanels ml={"-15px"}>
							{/* //? Stock Levels Tab Content */}
							<TabPanel key="stock-levels">
								<Stack
									className="transition-element"
									h={"1065px"}
									w={marginStyles.secondaryContainerWidth}
									borderRadius={"15px"}
								>
									{!isLevelSearchEmpty ? (
										<TableContainer className="scrollbar-3px" overflowY={"auto"} h={"inherit"} w={"inherit"}>
											<Table size="sm" variant={!isLoading ? "striped" : "unstyled"}>
												<Thead
													style={{
														position: "sticky",
														top: 0,
														zIndex: 1,
														backgroundColor: "#FFFFFF",
													}}
												>
													<Tr>
														<Th textAlign={"left"}>No.</Th>
														<Th>
															<div className="left-content">
																Product Name
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("productName");
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Aggregate Stock
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("aggregateStock");
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">Category</div>
														</Th>
														<Th>
															<div className="centered-content">
																Jakarta
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("branchStock");
																		setBranchSortId(1);
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Bandung
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("branchStock");
																		setBranchSortId(2);
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Jogjakarta
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("branchStock");
																		setBranchSortId(3);
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Surabaya
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("branchStock");
																		setBranchSortId(4);
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Batam
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("branchStock");
																		setBranchSortId(5);
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Tx Count
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("txCount");
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Failed Tx
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("failedTxCount");
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
														<Th>
															<div className="centered-content">
																Views
																<BiSort
																	display={"flex"}
																	size={14}
																	color="#3E3D40"
																	cursor="pointer"
																	onClick={() => {
																		setSortLevelBy("viewCount");
																		setLevelSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																	}}
																/>
															</div>
														</Th>
													</Tr>
												</Thead>
												<Tbody>{renderLevelsEntries(isLoading)}</Tbody>
											</Table>
										</TableContainer>
									) : (
										<Flex
											w={"1225px"}
											h={"300px"}
											align={"center"}
											borderTop={"1px ridge grey"}
											borderBottom={"1px ridge grey"}
											borderRadius={"10px"}
										>
											<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
										</Flex>
									)}
								</Stack>
							</TabPanel>
							{/* //? End Of Stock Levels Tab Content */}
							{/* //? Stock Movement Tab Content */}
							<TabPanel key="stock-movement">
								<Stack
									className="transition-element"
									h={"1065px"}
									align={"center"}
									w={marginStyles.secondaryContainerWidth}
									borderRadius={"15px"}
								>
									<Flex className="transition-element" justify={"center"} align={"center"}>
										<DateRangePicker
											ranges={dateRange}
											onChange={(date) => {
												setDateRange([date.selection]);
												setPage(1);
											}}
											rangeColors={["#7CB69D"]}
											startDatePlaceholder={dateRange[0].startDate || "Currently Showing"}
											endDatePlaceholder={dateRange[0].endDate || "All Entries"}
										/>
										<StockMovementLineChart
											sortedData={sortedData}
											productName={search}
											isSearchEmpty={isSearchEmpty}
											isDateFound={isDateFound}
											startDate={dateRange[0].startDate}
											endDate={dateRange[0].endDate}
											selectedBranch={selectedBranch}
											itemLimit={itemLimit}
											page={page}
											sortBy={sortBy}
											sortOrder={sortOrder}
											multipleSelectToggled={multipleSelectToggled}
											activeTab={activeTab}
										/>
									</Flex>
									<Stack
										className="transition-element"
										w={marginStyles.secondaryContainerWidth}
										h={"155px"}
										border={"1px ridge grey"}
										borderRadius={"15px"}
										align={"space-between"}
									>
										<Text
											className="p-overview-h"
											w={marginStyles.productOverviewWidth}
											h={"35px"}
											alignSelf={"top"}
											justify={"center"}
											textAlign={"center"}
											borderBottom={"1px ridge grey"}
										>
											PRODUCT OVERVIEW
										</Text>
										<Flex mt={"-8px"} align={"center"}>
											<Image
												ml={"5px"}
												borderRadius={"15px"}
												boxShadow={"1px 2px 3px black"}
												w={"110px"}
												h={"110px"}
												src={
													!isSearchEmpty
														? `${process.env.REACT_APP_BASE_URL}/products/${productDetails?.imgURL}`
														: NoProductThumb
												}
												onClick={() => (!isSearchEmpty ? navigate(`/product/${productDetails?.id}`) : null)}
												cursor={"pointer"}
											/>
											<Stack ml={"10px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text>
													PID ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? productDetails?.id : "No Match"}
												</Text>
												<Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"} maxWidth={"375px"}>
													PRODUCT NAME : {!isSearchEmpty ? productDetails.productName : "No Match"}
												</Text>
												<Text overflow={"hidden"}>
													CATEGORY‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? getCategoryLabel(productDetails.CategoryId) : "No Match"}
												</Text>
												<Text>
													PRICE ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty && productDetails?.price !== undefined
														? new Intl.NumberFormat("id-ID", {
																style: "currency",
																currency: "IDR",
														  }).format(productDetails?.price)
														: "No Match"}
												</Text>
											</Stack>
											<Stack ml={"5px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text overflow={"hidden"}>
													NATIONWIDE STOCK ‎ ‎ : ‎
													{!isSearchEmpty ? `${productDetails.aggregateStock} Units` : "No Match"}
												</Text>
												<Text>
													VIEW COUNT ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? `${productDetails?.viewCount} Views` : "No Match"}
												</Text>
												<Text>
													WEIGHT ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? `${(productDetails?.weight / 1000).toFixed(2)} Kg` : "No Match"}
												</Text>
												<Text overflow={"hidden"}>
													ACTIVATION ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{productDetails.isActive && !isSearchEmpty ? (
														<Badge colorScheme="green" fontSize={"14px"} textAlign={"center"}>
															ACTIVE
														</Badge>
													) : !productDetails.isActive && !isSearchEmpty ? (
														<Badge colorScheme="red" fontSize={"14px"} textAlign={"center"}>
															DEACTIVATED
														</Badge>
													) : (
														"No Match"
													)}
												</Text>
											</Stack>
											<Stack ml={"5px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"} maxWidth={"375px"}>
													DESCRIPTION ‎: ‎
													{!isSearchEmpty
														? productDetails?.description && productDetails.description.length > 75
															? productDetails.description.substring(0, 35) + "..."
															: productDetails.description
														: "Please check your search query."}
												</Text>
												<Text>
													CREATION ‎ ‎ ‎ ‎ ‎ ‎ :{" "}
													{!isSearchEmpty
														? formatDate(productDetails.createdAt)
														: "Did you mean to create this product?"}
												</Text>
												<Text>
													LAST UPDATE ‎ : {!isSearchEmpty ? formatDate(productDetails.updatedAt) : "If so, please go"}
												</Text>
												<Text overflow={"hidden"}>
													DELETED ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty && productDetails.isDeleted ? (
														<Badge colorScheme="red" fontSize={"14px"} textAlign={"center"}>
															YES
														</Badge>
													) : !isSearchEmpty && !productDetails.isDeleted ? (
														<Badge colorScheme="green" fontSize={"14px"} textAlign={"center"}>
															NO
														</Badge>
													) : (
														"to product management."
													)}
												</Text>
											</Stack>
										</Flex>
									</Stack>
									{!isSearchEmpty && (
										<>
											{isDateFound ? (
												<TableContainer className="t-head" overflowY={"auto"} w={marginStyles.secondaryContainerWidth}>
													<Table size="sm" variant={!isLoading ? "striped" : "unstyled"}>
														<Thead
															style={{
																position: "sticky",
																top: 0,
																zIndex: 1,
																backgroundColor: "#FFFFFF",
															}}
														>
															<Tr>
																<Th textAlign={"center"}>No.</Th>
																<Th textAlign={"left"}>Type</Th>
																<Th textAlign={"center"}>Old Value</Th>
																<Th
																	style={{
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																	}}
																>
																	Change
																	<BiSort
																		display={"flex"}
																		size={14}
																		color="#3E3D40"
																		cursor="pointer"
																		onClick={() => {
																			setSortBy("change");
																			setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																		}}
																	/>
																</Th>
																<Th textAlign={"center"}>New Value</Th>
																<Th
																	style={{
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																	}}
																>
																	Branch
																	<BiSort
																		display={"flex"}
																		size={14}
																		color="#3E3D40"
																		cursor="pointer"
																		onClick={() => {
																			setSortBy("BranchId");
																			setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																		}}
																	/>
																</Th>
																<Th textAlign={"center"}>User</Th>
																<Th
																	style={{
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																	}}
																>
																	Date
																	<BiSort
																		display={"flex"}
																		size={14}
																		color="#3E3D40"
																		cursor="pointer"
																		onClick={() => {
																			setSortBy("createdAt");
																			setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																		}}
																	/>
																</Th>
																<Th textAlign={"center"}>Time</Th>
															</Tr>
														</Thead>
														<Tbody>{renderTableEntries(sortedData, isLoading)}</Tbody>
													</Table>
												</TableContainer>
											) : (
												<Flex
													w={marginStyles.secondaryContainerWidth}
													h={"300px"}
													align={"center"}
													borderTop={"1px ridge grey"}
													borderBottom={"1px ridge grey"}
													borderRadius={"10px"}
												>
													<Image src={NoDate} alt="404DateNotFound" objectFit="cover" borderRadius={"5px"} />
												</Flex>
											)}
										</>
									)}
									{isSearchEmpty && (
										<Flex
											w={marginStyles.secondaryContainerWidth}
											h={"300px"}
											align={"center"}
											borderTop={"1px ridge grey"}
											borderBottom={"1px ridge grey"}
											borderRadius={"10px"}
										>
											<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
										</Flex>
									)}
								</Stack>
							</TabPanel>
							{/* //? End Of Stock Movement Tab Content */}
							{/* //? Changelogs Tab Content */}
							<TabPanel key="changelogs">
								<Stack
									className="transition-element"
									h={"1065px"}
									align={"center"}
									w={marginStyles.secondaryContainerWidth}
									borderRadius={"15px"}
								>
									<Flex className="transition-element" justify={"center"} align={"center"}>
										<Image className="transition-element" src={AM1} boxSize={"350px"} />
										<DateRangePicker
											className="transition-element"
											ranges={dateRange}
											onChange={(date) => {
												setDateRange([date.selection]);
												setPage(1);
											}}
											rangeColors={["#7CB69D"]}
											startDatePlaceholder={dateRange[0].startDate || "Currently Showing"}
											endDatePlaceholder={dateRange[0].endDate || "All Entries"}
										/>
										<Image className="transition-element" src={AM2} boxSize={"350px"} />
									</Flex>
									<Stack
										className="transition-element"
										w={marginStyles.secondaryContainerWidth}
										h={"155px"}
										border={"1px ridge grey"}
										borderRadius={"15px"}
										align={"space-between"}
									>
										<Text
											className="p-overview-h"
											w={marginStyles.productOverviewWidth}
											h={"35px"}
											alignSelf={"top"}
											justify={"center"}
											textAlign={"center"}
											borderBottom={"1px ridge grey"}
										>
											PRODUCT OVERVIEW
										</Text>
										<Flex mt={"-8px"} align={"center"}>
											<Image
												ml={"5px"}
												borderRadius={"15px"}
												boxShadow={"1px 2px 3px black"}
												w={"110px"}
												h={"110px"}
												src={
													!isSearchEmpty
														? `${process.env.REACT_APP_BASE_URL}/products/${productDetails?.imgURL}`
														: NoProductThumb
												}
												onClick={() => (!isSearchEmpty ? navigate(`/product/${productDetails?.id}`) : null)}
												cursor={"pointer"}
											/>
											<Stack ml={"10px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text>
													PID ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? productDetails?.id : "No Match"}
												</Text>
												<Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"} maxWidth={"375px"}>
													PRODUCT NAME : {!isSearchEmpty ? productDetails.productName : "No Match"}
												</Text>
												<Text overflow={"hidden"}>
													CATEGORY‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? getCategoryLabel(productDetails.CategoryId) : "No Match"}
												</Text>
												<Text>
													PRICE ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty && productDetails?.price !== undefined
														? new Intl.NumberFormat("id-ID", {
																style: "currency",
																currency: "IDR",
														  }).format(productDetails?.price)
														: "No Match"}
												</Text>
											</Stack>
											<Stack ml={"5px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text overflow={"hidden"}>
													NATIONWIDE STOCK ‎ ‎ : ‎
													{!isSearchEmpty ? `${productDetails.aggregateStock} Units` : "No Match"}
												</Text>
												<Text>
													VIEW COUNT ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? `${productDetails?.viewCount} Views` : "No Match"}
												</Text>
												<Text>
													WEIGHT ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty ? `${(productDetails?.weight / 1000).toFixed(2)} Kg` : "No Match"}
												</Text>
												<Text overflow={"hidden"}>
													ACTIVATION ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{productDetails.isActive && !isSearchEmpty ? (
														<Badge colorScheme="green" fontSize={"14px"} textAlign={"center"}>
															ACTIVE
														</Badge>
													) : !productDetails.isActive && !isSearchEmpty ? (
														<Badge colorScheme="red" fontSize={"14px"} textAlign={"center"}>
															DEACTIVATED
														</Badge>
													) : (
														"No Match"
													)}
												</Text>
											</Stack>
											<Stack ml={"5px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"} maxWidth={"375px"}>
													DESCRIPTION ‎: ‎
													{!isSearchEmpty
														? productDetails?.description && productDetails.description.length > 75
															? productDetails.description.substring(0, 35) + "..."
															: productDetails.description
														: "Please check your search query."}
												</Text>
												<Text>
													CREATION ‎ ‎ ‎ ‎ ‎ ‎ :{" "}
													{!isSearchEmpty
														? formatDate(productDetails.createdAt)
														: "Did you mean to create this product?"}
												</Text>
												<Text>
													LAST UPDATE ‎ : {!isSearchEmpty ? formatDate(productDetails.updatedAt) : "If so, please go"}
												</Text>
												<Text overflow={"hidden"}>
													DELETED ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎
													{!isSearchEmpty && productDetails.isDeleted ? (
														<Badge colorScheme="red" fontSize={"14px"} textAlign={"center"}>
															YES
														</Badge>
													) : !isSearchEmpty && !productDetails.isDeleted ? (
														<Badge colorScheme="green" fontSize={"14px"} textAlign={"center"}>
															NO
														</Badge>
													) : (
														"to product management."
													)}
												</Text>
											</Stack>
										</Flex>
									</Stack>
									{!isSearchEmpty && (
										<>
											{isDateFound ? (
												<TableContainer className="t-head" overflowY={"auto"} w={marginStyles.secondaryContainerWidth}>
													<Table size="sm" variant={!isLoading ? "striped" : "unstyled"}>
														<Thead
															style={{
																position: "sticky",
																top: 0,
																zIndex: 1,
																backgroundColor: "#FFFFFF",
															}}
														>
															<Tr>
																<Th textAlign={"center"}>No.</Th>
																<Th textAlign={"left"}>Field</Th>
																<Th textAlign={"center"}>Old Value</Th>
																<Th textAlign={"center"}>New Value</Th>
																<Th textAlign={"center"}>User</Th>
																<Th
																	style={{
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
																	}}
																>
																	Date
																	<BiSort
																		display={"flex"}
																		size={14}
																		color="#3E3D40"
																		cursor="pointer"
																		onClick={() => {
																			setSortBy("createdAt");
																			setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
																		}}
																	/>
																</Th>
																<Th textAlign={"center"}>Time</Th>
															</Tr>
														</Thead>
														<Tbody>{renderChangelogsTableEntries(isLoading)}</Tbody>
													</Table>
												</TableContainer>
											) : (
												<Flex
													w={"1225px"}
													h={"300px"}
													align={"center"}
													borderTop={"1px ridge grey"}
													borderBottom={"1px ridge grey"}
													borderRadius={"10px"}
												>
													<Image src={NoDate} alt="404DateNotFound" objectFit="cover" borderRadius={"5px"} />
												</Flex>
											)}
										</>
									)}
									{isSearchEmpty && (
										<Flex
											w={"1225px"}
											h={"300px"}
											align={"center"}
											borderTop={"1px ridge grey"}
											borderBottom={"1px ridge grey"}
											borderRadius={"10px"}
										>
											<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
										</Flex>
									)}
								</Stack>
							</TabPanel>
							{/* //? End Of Changelogs Tab Content */}
							{/* //? Key Metrics Tab Content */}
							<TabPanel key="key-metrics">
								<Stack
									className="statistics"
									h={"1110px"}
									w={marginStyles.secondaryContainerWidth}
									align={"center"}
									overflowY={"auto"}
									borderRadius={"10px"}
								>
									<Stack
										className="statistics"
										h={"1110px"}
										w={marginStyles.secondaryContainerWidth}
										align={"center"}
										borderRadius={"10px"}
									>
										{selectedHighLevelOption !== null && selectedSubOption === "clear" ? (
											<Text fontSize={"30px"} fontWeight={"thin"}>
												Please Select A Metric To Get Started.
											</Text>
										) : selectedSubOption === "" ? (
											<Text fontSize={"30px"} fontWeight={"thin"}>
												Please Select A Metric To Get Started.
											</Text>
										) : null}
										<Select
											placeholder="Choose a Metric"
											value={selectedHighLevelOption}
											onChange={handleHighLevelOptionChange}
											w="225px"
											h="30px"
											border="1px solid gray"
											bgColor="white"
											isDisabled={selectedSubOption !== "clear"}
										>
											<option value="category" style={{ fontSize: "16px", fontWeight: "normal", cursor: "pointer" }}>
												Category
											</option>
											<option value="branch" style={{ fontSize: "16px", fontWeight: "normal", cursor: "pointer" }}>
												Branch
											</option>
										</Select>
										{selectedHighLevelOption === "category" && (
											<Select
												placeholder="Select a Category"
												value={selectedSubOption || ""}
												onChange={handleSubOptionChange}
												w="225px"
												h="30px"
												border="1px solid gray"
												bgColor="white"
											>
												{categories.map((category) => (
													<React.Fragment key={category.value}>
														<option
															value={parseInt(category.value, 10)}
															style={{
																backgroundColor: selectedSubOption === category.value ? "#F0F0F0" : "#FFFFFF",
																color: selectedSubOption === category.value ? "#18181A" : "#535256",
																fontWeight: selectedSubOption === category.value ? "bold" : "normal",
																fontSize: "16px",
																cursor: "pointer",
															}}
														>
															{category.label}
														</option>
													</React.Fragment>
												))}
												<option key={"clear-category-sub"} value={"clear"}>
													Clear Selection
												</option>
											</Select>
										)}
										{selectedHighLevelOption === "branch" && (
											<Select
												placeholder="Select a Branch"
												value={selectedSubOption || ""}
												onChange={handleSubOptionChange}
												w="225px"
												h="30px"
												border="1px solid gray"
												bgColor="white"
											>
												{branches.map((branch) => (
													<React.Fragment key={branch.value}>
														<option
															value={parseInt(branch.value, 10)}
															style={{
																backgroundColor: selectedSubOption === branch.value ? "#F0F0F0" : "#FFFFFF",
																color: selectedSubOption === branch.value ? "#18181A" : "#535256",
																fontWeight: selectedSubOption === branch.value ? "bold" : "normal",
																fontSize: "16px",
																cursor: "pointer",
															}}
														>
															{branch.label}
														</option>
													</React.Fragment>
												))}
												<option key={"clear-branch-sub"} value={"clear"}>
													Clear Selection
												</option>
											</Select>
										)}
										{selectedHighLevelOption === "category" &&
										selectedSubOption !== "clear" &&
										selectedSubOption !== "" ? (
											<>
												{/* //? Start Of Category Metrics Conditional Render */}
												<Stack
													className="statistics"
													h={"1110px"}
													w={marginStyles.secondaryContainerWidth}
													align={"center"}
													overflowY={"auto"}
													borderRadius={"10px"}
												>
													{/* //? Most Aggregate Stock Cat */}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mt={"15px"}
														mb={"25px"}
													>
														<Text fontSize={"30px"} fontWeight={"semibold"}>
															PRODUCTS WITH THE HIGHEST NATIONWIDE STOCK IN {getCategoryLabel(selectedSubOption)}
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																				?.topAggregateStock[1]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[1]?.imgURL
																}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																				?.topAggregateStock[0]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[0]?.imgURL
																}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																				?.topAggregateStock[2]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[2]?.imgURL
																}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[1]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[1]?.aggregateStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[0]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[0]?.aggregateStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[2]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.topAggregateStock[2]?.aggregateStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
													</Stack>
													{/* //? Least Aggregate Stock Cat */}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mb={"25px"}
													>
														<Text fontSize={"30px"} fontWeight={"semibold"}>
															PRODUCTS WITH THE LOWEST NATIONWIDE STOCK IN {getCategoryLabel(selectedSubOption)}
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																				?.lowAggregateStock[1]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[1]?.imgURL
																}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																				?.lowAggregateStock[0]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[0]?.imgURL
																}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																				?.lowAggregateStock[2]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[2]?.imgURL
																}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[1]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[1]?.aggregateStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[0]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[0]?.aggregateStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[2]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products
																		?.lowAggregateStock[2]?.aggregateStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
													</Stack>
													{/* //? Most Views Cat */}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mb={"25px"}
													>
														<Text fontSize={"33px"} fontWeight={"semibold"}>
															MOST VIEWED PRODUCTS IN {getCategoryLabel(selectedSubOption)}
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[1]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[1]?.imgURL
																}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[0]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[0]?.imgURL
																}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[2]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[2]?.imgURL
																}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B8A89"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[1]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>View Count:</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[1]
																		?.viewCount || 0}{" "}
																	x
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[0]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>View Count:</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[0]
																		?.viewCount || 0}{" "}
																	x
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[2]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>View Count:</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.topViews[2]
																		?.viewCount || 0}{" "}
																	x
																</Text>
															</Flex>
														</Stack>
													</Stack>
													{/* //? Least Views Cat */}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mb={"25px"}
													>
														<Text fontSize={"33px"} fontWeight={"semibold"}>
															LEAST VIEWED PRODUCTS IN {getCategoryLabel(selectedSubOption)}
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[1]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[1]?.imgURL
																}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[0]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[0]?.imgURL
																}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={"pointer"}
																onClick={() =>
																	navigate(
																		`/product/${
																			keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[2]?.id
																		}`
																	)
																}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[2]?.imgURL
																}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[1]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>View Count:</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[1]
																		?.viewCount || 0}{" "}
																	x
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[0]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>View Count:</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[0]
																		?.viewCount || 0}{" "}
																	x
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[2]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>View Count:</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsCategory[parseInt(selectedSubOption - 1, 10)]?.products?.lowViews[2]
																		?.viewCount || 0}{" "}
																	x
																</Text>
															</Flex>
														</Stack>
													</Stack>
												</Stack>
											</>
										) : null}
										{/* //? End Of Category Metrics Conditional Render */}
										{selectedHighLevelOption === "branch" &&
										selectedSubOption !== "clear" &&
										selectedSubOption !== "" ? (
											<>
												{/* //? Start Of Branch Metrics Conditional Render */}
												<Stack
													className="statistics"
													h={"1110px"}
													w={marginStyles.secondaryContainerWidth}
													align={"center"}
													overflowY={"auto"}
													borderRadius={"10px"}
												>
													{/* //? Most Branch Stock */}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mt={"15px"}
														mb={"25px"}
													>
														<Text fontSize={"30px"} fontWeight={"semibold"}>
															PRODUCTS WITH THE HIGHEST STOCK IN {getBranchLabel(selectedSubOption)}
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[1]
																		?.id !== undefined
																		? "pointer"
																		: "not-allowed"
																}
																onClick={() => {
																	if (
																		keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[1]
																			?.id !== undefined
																	) {
																		navigate(
																			`/product/${
																				keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products
																					?.topBranchStock[1]?.id
																			}`
																		);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[1]
																		?.imgURL
																}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[0]
																		?.id !== undefined
																		? "pointer"
																		: "not-allowed"
																}
																onClick={() => {
																	if (
																		keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[0]
																			?.id !== undefined
																	) {
																		navigate(
																			`/product/${
																				keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products
																					?.topBranchStock[0]?.id
																			}`
																		);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[0]
																		?.imgURL
																}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[2]
																		?.id !== undefined
																		? "pointer"
																		: "not-allowed"
																}
																onClick={() => {
																	if (
																		keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[2]
																			?.id !== undefined
																	) {
																		navigate(
																			`/product/${
																				keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products
																					?.topBranchStock[2]?.id
																			}`
																		);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[2]
																		?.imgURL
																}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[1]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[1]
																		?.Stocks?.currentStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[0]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[0]
																		?.Stocks?.currentStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[2]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.topBranchStock[2]
																		?.Stocks?.currentStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
													</Stack>
													{/* //? Least Branch Stock*/}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mb={"25px"}
													>
														<Text fontSize={"30px"} fontWeight={"semibold"}>
															PRODUCTS WITH THE LOWEST STOCK IN {getBranchLabel(selectedSubOption)}
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[1]
																		?.id !== undefined
																		? "pointer"
																		: "not-allowed"
																}
																onClick={() => {
																	if (
																		keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[1]
																			?.id !== undefined
																	) {
																		navigate(
																			`/product/${
																				keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products
																					?.lowBranchStock[1]?.id
																			}`
																		);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[1]
																		?.imgURL
																}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[0]
																		?.id !== undefined
																		? "pointer"
																		: "not-allowed"
																}
																onClick={() => {
																	if (
																		keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[0]
																			?.id !== undefined
																	) {
																		navigate(
																			`/product/${
																				keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products
																					?.lowBranchStock[0]?.id
																			}`
																		);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[0]
																		?.imgURL
																}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[2]
																		?.id !== undefined
																		? "pointer"
																		: "not-allowed"
																}
																onClick={() => {
																	if (
																		keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[2]
																			?.id !== undefined
																	) {
																		navigate(
																			`/product/${
																				keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products
																					?.lowBranchStock[2]?.id
																			}`
																		);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${
																	keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[2]
																		?.imgURL
																}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[1]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[1]
																		?.Stocks?.currentStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[0]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[0]
																		?.Stocks?.currentStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[2]
																		?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Stock ‎ ‎ :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsBranch[parseInt(selectedSubOption - 1, 10)]?.products?.lowBranchStock[2]
																		?.Stocks?.currentStock || 0}{" "}
																	Units
																</Text>
															</Flex>
														</Stack>
													</Stack>
													{/* //? Most Branch Orders*/}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mb={"25px"}
													>
														<Text fontSize={"30px"} fontWeight={"semibold"}>
															BEST SELLING PRODUCTS IN {getBranchLabel(selectedSubOption)} (Non-Zero Orders)
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={
																	keyMetricsTxBranch?.bestProducts[1]?.id !== undefined ? "pointer" : "not-allowed"
																}
																onClick={() => {
																	if (keyMetricsTxBranch?.bestProducts[1]?.id !== undefined) {
																		navigate(`/product/${keyMetricsTxBranch?.bestProducts[1]?.id}`);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${keyMetricsTxBranch?.bestProducts[1]?.imgURL}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={
																	keyMetricsTxBranch?.bestProducts[0]?.id !== undefined ? "pointer" : "not-allowed"
																}
																onClick={() => {
																	if (keyMetricsTxBranch?.bestProducts[0]?.id !== undefined) {
																		navigate(`/product/${keyMetricsTxBranch?.bestProducts[0]?.id}`);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${keyMetricsTxBranch?.bestProducts[0]?.imgURL}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={
																	keyMetricsTxBranch?.bestProducts[2]?.id !== undefined ? "pointer" : "not-allowed"
																}
																onClick={() => {
																	if (keyMetricsTxBranch?.bestProducts[2]?.id !== undefined) {
																		navigate(`/product/${keyMetricsTxBranch?.bestProducts[2]?.id}`);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${keyMetricsTxBranch?.bestProducts[2]?.imgURL}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.bestProducts[1]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Customer Orders :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.bestProducts[1]?.txCount || 0} Orders
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.bestProducts[0]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Customer Orders :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.bestProducts[0]?.txCount || 0} Orders
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.bestProducts[2]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Customer Orders :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.bestProducts[2]?.txCount || 0} Orders
																</Text>
															</Flex>
														</Stack>
													</Stack>
													{/* //? Least Branch Orders*/}
													<Stack
														className="statistics"
														h={"450px"}
														w={marginStyles.secondaryContainerWidth}
														align={"center"}
														borderRadius={"10px"}
														mb={"25px"}
													>
														<Text fontSize={"30px"} fontWeight={"semibold"}>
															WEAKEST SELLING PRODUCTS IN {getBranchLabel(selectedSubOption)} (Non-Zero Orders)
														</Text>
														<Flex position={"relative"} align={"center"} mb={"30px"}>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={SecondPlace}
																boxSize={"285px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"-27px"}
																top={"-5px"}
																cursor={
																	keyMetricsTxBranch?.worstProducts[1]?.id !== undefined ? "pointer" : "not-allowed"
																}
																onClick={() => {
																	if (keyMetricsTxBranch?.worstProducts[1]?.id !== undefined) {
																		navigate(`/product/${keyMetricsTxBranch?.worstProducts[1]?.id}`);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${keyMetricsTxBranch?.worstProducts[1]?.imgURL}`}
																boxSize={"231px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={FirstPlace}
																boxSize={"296px"}
																position={"absolute"}
																zIndex={"2"}
																top={"-5px"}
																ml={"335px"}
																cursor={
																	keyMetricsTxBranch?.worstProducts[0]?.id !== undefined ? "pointer" : "not-allowed"
																}
																onClick={() => {
																	if (keyMetricsTxBranch?.worstProducts[0]?.id !== undefined) {
																		navigate(`/product/${keyMetricsTxBranch?.worstProducts[0]?.id}`);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${keyMetricsTxBranch?.worstProducts[0]?.imgURL}`}
																boxSize={"265px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
																mx={"120px"}
															/>
															<Image
																className={`coin ${isFilterChanged ? "filter-change" : ""}`}
																src={ThirdPlace}
																boxSize={"240px"}
																top={"10px"}
																position={"absolute"}
																zIndex={"2"}
																ml={"730px"}
																cursor={
																	keyMetricsTxBranch?.worstProducts[2]?.id !== undefined ? "pointer" : "not-allowed"
																}
																onClick={() => {
																	if (keyMetricsTxBranch?.worstProducts[2]?.id !== undefined) {
																		navigate(`/product/${keyMetricsTxBranch?.worstProducts[2]?.id}`);
																	}
																}}
															/>
															<Image
																className={`coin-img ${isFilterChanged ? "filter-change" : ""}`}
																src={`${process.env.REACT_APP_BASE_URL}/products/${keyMetricsTxBranch?.worstProducts[2]?.imgURL}`}
																boxSize={"210px"}
																rounded={"full"}
																position={"relative"}
																zIndex={"1"}
															/>
														</Flex>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															ml={"-725px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.worstProducts[1]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Returned Orders :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.worstProducts[1]?.failedTxCount || 0} Orders
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #8B6010"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"26px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.worstProducts[0]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Returned Orders :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.worstProducts[0]?.failedTxCount || 0} Orders
																</Text>
															</Flex>
														</Stack>
														<Stack
															position={"relative"}
															w={"250px"}
															h={"70px"}
															justify={"center"}
															border={"2px ridge #4B4418"}
															borderRadius={"15px"}
															mt={"-78px"}
															ml={"750px"}
															px={"7px"}
														>
															<Flex justify={"space-between"} overflow="hidden" whiteSpace="nowrap">
																<Text>Name ‎ : ‎</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.worstProducts[2]?.productName || "Product Does Not Exist"}
																</Text>
															</Flex>
															<Flex justify={"space-between"}>
																<Text>Returned Orders :</Text>
																<Text overflow="hidden" textOverflow="ellipsis">
																	{keyMetricsTxBranch?.worstProducts[2]?.failedTxCount || 0} Orders
																</Text>
															</Flex>
														</Stack>
													</Stack>
												</Stack>
											</>
										) : null}
										{/* //? End Of Branch Metrics Conditional Render */}
									</Stack>
								</Stack>
							</TabPanel>
							{/* //? End Of Key Metrics Tab Content */}
							{/* //? Statistics Tab Content */}
							<TabPanel key="statistics">
								<Stack
									className="statistics"
									h={"1110px"}
									w={marginStyles.secondaryContainerWidth}
									align={"center"}
									overflowY={"auto"}
									borderRadius={"10px"}
								>
									<Stack
										w={marginStyles.secondaryContainerWidth}
										h={"1000px"}
										alignItems={"center"}
										mt={"25px"}
										mb={"25px"}
									>
										<Stack>
											<Text fontSize={"35px"} fontWeight={"semibold"}>
												BRANCH STATISTICS
											</Text>
										</Stack>
										<Flex
											className="statistics-content"
											width={marginStyles.secondaryContainerWidth}
											height={"460px"}
											px={"50px"}
										>
											<BranchDoughnutChart />
											<BranchBarChart />
											<BranchTxStackedBarChart />
										</Flex>
									</Stack>
									<Stack w={marginStyles.secondaryContainerWidth} h={"1000px"} alignItems={"center"} mb={"25px"}>
										<Stack>
											<Text fontSize={"35px"} fontWeight={"semibold"}>
												CATEGORY STATISTICS
											</Text>
										</Stack>
										<Flex
											className="statistics-content"
											width={marginStyles.secondaryContainerWidth}
											height={"460px"}
											px={"50px"}
										>
											<CategoryDoughnutChart />
											<CategoryBarChart />
											<StatusStackedBarChart />
											<ActiveProductsBarChart />
											<DeactivatedProductsBarChart />
											<DeletedProductsBarChart />
										</Flex>
									</Stack>
									<Stack w={marginStyles.secondaryContainerWidth} h={"1000px"} alignItems={"center"}>
										<Stack>
											<Text fontSize={"35px"} fontWeight={"semibold"}>
												GENERAL STATISTICS
											</Text>
										</Stack>
										<Flex
											className="statistics-content"
											width={marginStyles.secondaryContainerWidth}
											height={"400px"}
											px={"50px"}
										>
											<ViewCountBarChart />
											<LikeCountBarChart />
										</Flex>
									</Stack>
								</Stack>
							</TabPanel>
							{/* //? End Of Statistics Tab Content */}
							{/* //? End of Tab Content */}
						</TabPanels>
					</Tabs>
					<Box position="absolute" bottom="-20" left="50%" transform="translateX(-50%)">
						{activeTab === 0 || activeTab === 1 || activeTab === 2 ? (
							<Pagination
								page={page}
								totalPages={totalPages}
								prevPage={prevPage}
								nextPage={nextPage}
								goToPage={goToPage}
								lastPage={totalPages}
							/>
						) : null}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default StockReport;
