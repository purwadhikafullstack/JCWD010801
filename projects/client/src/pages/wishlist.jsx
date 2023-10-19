import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import NoProduct from "../assets/public/404.png";
import { debounce } from "lodash";
import { Box, Flex, Input, Radio, RadioGroup, Stack, Image, Select, Center, Text, Badge } from "@chakra-ui/react";
import { Skeleton as ChakraSkeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Pagination } from "../components/navigation/pagination";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

const Wishlist = () => {
	const token = localStorage.getItem("token");
	const user = useSelector((state) => state?.user?.value);
	const RoleId = user.RoleId || 0;
	const [products, setProducts] = useState([]);
	const [itemLimit, setItemLimit] = useState(15);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [reload, setReload] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("ASC");
	const [isSearchEmpty, setIsSearchEmpty] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const interval = 15000;
	useEffect(() => {
		const checkAuth = () => {
			if (!RoleId || RoleId > 1 || !token) {
				navigate("/404");
			}
		};
		checkAuth();
		const intervalId = setInterval(checkAuth, interval);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line
	}, [RoleId]);

	useEffect(() => {
		fetchData(page);
		// eslint-disable-next-line
	}, [reload, search, sortOrder, selectedCategory, sortBy, totalPages]);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const sortByParam = queryParams.get("sort") || "productName";
		const sortOrderParam = queryParams.get("order") || "ASC";
		const categoryParam = queryParams.get("cat") || "";
		const pageParam = queryParams.get("p") || 1;

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
			setIsLoading(true);
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/wishlist?page=${pageNum}&sortBy=${sortBy}&sortOrder=${sortOrder}&UID=${user?.id}`;

			if (selectedCategory) {
				apiURL += `&CategoryId=${selectedCategory}`;
			}

			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}

			const productsResponse = await Axios.get(apiURL);
			setProducts(productsResponse.data.wishlist.map((entry) => entry.Product));
			if (products.length === 0) {
				setIsSearchEmpty(true);
			} else {
				setIsSearchEmpty(false);
			}
			setTotalPages(productsResponse.data.totalPages);
			if (pageNum > totalPages) {
				setIsSearchEmpty(true);
			} else {
				setIsSearchEmpty(false);
			}
			const categoriesResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/user?limit=50`);
			const categoryData = categoriesResponse.data.result.map((data) => ({
				label: data.category,
				value: data.id,
			}));
			setCategories(categoryData);
			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};

	const nextPage = () => {
		if (page < totalPages) {
			setPage((prevPage) => +prevPage + 1);
			updateQueryParams({ p: +page + 1 });
			setReload(!reload);
		}
	};

	const prevPage = () => {
		if (page > 1) {
			setPage((prevPage) => +prevPage - 1);
			updateQueryParams({ p: +page - 1 });
			setReload(!reload);
		}
	};

	const goToPage = (page) => {
		setPage(page);
		updateQueryParams({ p: page });
		setReload(!reload);
	};

	const productDetail = (PID) => {
		Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/product/view/${PID}`, {
			RoleId: RoleId,
		});
		navigate(`/product/${PID}`);
	};

	const handleSearch = debounce(
		(e) => {
			setSearch(e);
			if (products.length === 0) {
				setIsSearchEmpty(true);
			} else {
				setIsSearchEmpty(false);
			}
			const newSearchParams = new URLSearchParams();
			newSearchParams.set("q", e);
			newSearchParams.set("sort", sortBy);
			newSearchParams.set("order", sortOrder);
			newSearchParams.set("cat", selectedCategory);
			newSearchParams.set("p", 1);
			navigate(`?${newSearchParams.toString()}`);
		},
		1000,
		{
			leading: false,
			trailing: true,
		}
	);

	const updateQueryParams = (paramsToUpdate) => {
		const queryParams = new URLSearchParams(location.search);

		for (const key in paramsToUpdate) {
			if (paramsToUpdate.hasOwnProperty(key)) {
				queryParams.set(key, paramsToUpdate[key]);
			}
		}

		navigate(`?${queryParams.toString()}`);
	};

	const handleType = (type, nominal) => {
		if (type === "Extra") return `B 1 G ${nominal}`;
		if (type === "Numeric") return `- ${Math.floor(nominal / 1000).toLocaleString("id-ID")}K OFF`;
		if (type === "Percentage") return `${nominal}% OFF`;
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

	return isMobile ? (
		//! MOBILE DISPLAY
		<Box w={"99vw"}>
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
						{user?.username}'s Wishlist
					</Box>
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
										updateQueryParams({ sort: "productName" });
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
										updateQueryParams({ sort: "price" });
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
										updateQueryParams({ sort: "createdAt" });
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
												updateQueryParams({ order: "ASC" });
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
												updateQueryParams({ order: "DESC" });
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
												updateQueryParams({ order: "ASC" });
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
												updateQueryParams({ order: "DESC" });
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
												updateQueryParams({ order: "ASC" });
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
												updateQueryParams({ order: "DESC" });
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
								const selectedValue = parseInt(e.target.value, 10);
								setSelectedCategory(isNaN(selectedValue) ? "" : selectedValue);
								setPage(1);
								setReload(!reload);
								updateQueryParams({ cat: isNaN(selectedValue) ? "" : selectedValue });
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
				<Box mt={4} flex="1" overflowY="auto" width="90%" className="scrollbar-3px">
					{isSearchEmpty ? (
						<Box
							w={"100%"}
							h={"80px"}
							align={"center"}
							borderTop={"1px ridge grey"}
							borderBottom={"1px ridge grey"}
							borderRadius={"10px"}
						>
							<Image src={NoProduct} alt="404ProductNotFound" objectFit="cover" borderRadius={"5px"} />
						</Box>
					) : (
						products?.map((data) => (
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
									{isLoading ? (
										<ChakraSkeleton
											w={"100%"}
											h={"100%"}
											borderTopRadius={"9px"}
											startColor="#C3C1C1"
											endColor="#647305"
										/>
									) : (
										<>
											{data?.Discounts?.find((discount) => discount.isActive === true) ? (
												<div style={{ position: "relative", width: "100%", height: "100%" }}>
													<Badge
														zIndex={2}
														position="absolute"
														top="5px"
														right="5px"
														h="30px"
														w="90px"
														bgColor="red.500"
														px={1}
														variant="outline"
													>
														<Text fontSize="18px" textAlign="center" color="white" overflow="hidden">
															{handleType(data?.Discounts[0]?.type, data?.Discounts[0]?.nominal)}
														</Text>
													</Badge>
													<Image
														borderTopRadius="9px"
														w="100%"
														h="100%"
														src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
													/>
												</div>
											) : (
												<Image
													borderTopRadius="9px"
													w="100%"
													h="100%"
													src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
												/>
											)}
										</>
									)}
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
									{isLoading ? (
										<Box display={"flex"} alignItems="center" justifyContent="center">
											<Skeleton count={1} width="250px" height="20px" highlightColor="#647305" />
										</Box>
									) : (
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
									)}
									{isLoading ? (
										<Box display={"flex"} alignItems="center" justifyContent="center">
											<Skeleton count={1} width="250px" height="15px" highlightColor="#647305" />
										</Box>
									) : (
										<Box
											color={"gray.700"}
											textAlign={"center"}
											fontSize={"15px"}
											overflow="hidden"
											textOverflow="ellipsis"
										>
											Rp. {data.price.toLocaleString("id-ID")}
										</Box>
									)}
								</Box>
							</Box>
						))
					)}
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
		</Box>
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
					ml={"50px"}
				>
					<Box mb={"10px"} borderBottom={"1px solid"} borderColor={"gray.400"} pb={"20px"} align="center">
						<Box mb={"5px"} fontSize={"24px"} color={"gray"} fontWeight={"semibold"}>
							Welcome To Your Wishlist
						</Box>
						<Box mb={"5px"} fontSize={"22px"} color={"gray"}>
							<Text color={"#BCD709"}>{user?.username}</Text>
						</Box>
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
							value={sortBy}
							onChange={(value) => {
								setSortBy(value);
								updateQueryParams({ sort: value });
							}}
						>
							<Stack color={"gray"}>
								<Radio
									isChecked={sortBy === "productName"}
									borderColor={"gray"}
									onChange={(e) => {
										setSortBy("productName");
										updateQueryParams({ sort: "productName" });
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
										updateQueryParams({ sort: "price" });
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
										updateQueryParams({ sort: "createdAt" });
									}}
									{...customRadioStyle}
								>
									Time Added
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
												updateQueryParams({ order: "ASC" });
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
												updateQueryParams({ order: "DESC" });
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
												updateQueryParams({ order: "ASC" });
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
												updateQueryParams({ order: "DESC" });
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
												updateQueryParams({ order: "ASC" });
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
												updateQueryParams({ order: "DESC" });
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
								updateQueryParams({ cat: isNaN(selectedValue) ? "" : selectedValue });
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
							{isSearchEmpty ? (
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
							) : (
								products?.map((data) => {
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
												{isLoading ? (
													<ChakraSkeleton
														w={"full"}
														h={"full"}
														borderTopRadius={"9px"}
														startColor="#C3C1C1"
														endColor="#647305"
													/>
												) : (
													<>
														{data?.Discounts?.find((discount) => discount.isActive === true) && (
															<Badge
																zIndex={2}
																ml={"90px"}
																mt={"5px"}
																h={"30px"}
																w={"90px"}
																position={"absolute"}
																bgColor={"red.500"}
																px={1}
																variant={"outline"}
															>
																<Text fontSize={"18px"} textAlign={"center"} color={"white"} overflow={"hidden"}>
																	{handleType(data?.Discounts[0]?.type, data?.Discounts[0]?.nominal)}
																</Text>
															</Badge>
														)}
														<Image
															borderTopRadius={"9px"}
															w={"full"}
															h={"full"}
															src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
														/>
													</>
												)}
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
												{isLoading ? (
													<Box>
														<Skeleton count={1} width="138px" height="20px" highlightColor="#647305" />
													</Box>
												) : (
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
												)}
												{isLoading ? (
													<Box>
														<Skeleton count={1} width="138px" height="15px" highlightColor="#647305" />
													</Box>
												) : (
													<Box
														color={"gray.700"}
														textAlign={"center"}
														fontSize={"15px"}
														overflow="hidden"
														textOverflow="ellipsis"
													>
														Rp. {data.price.toLocaleString("id-ID")}
													</Box>
												)}
											</Box>
										</Box>
									);
								})
							)}
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
	);
};

export default Wishlist;
