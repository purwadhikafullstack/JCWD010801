import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Checkbox,
	Flex,
	Image,
	Input,
	Radio,
	Select,
	Switch,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/navigation/navbar";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { ButtonTemp } from "../components/button";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { BiSort, BiCategoryAlt } from "react-icons/bi";
import { BsSortNumericDown, BsSortNumericUp } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { PiChartLineDown, PiChartLineUp } from "react-icons/pi";
import { RiScalesLine, RiScalesFill } from "react-icons/ri";
import { TbTrashX, TbCategory2 } from "react-icons/tb";
import { TiDelete } from "react-icons/ti";
import { Pagination } from "../components/navigation/pagination";
import { useSelector } from "react-redux";

const initialCheckboxState = {};

const ProductManagement = () => {
	const { username, lastName, gender } = useSelector((state) => state?.user?.value);
	const [products, setProducts] = useState([]);
	const [totalProductsAll, setTotalProductsAll] = useState(0);
	const [totalProductsActive, setTotalProductsActive] = useState(0);
	const [totalProductsDeactivated, setTotalProductsDeactivated] = useState(0);
	const [itemLimit, setItemLimit] = useState(10);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [checked, setChecked] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [isSwitchChecked, setIsSwitchChecked] = useState(true);
	const [reload, setReload] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("productName");
	const [sortOrder, setSortOrder] = useState("ASC");
	const [checkboxState, setCheckboxState] = useState(initialCheckboxState);
	const checkboxStateRef = useRef(initialCheckboxState);
	const navigate = useNavigate();
	let user = "";
	if (gender !== null) {
		if (gender === "male") {
			user = `Mr. ${lastName}`;
		} else {
			user = `Ms. ${lastName}`;
		}
	} else {
		user = username;
	}

	useEffect(() => {
		productCount();
	}, []);

	// useEffect(() => {
	// 	setCheckboxState(checkboxStateRef.current);
	//   }, []);

	useEffect(() => {
		fetchDataAll(page);
		// eslint-disable-next-line
	}, [reload, search, sortOrder, selectedCategory, sortBy, totalPages, activeTab]);

	const fetchDataAll = async (pageNum) => {
		try {
			let apiURL = "";

			if (activeTab === 0) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/alladmin?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
			} else if (activeTab === 1) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/active?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
			} else {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/deactivated?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
			}

			if (selectedCategory) {
				apiURL += `&CategoryId=${selectedCategory}`;
			}
			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}
			const productsResponse = await Axios.get(apiURL);
			setProducts(productsResponse.data.result);
			setTotalPages(productsResponse.data.totalPages);
			const categoriesResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/user`);
			const categoryData = categoriesResponse.data.result.map((data) => ({
				label: data.category,
				value: data.id,
			}));
			setCategories(categoryData);
			if (activeTab === 0) {
				setTotalProductsAll(productsResponse.data.totalProducts);
			} else if (activeTab === 1) {
				setTotalProductsActive(productsResponse.data.totalProducts);
			} else {
				setTotalProductsDeactivated(productsResponse.data.totalProducts);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const productCount = async () => {
		try {
			const all = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/alladmin`);
			setTotalProductsActive(all.data.totalProducts);
			const active = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/active`);
			setTotalProductsActive(active.data.totalProducts);
			const deactivated = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/deactivated`);
			setTotalProductsDeactivated(deactivated.data.totalProducts);
		} catch (error) {
			console.log(error);
		}
	};

	//!
	const handleCheckboxChange = (PID) => {
		const updatedCheckboxState = { ...checkboxState };
		updatedCheckboxState[PID] = !updatedCheckboxState[PID];
		setCheckboxState(updatedCheckboxState);
	};
	//!
	const toggleCheckbox = (PID) => {
		checkboxStateRef.current[PID] = !checkboxStateRef.current[PID];
		setReload(!reload);
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
			<Navbar />
			<AdminSidebar height="90vh" navSizeProp="large" />
			<Box ml={"168px"} h={"200vh"}>
				<Flex h={"100px"} alignItems={"center"} justifyContent={"space-between"}>
					<Text
						textAlign={"left"}
						h={"50px"}
						w={"350px"}
						fontSize={"30px"}
						fontWeight={"bold"}
						alignSelf={"center"}
						ml={"15px"}
					>
						Product Management
					</Text>
					<Flex h={"50px"} w={"280px"} align={"center"} justifyContent={"space-between"} mr={"10px"}>
						<ButtonTemp content={"Add Category"} />
						<ButtonTemp content={"Add Product"} />
					</Flex>
				</Flex>
				<Flex h={"25px"}>
					<Text
						textAlign={"left"}
						h={"25px"}
						w={"700px"}
						fontSize={"18px"}
						fontFamily={"monospace"}
						alignSelf={"center"}
						ml={"15px"}
					>
						Welcome {user}.
					</Text>
				</Flex>
				<Flex h={"25px"}>
					<Text
						textAlign={"left"}
						h={"25px"}
						w={"700px"}
						fontSize={"18px"}
						fontFamily={"monospace"}
						alignSelf={"center"}
						ml={"15px"}
					>
						You are currently managing AlphaMart products for the #Branch branch
					</Text>
				</Flex>
				<Box w={"1250px"} h={"160vh"} m={"5px"} py={"5px"} border={"1px solid #39393C"} borderRadius={"10px"}>
					<Tabs value={activeTab} onChange={(index) => setActiveTab(index)} w="1225px" align="left">
						<TabList>
							<Tab
								width="18%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 0 ? "#2E8B57" : "white",
									bgColor: activeTab === 0 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								All Products ({totalProductsAll})
							</Tab>
							<Tab
								width="18%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 1 ? "#2E8B57" : "white",
									bgColor: activeTab === 1 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Active Products ({totalProductsActive})
							</Tab>
							<Tab
								width="18%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 2 ? "#2E8B57" : "white",
									bgColor: activeTab === 2 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Deactivated Produts ({totalProductsDeactivated})
							</Tab>
						</TabList>
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
										setPage(1);
										setSearch(e.target.value);
									}}
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
							<Flex w={"210px"} h={"45px"} justify="left" align={"center"} fontWeight="bold" ml={"10px"}>
								<Select
									placeholder="All Categories"
									value={selectedCategory.toString()}
									onChange={(e) => {
										const selectedValue = parseInt(e.target.value, 10);
										setSelectedCategory(isNaN(selectedValue) ? "" : selectedValue);
										setPage(1);
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
									isChecked={sortBy === "productName"}
									borderColor={"gray"}
									onChange={() => {
										setSortBy("productName");
										setPage(1);
									}}
									{...customRadioStyle}
								>
									Alphabetical
								</Radio>
								<Radio
									size="sm"
									ml={"7px"}
									isChecked={sortBy === "price"}
									borderColor={"gray"}
									onChange={() => {
										setSortBy("price");
										setPage(1);
									}}
									{...customRadioStyle}
								>
									Price
								</Radio>
								<Radio
									size="sm"
									ml={"7px"}
									isChecked={sortBy === "weight"}
									borderColor={"gray"}
									onChange={() => {
										setSortBy("weight");
										setPage(1);
									}}
									{...customRadioStyle}
								>
									Weight
								</Radio>
								<Radio
									size="sm"
									ml={"7px"}
									isChecked={sortBy === "CategoryId"}
									borderColor={"gray"}
									onChange={() => {
										setSortBy("CategoryId");
										setPage(1);
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
										setPage(1);
									}}
									{...customRadioStyle}
								>
									N.Stock
								</Radio>
								<Radio
									size="sm"
									ml={"7px"}
									isChecked={sortBy === "branchStock"} //! REMINDER TO UPDATE CONTROLLER.
									borderColor={"gray"}
									onChange={() => {
										setSortBy("branchStock");
										setPage(1);
									}}
									{...customRadioStyle}
								>
									B.Stock
								</Radio>
								<Radio
									size="sm"
									labelProps={{ fontSize: "5px" }}
									ml={"7px"}
									isChecked={sortBy === "createdAt"}
									borderColor={"gray"}
									onChange={() => {
										setSortBy("createdAt");
										setPage(1);
									}}
									{...customRadioStyle}
								>
									Listing Time
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
								{sortBy === "productName" && (
									<>
										<Radio
											borderColor={"gray"}
											isChecked={sortOrder === "ASC"}
											onChange={() => {
												setSortOrder("ASC");
											}}
											{...customRadioStyle}
										>
											<AiOutlineSortAscending size={30} />
										</Radio>
										<Radio
											borderColor={"gray"}
											isChecked={sortOrder === "DESC"}
											onChange={() => {
												setSortOrder("DESC");
											}}
											{...customRadioStyle}
										>
											<AiOutlineSortDescending size={30} />
										</Radio>
									</>
								)}
								{sortBy === "price" && (
									<>
										<Radio
											borderColor={"gray"}
											isChecked={sortOrder === "ASC"}
											onChange={() => {
												setSortOrder("ASC");
											}}
											{...customRadioStyle}
										>
											<BsSortNumericDown size={28} />
										</Radio>
										<Radio
											borderColor={"gray"}
											isChecked={sortOrder === "DESC"}
											onChange={() => {
												setSortOrder("DESC");
											}}
											{...customRadioStyle}
										>
											<BsSortNumericUp size={28} />
										</Radio>
									</>
								)}
								{sortBy === "weight" && (
									<>
										<Radio
											borderColor={"gray"}
											isChecked={sortOrder === "ASC"}
											onChange={() => {
												setSortOrder("ASC");
											}}
											{...customRadioStyle}
										>
											<RiScalesLine size={25} />
										</Radio>
										<Radio
											borderColor={"gray"}
											isChecked={sortOrder === "DESC"}
											onChange={() => {
												setSortOrder("DESC");
											}}
											{...customRadioStyle}
										>
											<RiScalesFill size={25} />
										</Radio>
									</>
								)}
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
						<Flex w={"1230px"} h={"50px"} align="top" fontWeight="bold" p={1}>
							<Flex w={"16px"} h={"40px"} justify={"center"} align={"center"}>
								<Checkbox onChange={handleCheckboxChange} colorScheme="green" iconColor="white" size={"lg"} />
							</Flex>
							{!checked ? (
								<>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"250px"}
										h={"40px"}
										ml={"5px"}
										justify={"left"}
										align={"center"}
									>
										<Text mr={"3px"}>PRODUCT INFO</Text>
										<BiSort
											size={20}
											color="#3E3D40"
											cursor="pointer"
											onClick={() => {
												setSortBy("productName");
												setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
											}}
										/>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"250px"}
										h={"40px"}
										ml={"5px"}
										justify={"left"}
										align={"center"}
									>
										<Text>DESCRIPTION</Text>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"100px"}
										h={"40px"}
										ml={"5px"}
										justify={"center"}
										align={"center"}
									>
										<Text mr={"3px"}>PRICE</Text>
										<BiSort
											size={20}
											color="#3E3D40"
											cursor="pointer"
											onClick={() => {
												setSortBy("price");
												setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
											}}
										/>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"85px"}
										h={"40px"}
										ml={"5px"}
										justify={"center"}
										align={"center"}
									>
										<Text mr={"1px"}>WEIGHT</Text>
										<BiSort
											size={20}
											color="#3E3D40"
											cursor="pointer"
											onClick={() => {
												setSortBy("weight");
												setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
											}}
										/>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"120px"}
										h={"40px"}
										ml={"5px"}
										justify={"center"}
										align={"center"}
									>
										<Text>CATEGORY</Text>
										<BiSort
											size={20}
											color="#3E3D40"
											cursor="pointer"
											onClick={() => {
												setSortBy("CategoryId");
												setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
											}}
										/>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"225px"}
										h={"40px"}
										ml={"5px"}
										justify={"center"}
										align={"center"}
									>
										<Text>STOCK</Text>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"65px"}
										h={"40px"}
										ml={"5px"}
										justify={"center"}
										align={"center"}
									>
										<Text>STATUS</Text>
									</Flex>
									<Flex
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"5px"}
										w={"70px"}
										h={"40px"}
										ml={"5px"}
										justify={"center"}
										align={"center"}
									>
										<Text>MANAGE</Text>
									</Flex>
								</>
							) : (
								<Flex align={"center"}>
									<Flex w={"225px"} h={"40px"} ml={"15px"} justify={"left"} align={"center"}>
										<Text>#/# Products Selected</Text>
									</Flex>
									<ButtonTemp content={"Move Categories"} ml="15px" />
									<ButtonTemp content={"Deactivate"} ml="15px" />
									<Box justify="center" w="2px" h="40px" bgColor="#C3C1C1" ml="25px" mr="15px" />
									<TbTrashX size={40} />
								</Flex>
							)}
						</Flex>
						<Flex w={"1225px"} h={"25px"} align="center" fontWeight="bold" borderBottom="2px ridge #39393C">
							{!checked ? (
								<>
									<Flex
										w={"109px"}
										h={"20px"}
										ml={"855px"}
										justify={"center"}
										borderLeft={"1px solid #3E3D40"}
										borderRight={"1px solid #3E3D40"}
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"3px"}
									>
										<Text fontSize={"12px"} mr={"3px"}>
											NATIONWIDE
										</Text>
										<BiSort size={18} color="#3E3D40" />
									</Flex>
									<Flex
										w={"109px"}
										h={"20px"}
										ml={"8px"}
										justify={"center"}
										borderLeft={"1px solid #3E3D40"}
										borderRight={"1px solid #3E3D40"}
										bgColor={"rgba(57, 57, 60, 0.1)"}
										borderRadius={"3px"}
									>
										<Text fontSize={"12px"} mr={"3px"}>
											BRANCH
										</Text>
										<BiSort size={18} color="#3E3D40" />
									</Flex>
								</>
							) : null}
						</Flex>
						<TabPanels ml={"-15px"}>
							<TabPanel key={"all"}>
								{products?.map((data, index, array) => {
									const isLastItemOnPage = index === array.length - 1;
									return (
										<Flex
											key={data.id}
											w={"1225px"}
											h={"100px"}
											align={"center"}
											borderBottom={isLastItemOnPage ? "none" : "1px solid black"}
										>
											<Flex w={"22px"} h={"75px"} justify={"center"} align={"center"}>
												<Checkbox
													checked={checkboxState[data.id] || false}
													onChange={() => toggleCheckbox(data.id)}
													colorScheme="green"
													iconColor="white"
													size={"lg"}
												/>
											</Flex>
											<Flex w={"75px"} h={"75px"} justify={"center"} align={"center"} ml={"3px"}>
												<Image
													src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
													alt={data.productName}
													cursor={"pointer"}
													onClick={() => navigate(`/product/${data.id}`)}
													boxSize="75px"
													objectFit="cover"
												/>
											</Flex>
											<Flex
												className="scrollbar-4px"
												w={"173px"}
												h={"75px"}
												justify={"left"}
												align={"center"}
												ml={"1px"}
												overflow={"auto"}
												overflowX={"hidden"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.2)"}
												borderRadius={"5px"}
											>
												<Text p={"3px"} onClick={() => navigate(`/product/${data.id}`)} cursor={"pointer"}>
													{data.productName}
												</Text>
											</Flex>
											<Flex
												className="scrollbar-4px"
												w={"249px"}
												h={"75px"}
												justify={"left"}
												align={"center"}
												ml={"6px"}
												overflow={"auto"}
												overflowX={"hidden"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.1)"}
												borderRadius={"5px"}
											>
												<Text p={"3px"}>{data.description}</Text>
											</Flex>
											<Flex
												w={"100px"}
												h={"75px"}
												justify={"center"}
												align={"center"}
												textAlign={"center"}
												ml={"5px"}
												overflow={"auto"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.2)"}
												borderRadius={"5px"}
											>
												<Text>Rp. {data.price.toLocaleString("id-ID")}</Text>
											</Flex>
											<Flex
												w={"85px"}
												h={"75px"}
												justify={"center"}
												align={"center"}
												textAlign={"center"}
												ml={"5px"}
												overflow={"auto"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.1)"}
												borderRadius={"5px"}
											>
												<Text>{(data.weight / 1000).toFixed(2)} Kg</Text>
											</Flex>
											<Flex
												w={"120px"}
												h={"75px"}
												justify={"center"}
												align={"center"}
												textAlign={"center"}
												ml={"5px"}
												overflow={"auto"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.2)"}
												borderRadius={"5px"}
											>
												<Text>{getCategoryLabel(data.CategoryId)}</Text>
											</Flex>
											<Flex
												w={"109px"}
												h={"75px"}
												justify={"center"}
												align={"center"}
												textAlign={"center"}
												ml={"5px"}
												overflow={"auto"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.1)"}
												borderRadius={"5px"}
											>
												<Text>{data.aggregateStock} Units</Text>
											</Flex>
											<Flex
												w={"109px"}
												h={"75px"}
												justify={"center"}
												align={"center"}
												textAlign={"center"}
												ml={"8px"}
												overflow={"auto"}
												overflowWrap={"break-word"}
												bgColor={"rgba(51, 50, 52, 0.2)"}
												borderRadius={"5px"}
											>
												<Text>{data.aggregateStock} Units</Text>
											</Flex>
											<Flex w={"64px"} h={"75px"} justify={"center"} align={"center"} ml={"5px"}>
												<Switch
													size="lg"
													isChecked={isSwitchChecked}
													onChange={() => {
														setIsSwitchChecked(!isSwitchChecked);
													}}
												/>
											</Flex>
											<Flex w={"71px"} h={"75px"} justify={"space-around"} align={"center"} ml={"5px"}>
												<FiEdit size={28} />
												<TiDelete size={40} color="#800808" />
											</Flex>
										</Flex>
									);
								})}
							</TabPanel>
						</TabPanels>
					</Tabs>
					<Flex justifyContent={"center"} gap={"50px"} my={"35px"}>
						<Pagination
							page={page}
							totalPages={totalPages}
							prevPage={prevPage}
							nextPage={nextPage}
							goToPage={goToPage}
							lastPage={totalPages}
						/>
					</Flex>
				</Box>
			</Box>
		</Box>
	);
};

export default ProductManagement;
