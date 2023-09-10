import Axios from "axios";
import { Box, Flex, Input, Radio, RadioGroup, Stack, Image, Select, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Pagination } from "../components/navigation/pagination";
import { useMediaQuery } from "react-responsive";
import { FaSearch } from "react-icons/fa";

const Search = () => {
	const [products, setProducts] = useState([]);
	const [itemLimit, setItemLimit] = useState(15);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [reload, setReload] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("productName");
	const [sortOrder, setSortOrder] = useState("ASC");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		fetchData(page);
		// eslint-disable-next-line
	}, [reload, search, sortOrder, selectedCategory, sortBy, totalPages]);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const searchParam = queryParams.get("q") || "";
		const sortByParam = queryParams.get("sort") || "productName";
		const sortOrderParam = queryParams.get("order") || "ASC";
		const categoryParam = queryParams.get("cat") || "";
		const pageParam = queryParams.get("p") || 1;

		setSearch(searchParam);
		setSortBy(sortByParam);
		setSortOrder(sortOrderParam);
		setSelectedCategory(categoryParam);
		setPage(pageParam);
	}, [location.search]);

	const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
	useEffect(() => {
		if (isMobile) {
			setItemLimit(5);
			setReload(!reload);
		} else {
			setItemLimit(15);
			setReload(!reload);
		}
		// eslint-disable-next-line
	}, [isMobile]);

	const mobileResOnMount = () => {
		if (isMobile) {
			setItemLimit(5);
			setReload(!reload);
		}
	};

	useEffect(() => {
		mobileResOnMount();
		// eslint-disable-next-line
	}, []);

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
			// setPage(productsResponse.data.currentPage);
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

	const handleSearch = () => {
		const newSearchParams = new URLSearchParams();
		newSearchParams.set("q", search);
		newSearchParams.set("sort", sortBy);
		newSearchParams.set("order", sortOrder);
		newSearchParams.set("cat", selectedCategory);
		newSearchParams.set("p", page);
		navigate(`?${newSearchParams.toString()}`);
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
		<Box w={"100vw"}>
			{isMobile ? (
				//! MOBILE DISPLAY
				<Center flexDirection="column" h="150vh" w="100%">
					<Box
						bgColor={"#F0F0F0"}
						mt={"15px"}
						borderRadius={"10px"}
						boxShadow={"0px 0px 5px gray"}
						w={"90%"}
						p={4}
						position="relative"
					>
						<Box mb={2} fontSize={"18px"} color={"gray"} textAlign={"center"}>
							Search For Products
						</Box>
						<Input
							type="search"
							value={search}
							onChange={(e) => {
								setPage(1);
								setSearch(e.target.value);
							}}
							w={"100%"}
							h={"30px"}
							borderColor={"gray"}
							bgColor={"white"}
							placeholder="Enter a Product Name"
							{...customInputStyle}
						/>
						<Box mt={2} p={2} borderColor={"gray.400"}>
							<Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
								Sort by
							</Box>
							<RadioGroup
								borderBottom={"1px solid"}
								borderColor={"gray.400"}
								pb={"20px"}
								onChange={(value) => setSortBy(value)}
								value={sortBy}
							>
								<Stack color={"gray"}>
									<Radio
										isChecked={sortBy === "productName"}
										borderColor={"gray"}
										onChange={(e) => {
											setSortBy("productName");
										}}
										{...customRadioStyle}
									>
										Alphabetical
									</Radio>
									<Radio
										isChecked={sortBy === "price"}
										borderColor={"gray"}
										onChange={(e) => {
											setSortBy("price");
										}}
										{...customRadioStyle}
									>
										Price
									</Radio>
									<Radio
										isChecked={sortBy === "createdAt"}
										borderColor={"gray"}
										onChange={(e) => {
											setSortBy("createdAt");
										}}
										{...customRadioStyle}
									>
										Listing Time
									</Radio>
								</Stack>
							</RadioGroup>
						</Box>
						<Box p={2} borderColor={"gray.400"}>
							<Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
								Order by
							</Box>
							<RadioGroup
								onChange={(value) => setSortOrder(value)}
								value={sortOrder}
								borderBottom={"1px solid"}
								borderColor={"gray.400"}
								pb={"20px"}
							>
								<Stack color={"gray"}>
									{sortBy === "productName" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={(e) => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												A - Z
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={(e) => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												Z - A
											</Radio>
										</>
									)}
									{sortBy === "price" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={(e) => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												Cheapest
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={(e) => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												Premium
											</Radio>
										</>
									)}
									{sortBy === "createdAt" && (
										<>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "ASC"}
												onChange={(e) => {
													setSortOrder("ASC");
												}}
												{...customRadioStyle}
											>
												Oldest
											</Radio>
											<Radio
												borderColor={"gray"}
												isChecked={sortOrder === "DESC"}
												onChange={(e) => {
													setSortOrder("DESC");
												}}
												{...customRadioStyle}
											>
												Newest
											</Radio>
										</>
									)}
								</Stack>
							</RadioGroup>
						</Box>
						<Box p={2}>
							<Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
								Product Categories
							</Box>
							<Select
								mt={"10px"}
								placeholder="All Categories"
								value={selectedCategory.toString()}
								onChange={(e) => {
									setSelectedCategory(Number.isNaN(e.target.value) ? "" : parseInt(e.target.value, 10));
									setPage(1);
									setReload(!reload);
								}}
								w={"100%"}
								h={"30px"}
								borderColor={"gray"}
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
						</Box>
					</Box>
					<Box mt={4} flex="1" overflowY="auto" width="90%">
						{products?.map((data) => (
							<Box
								key={data.id}
								display="flex"
								flexDirection="column"
								cursor={"pointer"}
								boxShadow={"0px 0px 5px gray"}
								borderRadius={"10px"}
								mb={2}
								onClick={() => productDetail(data.id)}
							>
								<Box h={"165px"}>
									<Image
										borderTopRadius={"9px"}
										w={"100%"}
										h={"100%"}
										src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
									/>
								</Box>
								<Box
									flex="1"
									display="flex"
									flexDirection="column"
									borderBottomRadius={"10px"}
									textShadow={"0px 0px 1px gray"}
									justifyContent={"center"}
									fontFamily={"revert"}
									bgColor={"#F0F0F0"}
									color={"gray.700"}
									pt={"10px"}
									pb={"25px"}
									whiteSpace="nowrap"
									overflow="hidden"
									textOverflow="ellipsis"
								>
									<Box
										color={"gray.700"}
										mb={1}
										textAlign={"center"}
										fontWeight={"bold"}
										fontSize={"16px"}
										overflow="hidden"
										textOverflow="ellipsis"
									>
										{data.productName}
									</Box>
									<Box
										color={"gray.700"}
										textAlign={"center"}
										fontSize={"15px"}
										overflow="hidden"
										textOverflow="ellipsis"
									>
										Rp. {data.price.toLocaleString("id-ID")}
									</Box>
								</Box>
							</Box>
						))}
					</Box>
					<Center justifyContent={"center"} mt={4} mb={4}>
						<Pagination
							page={page}
							totalPages={totalPages}
							prevPage={prevPage}
							nextPage={nextPage}
							goToPage={goToPage}
							lastPage={totalPages}
							isMobile={isMobile}
						/>
					</Center>
				</Center>
			) : (
				//! PC DISPLAY
				<Box justifyContent={"center"}>
					<Flex>
						<Box
							bgColor={"#F0F0F0"}
							borderRadius={"10px"}
							boxShadow={"0px 0px 5px gray"}
							w={"1000px"}
							h={"780px"}
							pt={"40px"}
							px={"20px"}
							my={"50px"}
							mx={"30px"}
						>
							<Box mb={"10px"} borderBottom={"1px solid"} borderColor={"gray.400"} pb={"20px"} align="center">
								<Box mb={"15px"} fontSize={"22px"} color={"gray"}>
									Search For Products
								</Box>
								<Flex align={"center"} justify={"space-evenly"}>
									<Input
										type="search"
										value={search}
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
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleSearch();
											}
										}}
									/>
									<FaSearch size={20} onClick={handleSearch} style={{ cursor: "pointer" }} />
								</Flex>
							</Box>
							<Box>
								<Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
									Sort by
								</Box>
								<RadioGroup
									borderBottom={"1px solid"}
									borderColor={"gray.400"}
									mb={"10px"}
									pb={"20px"}
									onChange={(value) => setSortBy(value)}
									value={sortBy}
								>
									<Stack color={"gray"}>
										<Radio
											isChecked={sortBy === "productName"}
											borderColor={"gray"}
											onChange={(e) => {
												setSortBy("productName");
											}}
											{...customRadioStyle}
										>
											Alphabetical
										</Radio>
										<Radio
											isChecked={sortBy === "price"}
											borderColor={"gray"}
											onChange={(e) => {
												setSortBy("price");
											}}
											{...customRadioStyle}
										>
											Price
										</Radio>
										<Radio
											isChecked={sortBy === "createdAt"}
											borderColor={"gray"}
											onChange={(e) => {
												setSortBy("createdAt");
											}}
											{...customRadioStyle}
										>
											Listing Time
										</Radio>
									</Stack>
								</RadioGroup>
							</Box>
							<Box>
								<Box mb={"5px"} fontWeight={"thin"} color={"gray"}>
									Order by
								</Box>
								<RadioGroup
									onChange={(value) => setSortOrder(value)}
									value={sortOrder}
									borderBottom={"1px solid"}
									borderColor={"gray.400"}
									mb={"10px"}
									pb={"20px"}
								>
									<Stack color={"gray"}>
										{sortBy === "productName" && (
											<>
												<Radio
													borderColor={"gray"}
													isChecked={sortOrder === "ASC"}
													onChange={(e) => {
														setSortOrder("ASC");
													}}
													{...customRadioStyle}
												>
													A - Z
												</Radio>
												<Radio
													borderColor={"gray"}
													isChecked={sortOrder === "DESC"}
													onChange={(e) => {
														setSortOrder("DESC");
													}}
													{...customRadioStyle}
												>
													Z - A
												</Radio>
											</>
										)}
										{sortBy === "price" && (
											<>
												<Radio
													borderColor={"gray"}
													isChecked={sortOrder === "ASC"}
													onChange={(e) => {
														setSortOrder("ASC");
													}}
													{...customRadioStyle}
												>
													Cheapest
												</Radio>
												<Radio
													borderColor={"gray"}
													isChecked={sortOrder === "DESC"}
													onChange={(e) => {
														setSortOrder("DESC");
													}}
													{...customRadioStyle}
												>
													Premium
												</Radio>
											</>
										)}
										{sortBy === "createdAt" && (
											<>
												<Radio
													borderColor={"gray"}
													isChecked={sortOrder === "ASC"}
													onChange={(e) => {
														setSortOrder("ASC");
													}}
													{...customRadioStyle}
												>
													Oldest
												</Radio>
												<Radio
													borderColor={"gray"}
													isChecked={sortOrder === "DESC"}
													onChange={(e) => {
														setSortOrder("DESC");
													}}
													{...customRadioStyle}
												>
													Newest
												</Radio>
											</>
										)}
									</Stack>
								</RadioGroup>
							</Box>
							<Box fontWeight={"thin"} color={"gray"}>
								Product Categories
								<Select
									mt={"10px"}
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
							</Box>
						</Box>
						<Flex justifyContent={"center"} pt={"50px"} w={"full"}>
							<Box>
								<Flex justifyContent={"center"} wrap={"wrap"} px={"30px"} w={"1100px"} h={"780px"} gap={"15px"}>
									{products?.map((data) => {
										return (
											<Box
												key={data.id}
												display="flex"
												flexDirection="column"
												cursor={"pointer"}
												boxShadow={"0px 0px 5px gray"}
												borderRadius={"10px"}
												w={"190px"}
												h={"250px"}
												onClick={() => productDetail(data.id)}
											>
												<Box h={"165px"}>
													<Image
														borderTopRadius={"9px"}
														w={"full"}
														h={"full"}
														src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
													/>
												</Box>
												<Box
													flex="1"
													display="flex"
													flexDirection="column"
													borderBottomRadius={"10px"}
													textShadow={"0px 0px 1px gray"}
													justifyContent={"center"}
													fontFamily={"revert"}
													bgColor={"#F0F0F0"}
													color={"gray.700"}
													pt={"10px"}
													pb={"25px"}
													px={"25px"}
													width="100%"
													whiteSpace="nowrap"
													overflow="hidden"
													textOverflow="ellipsis"
												>
													<Box
														color={"gray.700"}
														mb={1}
														textAlign={"center"}
														fontWeight={"bold"}
														fontSize={"16px"}
														overflow="hidden"
														textOverflow="ellipsis"
													>
														{data.productName}
													</Box>
													<Box
														color={"gray.700"}
														textAlign={"center"}
														fontSize={"15px"}
														overflow="hidden"
														textOverflow="ellipsis"
													>
														Rp. {data.price.toLocaleString("id-ID")}
													</Box>
												</Box>
											</Box>
										);
									})}
								</Flex>
								<Flex justifyContent={"center"} gap={"50px"} my={"35px"}>
									<Pagination
										page={page}
										totalPages={totalPages}
										prevPage={prevPage}
										nextPage={nextPage}
										goToPage={goToPage}
										lastPage={totalPages}
										isMobile={isMobile}
									/>
								</Flex>
							</Box>
						</Flex>
					</Flex>
				</Box>
			)}
		</Box>
	);
};

export default Search;
