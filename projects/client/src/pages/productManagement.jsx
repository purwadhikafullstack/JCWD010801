import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import NoProduct from "../assets/public/404.png";
import { toast } from "react-toastify";
import {
	Box,
	Checkbox,
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
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { BiSort, BiCategoryAlt } from "react-icons/bi";
import { BsSortNumericDown, BsSortNumericUp } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { PiChartLineDown, PiChartLineUp } from "react-icons/pi";
import { RiScalesLine, RiScalesFill } from "react-icons/ri";
import { TbCategory2 } from "react-icons/tb";
import { Pagination } from "../components/navigation/pagination";
import { CreateCategory } from "../components/category/create";
import { ProductTabPanel } from "../views/ProductManagement/ProductTabPanel";
import { AddProduct } from "../components/modal/addProduct";
import { MoveCategories } from "../components/modal/moveCategories";
import { BulkDeactivate } from "../components/modal/bulkDeactivate";
import { BulkActivate } from "../components/modal/bulkActivate";
import { BulkDelete } from "../components/modal/bulkDelete";
import { sidebarEvent } from "../events/sidebarEvent";

const initialCheckboxState = {};

const ProductManagement = () => {
	const token = localStorage.getItem("token");
	const { id, username, lastName, gender, BranchId, RoleId } = useSelector((state) => state?.user?.value);
	const [products, setProducts] = useState([]);
	const [totalProductsAll, setTotalProductsAll] = useState(0);
	const [totalProductsActive, setTotalProductsActive] = useState(0);
	const [totalProductsDeactivated, setTotalProductsDeactivated] = useState(0);
	const [totalProductsDeleted, setTotalProductsDeleted] = useState(0);
	// eslint-disable-next-line
	const [itemLimit, setItemLimit] = useState(10);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [activeTab, setActiveTab] = useState(0);
	const [reload, setReload] = useState(false);
	const [reload2, setReload2] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("productName");
	const [sortOrder, setSortOrder] = useState("ASC");
	const [checkboxState, setCheckboxState] = useState(initialCheckboxState);
	const [branches, setBranches] = useState([]);
	const [isSearchEmpty, setIsSearchEmpty] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [marginStyles, setMarginStyles] = useState({
		marginLeftContainer: "168px",
		marginLeftHeading: "13px",
		marginLeftDescription: "15px",
	});

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
		fetchBranchData();
	}, [reload, reload2]);

	useEffect(() => {
		productCount();
	}, [reload, reload2, activeTab]);

	useEffect(() => {
		fetchDataAll(page);
		// eslint-disable-next-line
	}, [reload, search, sortOrder, selectedCategory, sortBy, totalPages, activeTab]);

	useEffect(() => {
		fetchDataAllAlt(page);
		// eslint-disable-next-line
	}, [reload2]);

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

	const fetchDataAll = async (pageNum) => {
		try {
			setIsLoading(true);
			let apiURL = "";

			if (activeTab === 0) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/alladmin?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			} else if (activeTab === 1) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/active?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			} else if (activeTab === 2) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/deactivated?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			} else {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/deleted?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			}

			if (selectedCategory) {
				apiURL += `&CategoryId=${selectedCategory}`;
			}
			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}
			const productsResponse = await Axios.get(apiURL);
			setProducts(productsResponse.data.result);
			if (products.length === 0) {
				setIsSearchEmpty(true);
			} else {
				setIsSearchEmpty(false);
			}
			setTotalPages(productsResponse.data.totalPages);
			const categoriesResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/admin?limit=50`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const categoryData = categoriesResponse.data.result.map((data) => ({
				label: data.category,
				value: data.id,
			}));
			setCategories(categoryData);
			if (activeTab === 0) {
				setTotalProductsAll(productsResponse.data.totalProducts);
			} else if (activeTab === 1) {
				setTotalProductsActive(productsResponse.data.totalProducts);
			} else if (activeTab === 2) {
				setTotalProductsDeactivated(productsResponse.data.totalProducts);
			} else {
				setTotalProductsDeleted(productsResponse.data.totalProducts);
			}
			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchDataAllAlt = async (pageNum) => {
		try {
			let apiURL = "";

			if (activeTab === 0) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/alladmin?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			} else if (activeTab === 1) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/active?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			} else if (activeTab === 2) {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/deactivated?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			} else {
				apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/deleted?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&BranchId=${BranchId}`;
			}

			if (selectedCategory) {
				apiURL += `&CategoryId=${selectedCategory}`;
			}
			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}
			const productsResponse = await Axios.get(apiURL);
			setProducts(productsResponse.data.result);
			if (products.length === 0) {
				setIsSearchEmpty(true);
			} else {
				setIsSearchEmpty(false);
			}
			setTotalPages(productsResponse.data.totalPages);
			const categoriesResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/admin?limit=50`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const categoryData = categoriesResponse.data.result.map((data) => ({
				label: data.category,
				value: data.id,
			}));
			setCategories(categoryData);
			if (activeTab === 0) {
				setTotalProductsAll(productsResponse.data.totalProducts);
			} else if (activeTab === 1) {
				setTotalProductsActive(productsResponse.data.totalProducts);
			} else if (activeTab === 2) {
				setTotalProductsDeactivated(productsResponse.data.totalProducts);
			} else {
				setTotalProductsDeleted(productsResponse.data.totalProducts);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchBranchData = async () => {
		try {
			const branchResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(branchResponse.data);
		} catch (error) {
			console.log(error);
		}
	};
	const currentBranchInfo = branches.find((branch) => branch.id === parseInt(BranchId));
	const currentBranchName = currentBranchInfo?.name;

	const productCount = async () => {
		try {
			const all = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/alladmin`);
			setTotalProductsAll(all.data.totalProducts);
			const active = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/active`);
			setTotalProductsActive(active.data.totalProducts);
			const deactivated = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/deactivated`);
			setTotalProductsDeactivated(deactivated.data.totalProducts);
			const deleted = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/deleted`);
			setTotalProductsDeleted(deleted.data.totalProducts);
		} catch (error) {
			console.log(error);
		}
	};

	const handleActivation = async (PID) => {
		try {
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/activation/${PID}`, { id: id });
			toast.success(`${response.data.message}`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			setReload2(!reload2);
		} catch (error) {
			toast.error(`${error.response.data.message}`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			setReload2(!reload2);
		}
	};

	const handleDelete = async (PID) => {
		try {
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/delete/${PID}`, { id: id });
			toast.warn(`${response.data.message}`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			setReload2(!reload2);
		} catch (error) {
			toast.error(`${error.response.data.message}`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			setReload2(!reload2);
		}
	};

	const nextPage = () => {
		if (page < totalPages) {
			setPage((prevPage) => +prevPage + 1);
			setCheckboxState(initialCheckboxState);
			setReload(!reload);
		}
	};

	const prevPage = () => {
		if (page > 1) {
			setPage((prevPage) => +prevPage - 1);
			setCheckboxState(initialCheckboxState);
			setReload(!reload);
		}
	};

	const goToPage = (page) => {
		setPage(page);
		setCheckboxState(initialCheckboxState);
		setReload(!reload);
	};

	const getCategoryLabel = (catId) => {
		const category = categories.find((category) => category.value === catId);
		return category ? category.label : "Category Missing!";
	};

	const toggleCheckbox = (PID) => {
		const updatedCheckboxState = { ...checkboxState };
		updatedCheckboxState[PID] = !updatedCheckboxState[PID];
		setCheckboxState(updatedCheckboxState);
	};

	const isChecked = (PID) => {
		if (checkboxState[PID]) {
			return true;
		} else {
			return false;
		}
	};

	const countTrueValues = (obj) => {
		const valuesArray = Object.values(obj);
		const trueValues = valuesArray.filter((value) => value === true);
		return trueValues.length;
	};

	const checkedCount = countTrueValues(checkboxState);

	const toggleAll = () => {
		const updatedCheckboxState = { ...checkboxState };
		const PIDs = products.filter((product) => !product.isDeleted && product.isActive).map((product) => product.id);

		if (PIDs.length === 0) {
			return;
		}

		const areAllChecked = PIDs.every((PID) => updatedCheckboxState[PID]);
		PIDs.forEach((PID) => {
			updatedCheckboxState[PID] = !areAllChecked;
		});
		setCheckboxState(updatedCheckboxState);
	};

	const selectedPIDs = Object.keys(checkboxState)
		.filter((PID) => checkboxState[PID])
		.map((PID) => parseInt(PID))
		.sort((a, b) => {
			const indexA = products.findIndex((product) => product.id === a);
			const indexB = products.findIndex((product) => product.id === b);
			return indexA - indexB;
		});

	const selectedProductNames = Object.keys(checkboxState)
		.filter((PID) => checkboxState[PID])
		.map((PID) => {
			const product = products.find((product) => product.id === Number(PID));
			return product ? product.productName : null;
		})
		.filter((productName) => productName !== null)
		.sort((a, b) => {
			const indexA = selectedPIDs.indexOf(products.find((product) => product.productName === a).id);
			const indexB = selectedPIDs.indexOf(products.find((product) => product.productName === b).id);
			return indexA - indexB;
		});

	const selectedHasActive = selectedPIDs.some((PID) => {
		const product = products.find((product) => product.id === PID);
		return product ? product.isActive === true : false;
	});

	const currentPagePIDs = products.filter((product) => !product.isDeleted).map((product) => product.id);

	const currentPageProductNames = products
		.filter((product) => !product.isDeleted)
		.map((product) => product.productName);

	const isAllActivated = products.every((product) => product.isActive);
	const isAllDeactivated = products.every((product) => !product.isActive);
	const isAllDeleted = products.every((product) => product.isDeleted);

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
						PRODUCT MANAGEMENT
					</Text>
					<Flex h={"50px"} w={"280px"} align={"center"} justifyContent={"space-between"} mr={"10px"}>
						{/* //! Sysadmin Re-Activation Button Goes Here */}
						<CreateCategory isText={true} />
						<AddProduct
							categories={categories}
							reload={reload}
							setReload={setReload}
							BranchId={BranchId}
							currentBranchName={currentBranchName}
							UID={id}
							RoleId={RoleId}
						/>
					</Flex>
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
					{RoleId !== 3 ? (
						<Text
							className="pm-d"
							textAlign={"left"}
							h={"25px"}
							w={"800px"}
							alignSelf={"center"}
							ml={marginStyles.marginLeftDescription}
						>
							You are currently managing AlphaMart products for the {currentBranchName} branch
						</Text>
					) : (
						<Text
							className="pm-d"
							textAlign={"left"}
							h={"25px"}
							w={"800px"}
							alignSelf={"center"}
							ml={marginStyles.marginLeftDescription}
						>
							You are currently managing AlphaMart products at the nationwide level
						</Text>
					)}
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
							setPage(1);
							setSortBy("productName");
							setSortOrder("ASC");
							setSelectedCategory("");
							setCheckboxState(initialCheckboxState);
							setSearch("");
							setIsSearchEmpty(false);
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
								All Products
								<Flex
									w={7}
									h={7}
									ml={"209px"}
									bg={activeTab === 0 ? "#519074" : "rgba(51, 50, 52, 1)"}
									border={"1px solid white"}
									rounded={"full"}
									justifyContent={"center"}
									alignItems={"center"}
									pos={"absolute"}
									top={0}
								>
									<Text fontSize={"12px"} color={activeTab === 0 ? "#EEB244" : "white"} textAlign={"center"}>
										{totalProductsAll}
									</Text>
								</Flex>
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
								Active Products
								<Flex
									w={7}
									h={7}
									ml={"209px"}
									bg={activeTab === 1 ? "#519074" : "rgba(51, 50, 52, 1)"}
									border={"1px solid white"}
									rounded={"full"}
									justifyContent={"center"}
									alignItems={"center"}
									pos={"absolute"}
									top={0}
								>
									<Text fontSize={"12px"} color={activeTab === 1 ? "#EEB244" : "white"} textAlign={"center"}>
										{totalProductsActive}
									</Text>
								</Flex>
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
								Deactivated Products
								<Flex
									w={7}
									h={7}
									ml={"209px"}
									bg={activeTab === 2 ? "#519074" : "rgba(51, 50, 52, 1)"}
									border={"1px solid white"}
									rounded={"full"}
									justifyContent={"center"}
									alignItems={"center"}
									pos={"absolute"}
									top={0}
								>
									<Text fontSize={"12px"} color={activeTab === 2 ? "#EEB244" : "white"} textAlign={"center"}>
										{totalProductsDeactivated}
									</Text>
								</Flex>
							</Tab>
							<Tab
								width="19%"
								variant="unstyled"
								fontWeight={"bold"}
								sx={{
									fontWeight: "bold",
									color: activeTab === 3 ? "#2E8B57" : "white",
									bgColor: activeTab === 3 ? "#7CB69D" : "rgba(51, 50, 52, 0.6)",
									borderRadius: "3px",
								}}
							>
								Deleted Products
								<Flex
									w={7}
									h={7}
									ml={"209px"}
									bg={activeTab === 3 ? "#519074" : "rgba(51, 50, 52, 1)"}
									border={"1px solid white"}
									rounded={"full"}
									justifyContent={"center"}
									alignItems={"center"}
									pos={"absolute"}
									top={0}
								>
									<Text fontSize={"12px"} color={activeTab === 3 ? "#EEB244" : "white"} textAlign={"center"}>
										{totalProductsDeleted}
									</Text>
								</Flex>
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
										setCheckboxState(initialCheckboxState);
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
										setPage(1);
										setCheckboxState(initialCheckboxState);
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
										setCheckboxState(initialCheckboxState);
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
										setCheckboxState(initialCheckboxState);
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
										setCheckboxState(initialCheckboxState);
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
										setCheckboxState(initialCheckboxState);
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
										setCheckboxState(initialCheckboxState);
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
										setCheckboxState(initialCheckboxState);
										setPage(1);
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
										setCheckboxState(initialCheckboxState);
										setPage(1);
									}}
									{...customRadioStyle}
									isDisabled={RoleId === 3}
								>
									B.Stock
								</Radio>
								<Radio
									size="sm"
									ml={"7px"}
									isChecked={sortBy === "createdAt"}
									borderColor={"gray"}
									onChange={() => {
										setSortBy("createdAt");
										setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
												setCheckboxState(initialCheckboxState);
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
								<Checkbox
									onChange={() => toggleAll()}
									isChecked={checkedCount > 0}
									colorScheme="green"
									iconColor="white"
									size={"lg"}
								/>
							</Flex>
							{checkedCount === 0 && !isAllDeactivated ? (
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
										<Text ml={"8px"} mr={"3px"}>
											PRODUCT INFO
										</Text>
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
										<Text ml={"8px"}>DESCRIPTION</Text>
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
										{!isAllDeactivated ? (
											<Text>{checkedCount}/10 Products Selected</Text>
										) : (
											<>
												<Stack>
													<Text>Process All Items</Text>
													<Text mt={"-15px"}>On Current Page</Text>
												</Stack>
											</>
										)}
									</Flex>
									<MoveCategories
										categories={categories}
										selectedPIDs={selectedPIDs}
										selectedProductNames={selectedProductNames}
										reload={reload}
										setReload={setReload}
										isAllDeactivated={isAllDeactivated}
										UID={id}
									/>
									<BulkActivate
										currentPagePIDs={currentPagePIDs}
										currentPageProductNames={currentPageProductNames}
										reload2={reload2}
										setReload2={setReload2}
										setCheckboxState={setCheckboxState}
										initialCheckboxState={initialCheckboxState}
										isAllActivated={isAllActivated}
										isAllDeleted={isAllDeleted}
										selectedHasActive={selectedHasActive}
									/>
									<BulkDeactivate
										selectedPIDs={selectedPIDs}
										selectedProductNames={selectedProductNames}
										reload2={reload2}
										setReload2={setReload2}
										setCheckboxState={setCheckboxState}
										initialCheckboxState={initialCheckboxState}
										isAllDeactivated={isAllDeactivated}
									/>
									<Box justify="center" w="2px" h="40px" bgColor="#C3C1C1" ml="25px" mr="15px" />
									<BulkDelete
										selectedPIDs={selectedPIDs}
										selectedProductNames={selectedProductNames}
										reload2={reload2}
										setReload2={setReload2}
										setCheckboxState={setCheckboxState}
										initialCheckboxState={initialCheckboxState}
										isAllDeactivated={isAllDeactivated}
										isAllDeleted={isAllDeleted}
									/>
								</Flex>
							)}
						</Flex>
						<Flex w={"1225px"} h={"25px"} align="center" fontWeight="bold" borderBottom="2px ridge #39393C">
							{checkedCount === 0 && !isAllDeactivated ? (
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
										<BiSort
											size={18}
											color="#3E3D40"
											cursor="pointer"
											onClick={() => {
												setSortBy("aggregateStock");
												setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
											}}
										/>
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
										{RoleId !== 3 ? (
											<BiSort
												size={18}
												color="#3E3D40"
												cursor="pointer"
												onClick={() => {
													setSortBy("branchStock");
													setSortOrder((prevSortOrder) => (prevSortOrder === "ASC" ? "DESC" : "ASC"));
												}}
											/>
										) : null}
									</Flex>
								</>
							) : null}
						</Flex>
						<TabPanels ml={"-15px"}>
							<TabPanel key="all">
								{isSearchEmpty ? (
									<Flex w={"1225px"} h={"300px"} align={"center"} borderBottom={"1px solid black"} borderRadius={"5px"}>
										<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
									</Flex>
								) : (
									products?.map((data, index, array) => {
										const isLastItem = index === array.length - 1;
										const isEvenIndex = index % 2 === 0;
										return (
											<ProductTabPanel
												id={id}
												key={data.id}
												data={data}
												isLastItem={isLastItem}
												isChecked={isChecked}
												toggleCheckbox={toggleCheckbox}
												categories={categories}
												getCategoryLabel={getCategoryLabel}
												handleActivation={handleActivation}
												handleDelete={handleDelete}
												reload={reload}
												setReload={setReload}
												setCheckboxState={setCheckboxState}
												initialCheckboxState={initialCheckboxState}
												BranchId={BranchId}
												currentBranchName={currentBranchName}
												isLoading={isLoading}
												isEvenIndex={isEvenIndex}
											/>
										);
									})
								)}
							</TabPanel>
							<TabPanel key="active">
								{isSearchEmpty ? (
									<Flex w={"1225px"} h={"300px"} align={"center"} borderBottom={"1px solid black"} borderRadius={"5px"}>
										<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
									</Flex>
								) : (
									products?.map((data, index, array) => {
										const isLastItem = index === array.length - 1;
										const isEvenIndex = index % 2 === 0;
										return (
											<ProductTabPanel
												id={id}
												key={data.id}
												data={data}
												isLastItem={isLastItem}
												isChecked={isChecked}
												toggleCheckbox={toggleCheckbox}
												categories={categories}
												getCategoryLabel={getCategoryLabel}
												handleActivation={handleActivation}
												handleDelete={handleDelete}
												reload={reload}
												setReload={setReload}
												setCheckboxState={setCheckboxState}
												initialCheckboxState={initialCheckboxState}
												BranchId={BranchId}
												currentBranchName={currentBranchName}
												isLoading={isLoading}
												isEvenIndex={isEvenIndex}
											/>
										);
									})
								)}
							</TabPanel>
							<TabPanel key="deactivated">
								{isSearchEmpty ? (
									<Flex w={"1225px"} h={"300px"} align={"center"} borderBottom={"1px solid black"} borderRadius={"5px"}>
										<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
									</Flex>
								) : (
									products?.map((data, index, array) => {
										const isLastItem = index === array.length - 1;
										const isEvenIndex = index % 2 === 0;
										return (
											<ProductTabPanel
												id={id}
												key={data.id}
												data={data}
												isLastItem={isLastItem}
												isChecked={isChecked}
												toggleCheckbox={toggleCheckbox}
												categories={categories}
												getCategoryLabel={getCategoryLabel}
												handleActivation={handleActivation}
												handleDelete={handleDelete}
												reload={reload}
												setReload={setReload}
												setCheckboxState={setCheckboxState}
												initialCheckboxState={initialCheckboxState}
												BranchId={BranchId}
												currentBranchName={currentBranchName}
												isLoading={isLoading}
												isEvenIndex={isEvenIndex}
											/>
										);
									})
								)}
							</TabPanel>
							<TabPanel key="deleted">
								{isSearchEmpty ? (
									<Flex w={"1225px"} h={"300px"} align={"center"} borderBottom={"1px solid black"} borderRadius={"5px"}>
										<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
									</Flex>
								) : (
									products?.map((data, index, array) => {
										const isLastItem = index === array.length - 1;
										const isEvenIndex = index % 2 === 0;
										return (
											<ProductTabPanel
												id={id}
												key={data.id}
												data={data}
												isLastItem={isLastItem}
												isChecked={isChecked}
												toggleCheckbox={toggleCheckbox}
												categories={categories}
												getCategoryLabel={getCategoryLabel}
												handleActivation={handleActivation}
												handleDelete={handleDelete}
												reload={reload}
												setReload={setReload}
												setCheckboxState={setCheckboxState}
												initialCheckboxState={initialCheckboxState}
												BranchId={BranchId}
												currentBranchName={currentBranchName}
												isLoading={isLoading}
												isEvenIndex={isEvenIndex}
											/>
										);
									})
								)}
							</TabPanel>
						</TabPanels>
					</Tabs>
					<Box position="absolute" bottom="-20" left="50%" transform="translateX(-50%)">
						<Pagination
							page={page}
							totalPages={totalPages}
							prevPage={prevPage}
							nextPage={nextPage}
							goToPage={goToPage}
							lastPage={totalPages}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ProductManagement;
