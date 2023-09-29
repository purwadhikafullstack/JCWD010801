import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-loading-skeleton/dist/skeleton.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import NoProduct from "../assets/public/404.png";
import NoDate from "../assets/public/404_calendar.jpeg";
import NoProductThumb from "../assets/public/404_thumb.gif";
import React, { useEffect, useState } from "react";
import CategoryBarChart from "../components/stockReport/categoryBarChart";
import CategoryDoughnutChart from "../components/stockReport/categoryDoughnutChart";
import ActiveProductsBarChart from "../components/stockReport/activeProductsBarChart";
import DeactivatedProductsBarChart from "../components/stockReport/deactivatedProductsBarChart";
import DeletedProductsBarChart from "../components/stockReport/deletedProductsBarChart";
import ViewCountBarChart from "../components/stockReport/viewCountBarChart";
import StatusStackedBarChart from "../components/stockReport/statusStackedBarChart";
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
	TableCaption,
	Tfoot,
	Button,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../components/navigation/navbarAdmin";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { Pagination } from "../components/navigation/pagination";
import { BiSolidChevronsDown, BiSort } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { PiChartLineDown, PiChartLineUp } from "react-icons/pi";
import { sidebarEvent } from "../events/sidebarEvent";
import { AiOutlineShop, AiTwotoneShop } from "react-icons/ai";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";

const StockReport = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const { id, username, lastName, gender, RoleId } = useSelector((state) => state?.user?.value);
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
	const itemLimits = [10, 20, 50, 75, 100];
	const [itemLimit, setItemLimit] = useState(20);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [BranchId, setBranchId] = useState(null);
	const [selectedBranch, setSelectedBranch] = useState("");
	const [sortedData, setSortedData] = useState([]);
	const [administrators, setAdministrators] = useState([]);
	const [selectedEntryTypes, setSelectedEntryTypes] = useState([]);
	const [dateRange, setDateRange] = useState([
		{
			startDate: null,
			endDate: null,
			key: "selection",
		},
	]);

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
		"Stock Initialized For Branch",
		"Manual Adjustment",
		"Sales",
		"Clear Selections (All Entries)",
	];

	const toggleEntryType = (entryType) => {
		if (entryType === "Clear Selections (All Entries)") {
			setSelectedEntryTypes([]);
		} else {
			if (selectedEntryTypes.includes(entryType)) {
				setSelectedEntryTypes((prev) => prev.filter((selected) => selected !== entryType));
			} else {
				setSelectedEntryTypes((prev) => [...prev, entryType]);
			}
		}
	};

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
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/info`)
			.then((response) => {
				setAdministrators(response.data.admins);
			})
			.catch((error) => {
				console.error("Error fetching administrators info:", error);
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
	}, []);

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/random`)
			.then((response) => {
				setSearch(response.data.productName);
				setPage(1);
			})
			.catch((error) => {
				console.error("Error fetching administrators info:", error);
			});
	}, [activeTab]);

	const currentBranchInfo = branches.find((branch) => branch.id === adminBranchId);
	const currentBranchName = currentBranchInfo?.name;

	useEffect(() => {
		const handleSidebarSizeChange = (newSize) => {
			setMarginStyles((prevState) => {
				const newMarginLeftContainer = newSize === "small" ? "100px" : "168px";
				const newMarginLeftHeading = newSize === "small" ? "48px" : "13px";
				const newMarginLeftDescription = newSize === "small" ? "50px" : "15px";

				return {
					...prevState,
					marginLeftContainer: newMarginLeftContainer,
					marginLeftHeading: newMarginLeftHeading,
					marginLeftDescription: newMarginLeftDescription,
				};
			});
		};

		sidebarEvent.on("sidebarSizeChange", handleSidebarSizeChange);

		return () => {
			sidebarEvent.off("sidebarSizeChange", handleSidebarSizeChange);
		};
	}, []);

	useEffect(() => {
		if (activeTab === 1) {
			fetchMovementData(page);
		}
	}, [search, reload, dateRange, selectedEntryTypes, itemLimit, selectedBranch, sortBy, sortOrder]);

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

	const handleSearchDebounced = debounce((query) => {
		setSearch(query);
		setPage(1);
	}, 2000);

	const handleSearchChange = (e) => {
		const query = e.target.value;
		handleSearchDebounced(query);
	};

	const findAdminNameById = (UID) => {
		const admin = administrators.find((admin) => admin.id === UID);
		return admin ? admin.username : "Unknown";
	};

	const findBranchNameById = (BID) => {
		const branch = branches.find((branch) => branch.value === BID);
		return branch ? branch.label : "Unknown";
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
								? "Stock Initialized For Branch"
								: item.isAdjustment
								? "Manual Adjustment"
								: "Sales"
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
									width={"1220px"}
									containerClassName="flex-1"
									height={"35px"}
									highlightColor="#141415"
									direction={isEvenIndex ? "rtl" : "ltr"}
								/>
							</div>
						</Td>
					</Tr>
				);
			});
		} else {
			return filteredData.map((item, index) => {
				const createdAtDate = new Date(item.createdAt);
				const formattedDate = `${createdAtDate.getDate()} ${months[createdAtDate.getMonth()]} ${createdAtDate
					.getFullYear()
					.toString()
					.slice(-2)}`;
				const formattedTime = `${createdAtDate.getHours().toString().padStart(2, "0")}:${createdAtDate
					.getMinutes()
					.toString()
					.padStart(2, "0")}`;

				return (
					<Tr key={item.id}>
						<Td textAlign={"left"}>{index + 1}</Td>
						<Td textAlign={"center"}>
							{item.isInitialization
								? "Product Created"
								: item.isBranchInitialization
								? "Stock Initialized For Branch"
								: item.isAdjustment
								? "Manual Adjustment"
								: "Sales"}
						</Td>
						<Td textAlign={"center"}>{item.oldValue} units</Td>
						<Td textAlign={"center"}>{item.change} units</Td>
						<Td textAlign={"center"}>{item.newValue} units</Td>
						<Td textAlign={"center"}>{findBranchNameById(item.BranchId)}</Td>
						<Td textAlign={"center"}>{findAdminNameById(item.UserId)}</Td>
						<Td textAlign={"center"}>{formattedDate}</Td>
						<Td isNumeric>{formattedTime}</Td>
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
	}, [movementHistory, sortBy, sortOrder]);

	const getCategoryLabel = (catId) => {
		const category = categories.find((category) => category.value === catId);
		return category ? category.label : "Category Missing!";
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
		marginLeftContainer: "168px",
		marginLeftHeading: "13px",
		marginLeftDescription: "15px",
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
			<Box className="transition-element" ml={marginStyles.marginLeftContainer} h={"200vh"}>
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
					w={"1250px"}
					h={"160vh"}
					m={"5px"}
					py={"5px"}
					border={"1px solid #39393C"}
					borderRadius={"10px"}
					position={"relative"}
				>
					<Tabs
						value={activeTab}
						onChange={(index) => {
							setActiveTab(index);
						}}
						w="1225px"
						align="left"
					>
						<TabList>
							<Tab
								width="15%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 0 ? "#2E8B57" : "white",
									bgColor: activeTab === 0 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Stock Analysis(All PIDs)
							</Tab>
							<Tab
								width="15%"
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
								width="15%"
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
								width="15%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 3 ? "#2E8B57" : "white",
									bgColor: activeTab === 3 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Key Metrics(category top&low aggregate; views)
							</Tab>
							<Tab
								width="15%"
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
						{activeTab === 1 ? (
							<Flex
								w={"1225px"}
								h={"45px"}
								align="center"
								fontWeight="bold"
								mb={"2px"}
								borderBottom={"1px solid #39393C"}
							>
								<Flex w={"240px"} h={"45px"} align="center" fontWeight="bold">
									<Input
										type="search"
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
										placeholder="Items Per Page"
										onChange={(e) => {
											setItemLimit(parseInt(e.target.value));
											setReload(!reload);
										}}
										w={"155px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
									>
										{itemLimits.map((limit) => (
											<option
												key={limit}
												value={limit}
												style={{
													backgroundColor: itemLimit === limit ? "#F0F0F0" : "#FFFFFF",
													color: itemLimit === limit ? "#18181A" : "#535256",
													fontWeight: itemLimit === limit ? "bold" : "normal",
													fontSize: "16px",
													cursor: "pointer",
												}}
											>
												{limit}
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
													? "11px"
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
												: "4 Selected"}
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
						) : null}
						<TabPanels ml={"-15px"}>
							<TabPanel key="stock-analysis">Stock Analysis</TabPanel>
							<TabPanel key="stock-movement">
								<Stack h={"1000px"} w={"1225px"} borderRadius={"15px"}>
									<Flex>
										<DateRangePicker
											ranges={dateRange}
											onChange={(date) => {
												setDateRange([date.selection]);
											}}
											rangeColors={["#7CB69D"]}
											startDatePlaceholder={dateRange[0].startDate || "Currently Showing"}
											endDatePlaceholder={dateRange[0].endDate || "All Entries"}
										/>
										<StockMovementLineChart sortedData={sortedData} />
									</Flex>
									<Stack
										h={"155px"}
										w={"1225px"}
										border={"1px ridge grey"}
										borderRadius={"15px"}
										align={"space-between"}
									>
										<Text
											className="p-overview-h"
											w={"1224px"}
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
													CATEGORY‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ : ‎{!isSearchEmpty ? productDetails.CategoryId : "No Match"}
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
													{productDetails.isActive && !isSearchEmpty
														? "ACTIVE"
														: !productDetails.isActive && !isSearchEmpty
														? "DEACTIVATED"
														: "No Match"}
												</Text>
											</Stack>
											<Stack ml={"5px"} w={"375px"} h={"115px"} fontSize={"15px"} justify={"center"}>
												<Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"} maxWidth={"375px"}>
													DESCRIPTION ‎: ‎
													{!isSearchEmpty
														? productDetails?.description && productDetails.description.length > 35
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
													{!isSearchEmpty && productDetails.isDeleted
														? "YES"
														: !isSearchEmpty && !productDetails.isDeleted
														? "NO"
														: "to product management."}
												</Text>
											</Stack>
										</Flex>
									</Stack>
									{!isSearchEmpty && (
										<>
											{isDateFound ? (
												<TableContainer className="scrollbar-3px" overflowY={"auto"}>
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
																<Th textAlign={"center"}>Type</Th>
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
																<Th isNumeric>Time</Th>
															</Tr>
														</Thead>
														<Tbody>{renderTableEntries(sortedData, isLoading)}</Tbody>
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
							<TabPanel key="changelogs">Changelogs</TabPanel>
							<TabPanel key="key-metrics">Key Metrics</TabPanel>
							<TabPanel key="statistics">
								<Stack align={"center"} overflowY={"auto"} height={"1000px"}>
									<CategoryDoughnutChart />
									<ViewCountBarChart />
									<CategoryBarChart />
									<StatusStackedBarChart />
									<ActiveProductsBarChart />
									<DeactivatedProductsBarChart />
									<DeletedProductsBarChart />
								</Stack>
							</TabPanel>
						</TabPanels>
					</Tabs>
					<Box position="absolute" bottom="-20" left="50%" transform="translateX(-50%)">
						{activeTab === 1 ? (
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
