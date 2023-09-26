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
import { debounce, isDate } from "lodash";
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
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../components/navigation/navbarAdmin";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { Pagination } from "../components/navigation/pagination";
import { BiCategoryAlt } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { PiChartLineDown, PiChartLineUp } from "react-icons/pi";
import { TbCategory2 } from "react-icons/tb";
import { sidebarEvent } from "../events/sidebarEvent";
import CategoryBarChart from "../components/stockReport/categoryBarChart";
import CategoryDoughnutChart from "../components/stockReport/categoryDoughnutChart";
import ActiveProductsBarChart from "../components/stockReport/activeProductsBarChart";
import DeactivatedProductsBarChart from "../components/stockReport/deactivatedProductsBarChart";
import DeletedProductsBarChart from "../components/stockReport/deletedProductsBarChart";
import ViewCountBarChart from "../components/stockReport/viewCountBarChart";
import StatusStackedBarChart from "../components/stockReport/statusStackedBarChart";

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
	const [itemLimit, setItemLimit] = useState(20);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [BranchId, setBranchId] = useState(null);
	const [sortedData, setSortedData] = useState([]);
	const [administrators, setAdministrators] = useState([]);
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
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`)
			.then((response) => {
				setBranches(response.data);
			})
			.catch((error) => {
				console.error("Error fetching branches info:", error);
			});
	}, []);

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/random`)
			.then((response) => {
				setSearch(response.data.productName);
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
	}, [search, reload, dateRange]);

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

			if (BranchId) {
				apiURL += `&BranchId=${BranchId}`;
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
	}, 1000);

	const handleSearchChange = (e) => {
		const query = e.target.value;
		handleSearchDebounced(query);
	};

	const findAdminNameById = (UID) => {
		const admin = administrators.find((admin) => admin.id === UID);
		return admin ? admin.username : "Unknown";
	};

	const findBranchNameById = (BID) => {
		const branch = branches.find((branch) => branch.id === BID);
		return branch ? branch.name : "Unknown";
	};

	const renderTableEntries = (data, isLoading) => {
		if (isLoading) {
			return data.map((item, index) => {
				const isEvenIndex = index % 2 === 0;
				return (
					<Tr key={item.id}>
						<div style={{ width: "10px" }}>
							<Skeleton
								count={1}
								width={"1190px"}
								containerClassName="flex-1"
								height={"35px"}
								highlightColor="#141415"
								direction={isEvenIndex ? "rtl" : "ltr"}
							/>
						</div>
					</Tr>
				);
			});
		} else {
			return data.map((item, index) => {
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
								? "Product Initialization"
								: item.isBranchInitialization
								? "Branch Initialization"
								: item.isAdjustment
								? "Manual Adjustment"
								: "Sales"}
						</Td>
						<Td textAlign={"center"}>{item.oldValue} units</Td>
						<Td textAlign={"center"}>{item.change} units</Td>
						<Td textAlign={"center"}>{item.newValue} units</Td>
						<Td textAlign={"center"}>{findAdminNameById(item.UserId)}</Td>
						<Td textAlign={"center"}>{findBranchNameById(item.BranchId)}</Td>
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
					flexDirection="column"
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
								<Flex w={"210px"} h={"45px"} justify="left" align={"center"} fontWeight="bold" ml={"10px"}>
									<Select
										placeholder="All Branches" //!xxx convert to branches
										value={selectedCategory.toString()}
										onChange={(e) => {
											const selectedValue = parseInt(e.target.value, 10);
											setSelectedCategory(isNaN(selectedValue) ? "" : selectedValue);
											setReload(!reload);
										}}
										w={"200px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										{...customSelectStyle}
									>
										{categories.map((category) => (
											<option
												key={category.value}
												value={category.value.toString()}
												style={{
													backgroundColor: selectedCategory === category.value ? "#F0F0F0" : "#FFFFFF",
													color: selectedCategory === category.value ? "#18181A" : "#535256",
													fontWeight: selectedCategory === category.value ? "bold" : "normal",
													fontSize: "16px",
													cursor: "pointer",
												}}
											>
												{category.label}
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
									ml={"10px"}
									border={"1px solid black"}
									borderRadius={"10px"}
								>
									<Radio
										size="sm"
										ml={"7px"}
										isChecked={sortBy === "CategoryId"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("CategoryId");
										}}
										{...customRadioStyle}
									>
										Categories
									</Radio>
									<Radio
										size="sm"
										ml={"7px"}
										isChecked={sortBy === "aggregateStock"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("aggregateStock");
										}}
										{...customRadioStyle}
									>
										N.Stock
									</Radio>
									<Radio
										size="sm"
										ml={"7px"}
										isChecked={sortBy === "branchStock"}
										borderColor={"gray"}
										onChange={() => {
											setSortBy("branchStock");
										}}
										{...customRadioStyle}
									>
										B.Stock
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
									{sortBy === "CategoryId" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={() => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												<BiCategoryAlt size={25} />
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={() => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												<TbCategory2 size={25} />
											</Radio>
										</>
									)}
									{sortBy === "aggregateStock" && (
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
									{sortBy === "branchStock" && (
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
										/>
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
												<TableContainer>
													<Table size="sm" variant={"striped"} overflowY={"auto"}>
														<Thead>
															<Tr>
																<Th textAlign={"left"}>No.</Th>
																<Th textAlign={"center"}>Type</Th>
																<Th textAlign={"center"}>Old Value</Th>
																<Th textAlign={"center"}>Change</Th>
																<Th textAlign={"center"}>New Value</Th>
																<Th textAlign={"center"}>User</Th>
																<Th textAlign={"center"}>Branch</Th>
																<Th textAlign={"center"}>Date</Th>
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
