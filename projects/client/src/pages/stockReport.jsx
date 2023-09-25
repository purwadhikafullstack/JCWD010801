import "react-toastify/dist/ReactToastify.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import Axios from "axios";
import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../components/navigation/navbarAdmin";
import { AdminSidebar } from "../components/navigation/adminSidebar";
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

const StockReport = () => {
	const token = localStorage.getItem("token");
	const { id, username, lastName, gender, BranchId, RoleId } = useSelector((state) => state?.user?.value);
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [search, setSearch] = useState("");
	const [isSearchEmpty, setIsSearchEmpty] = useState(false);
	const [sortBy, setSortBy] = useState("productName");
	const [sortOrder, setSortOrder] = useState("DESC");
	const [activeTab, setActiveTab] = useState(0);
	const [branches, setBranches] = useState([]);
	const [reload, setReload] = useState(false);

	const [marginStyles, setMarginStyles] = useState({
		marginLeftContainer: "168px",
		marginLeftHeading: "13px",
		marginLeftDescription: "15px",
	});

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }

	const navigate = useNavigate();
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

	const fetchBranchData = async () => {
		try {
			const branchResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(branchResponse.data);
		} catch (error) {
			console.log(error);
		}
	};
	const currentBranchInfo = branches.find((branch) => branch.id === BranchId);
	const currentBranchName = currentBranchInfo?.name;

	const getCategoryLabel = (catId) => {
		const category = categories.find((category) => category.value === catId);
		return category ? category.label : "Category Missing!";
	};

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
								width="19%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 0 ? "#2E8B57" : "white",
									bgColor: activeTab === 0 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Stock Analysis
							</Tab>
							<Tab
								width="19%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 1 ? "#2E8B57" : "white",
									bgColor: activeTab === 1 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Stock Movement
							</Tab>
							<Tab
								width="19%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 2 ? "#2E8B57" : "white",
									bgColor: activeTab === 2 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Statistics
							</Tab>
						</TabList>

						{activeTab === 0 ? (
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
										value={search}
										mr={"5px"}
										w={"200px"}
										h={"30px"}
										border={"1px solid gray"}
										bgColor={"white"}
										placeholder="Enter a Product Name"
										{...customInputStyle}
										onChange={(e) => {
											setSearch(e.target.value);
											if (products.length === 0) {
												setIsSearchEmpty(true);
											} else {
												setIsSearchEmpty(false);
											}
										}}
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
										placeholder="All Categories"
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
                            <DateRangePicker
        ranges={[selectionRange]}
        onChange={() => {}}
      />
                            </TabPanel>
							<TabPanel key="statistics">
								<Stack align={"center"} overflowY={"auto"} height={"1000px"}>
									<CategoryDoughnutChart />
									<CategoryBarChart />
									<ViewCountBarChart />
									<ActiveProductsBarChart />
									<DeactivatedProductsBarChart />
									<DeletedProductsBarChart />
								</Stack>
							</TabPanel>
						</TabPanels>
					</Tabs>
					<Box position="absolute" bottom="-20" left="50%" transform="translateX(-50%)">
						Pagination Component If Any
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default StockReport;
