import Axios from "axios";
import {
	Box,
	Checkbox,
	Flex,
	Input,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Pagination } from "../components/navigation/pagination";
import { Navbar } from "../components/navigation/navbar";
import { AdminSidebar } from "../components/navigation/adminSidebar";
import { ButtonTemp } from "../components/button";
import { FaSearch, FaTrash } from "react-icons/fa";
import { TbTrashX } from "react-icons/tb";
import { CheckIcon } from "@chakra-ui/icons";

const ProductManagement = () => {
	const [products, setProducts] = useState([]);
	const [itemLimit, setItemLimit] = useState(15);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [checked, setChecked] = useState(false);
	const [reload, setReload] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("productName");
	const [sortOrder, setSortOrder] = useState("ASC");
	const navigate = useNavigate();

	useEffect(() => {
		fetchData(page);
	}, [reload, search, sortOrder, selectedCategory, sortBy, totalPages]);

	const fetchData = async (pageNum) => {
		try {
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/all?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;

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
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckboxClick = () => {
		setChecked(!checked);
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

	const productDetail = (id) => {
		navigate(`/product/${id}`);
	};

	const tabStyles = useColorModeValue(
		{
			_selected: {
				color: "gray.900",
				borderColor: "gray.900",
				bg: "transparent",
			},
		},
		{
			_selected: {
				color: "gray.900", //DARK MODE.
				borderColor: "gray.900",
				bg: "transparent",
			},
		}
	);

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

	return (
		<Box w={"100%"} h={"100%"} align={"center"} justify={"center"}>
			<Navbar />
			<AdminSidebar height="90vh" navSizeProp="large" />
			<Box ml={"168px"} h={"130vh"}>
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
						fontFamily={'monospace'}
						alignSelf={"center"}
						ml={"15px"}
					>
						Welcome #Administrator
					</Text>
				</Flex>
				<Flex h={"25px"}>
					<Text
						textAlign={"left"}
						h={"25px"}
						w={"700px"}
						fontSize={"18px"}
						fontFamily={'monospace'}
						alignSelf={"center"}
						ml={"15px"}
					>
						You are currently managing AlphaMart products for the #Branch branch
					</Text>
				</Flex>
				<Box w={"1250px"} h={"110vh"} m={"5px"} py={"5px"} border={"1px solid #39393C"} borderRadius={"10px"}>
					<Tabs w="1225px" align="left">
						<TabList>
							<Tab width="16%" variant="unstyled" sx={tabStyles} fontWeight={"bold"}>
								All Products
							</Tab>
							<Tab width="16%" variant="unstyled" sx={tabStyles} fontWeight={"bold"}>
								Active Products
							</Tab>
							<Tab width="16%" variant="unstyled" sx={tabStyles} fontWeight={"bold"}>
								Deactivated Produts
							</Tab>
						</TabList>

						<Flex w={"1225px"} h={"45px"} bgColor="yellow" align="center" fontWeight="bold" mb={"2px"}>
							<Flex w={"250px"} h={"45px"} bgColor="red" align="center" fontWeight="bold">
								<Input
									type="search"
									value={search}
									ml={"4px"}
									mr={"10px"}
									w={"200px"}
									h={"30px"}
									border={"1px solid gray"}
									bgColor={"white"}
									placeholder="Enter a Product Name"
									{...customInputStyle}
									onChange={(e) => {
										// setPage(1);
										// setSearch(e.target.value);
									}}
								/>
								<FaSearch size={20} onClick={""} style={{ cursor: "pointer" }} />
							</Flex>
						</Flex>
						<Flex w={"1230px"} h={"50px"} align="top" fontWeight="bold" p={1}>
							<Flex w={"16px"} h={"40px"} justify={"center"} align={"center"}>
								<Checkbox onChange={handleCheckboxClick} colorScheme="green" iconColor="white" size={"lg"} />
							</Flex>
							{!checked ? (
								<>
									<Flex bgColor={"yellow"} w={"250px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
										<Text>PRODUCT INFO</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"250px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
										<Text>DESCRIPTION</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"100px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
										<Text>PRICE</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"100px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
										<Text>WEIGHT</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"100px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
										<Text>CATEGORY</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"225px"} h={"40px"} ml={"5px"} justify={"center"} align={"center"}>
										<Text>STOCK</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"65px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
										<Text>STATUS</Text>
									</Flex>
									<Flex bgColor={"yellow"} w={"75px"} h={"40px"} ml={"5px"} justify={"left"} align={"center"}>
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

						<Flex
							w={"1225px"}
							h={"25px"}
							bgColor="green"
							align="top"
							fontWeight="bold"
							borderBottom="2px ridge #39393C"
						>
							{!checked ? (
								<>
									<Flex bgColor={"yellow"} w={"109px"} h={"20px"} ml={"850px"} justify={"center"} align={"top"}>
										<Text fontSize={"12px"}>NATIONWIDE</Text>
									</Flex>
									<Flex bgColor={"white"} w={"109px"} h={"20px"} ml={"8px"} justify={"center"} align={"top"}>
										<Text fontSize={"12px"}>BRANCH</Text>
									</Flex>
								</>
							) : null}
						</Flex>
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
