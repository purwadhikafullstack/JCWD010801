import Axios from "axios";
import {
	Flex,
	Stack,
	Text,
	Box,
	Image,
	Avatar,
	Button,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	Menu,
	MenuList,
	MenuItem,
	MenuButton,
	MenuDivider,
	Divider,
	Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsCart, BsPerson } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { MdLogout, MdLogin, MdAppRegistration } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { NavbarMobile } from "./navbarMobile";
import { SearchMobile } from "./searchMobile";
import { useSelector } from "react-redux";
import AlphaMartLogo from "../../assets/public/AM_logo_trans.png";

export const Navbar = ({ isNotDisabled = true }) => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const branches = ["branch 1", "branch 2", "branch 3", "branch 4"];
	const { username, email, avatar, firstName, lastName } = useSelector((state) => state.user.value);
	const [search, setSearch] = useState("");
	const [products, setProducts] = useState([]);
	const [totalProducts, setTotalProducts] = useState(0);
	const [reload, setReload] = useState(false);
	const [isSearchFocused, setSearchFocused] = useState(false);

	const fetchData = async () => {
		try {
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/all?page=1&sortBy=productName&sortOrder=ASC&itemLimit=3&search=${search}`;
			const response = await Axios.get(apiURL);
			setProducts(response.data.result);
			setTotalProducts(response.data.totalProducts);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearchFocus = () => {
		setSearchFocused(true);
		setReload(true);
	};

	const handleSearchBlur = () => {
		setSearchFocused(false);
		setProducts([]);
	};

	useEffect(() => {
		if (search.trim() !== "" && reload) {
			fetchData();
			setReload(false);
		} else {
			setProducts([]);
		}
	}, [reload, search]);

	const logout = () => {
		localStorage.removeItem("token");
		navigate("/");
		setProducts([]);
	};

	const productDetail = (id) => {
		navigate(`/product/${id}`);
		setProducts([]);
	};

	const searchQuery = (query) => {
		navigate(`/search/products/${query}`);
		setProducts([]);
	};

	return (
		<>
			{isNotDisabled && (
				<Flex
					alignItems={"center"}
					justifyContent={"space-between"}
					position={"sticky"}
					top={0}
					zIndex={10}
					w={"100%"}
					bgColor={"white"}
				>
					<Flex
						mx={{ base: "10px", md: "30px", lg: "50px" }}
						my={{ base: "20px", lg: 0 }}
						w="100%"
						h="100%"
						justifyContent={"space-between"}
					>
						<NavbarMobile />
						<Image
							display={{ base: "none", lg: "block" }}
							cursor={"pointer"}
							onClick={() => navigate("/")}
							src={AlphaMartLogo}
							w={"150px"}
						/>
						<Flex
							gap={"2rem"}
							alignItems={"center"}
							display={{ base: "none", lg: "flex" }}
							justifyContent={"space-between"}
						>
							<Flex gap="2" alignItems={"center"} justifyContent={"center"}>
								<Icon as={CiLocationOn} color={"black"} w={"5"} h={"5"} />
								<Stack gap={0}>
									<Text fontSize={{ base: "xs", lg: "sm" }}>Deliver to</Text>
									<Text
										onClick={() => navigate("/")}
										cursor={"pointer"}
										fontSize={{ base: "sm", lg: "md" }}
										fontWeight={"medium"}
									>
										Address
									</Text>
								</Stack>
							</Flex>
							<Text
								onClick={() => navigate("/search")}
								fontSize={{ base: "sm", lg: "md" }}
								cursor={"pointer"}
								fontWeight={"medium"}
							>
								Shop
							</Text>
							<Text
								onClick={() => navigate("/")}
								fontSize={{ base: "sm", lg: "md" }}
								cursor={"pointer"}
								fontWeight={"medium"}
							>
								Voucher
							</Text>
							<Popover>
								<PopoverTrigger>
									<Flex gap={3} alignItems={"center"}>
										<Text fontSize={{ base: "sm", lg: "md" }} cursor={"pointer"} fontWeight={"medium"}>
											Branch 1 (useLocation)
										</Text>
										<Icon as={BsChevronDown} w={4} h={4} color={"black"} />
									</Flex>
								</PopoverTrigger>
								<PopoverContent>
									<PopoverHeader justifyContent={"center"} w="100%">
										<Text textAlign={"center"} fontWeight={"medium"} fontSize={"lg"}>
											Select Branch Location
										</Text>
									</PopoverHeader>
									<PopoverBody>
										{branches.map((item, index) => {
											return (
												<>
													<Text
														textAlign={"center"}
														as={Box}
														key={index}
														role={"group"}
														borderRadius={"md"}
														p={2}
														fontWeight={400}
														color={"gray.500"}
														_hover={{
															bgColor: "blackAlpha.100",
															color: "black",
															fontWeight: 500,
														}}
													>
														{item}
													</Text>
													{index + 1 !== branches.length && <Divider size={"xl"} colorScheme="gray" />}
												</>
											);
										})}
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</Flex>
						<Flex gap={3} alignItems={"center"}>
							<SearchMobile />
							{/* //! SEARCH RESULTS */}
							<div style={{ position: "relative" }}>
								<InputGroup display={{ base: "none", sm: "block" }}>
									<Input
										type="search"
										value={search}
										bgColor={"whiteAlpha.300"}
										focusBorderColor="gray.300"
										placeholder="Search Products"
										onChange={(e) => {
											setSearch(e.target.value);
											setReload(true);
										}}
										onFocus={handleSearchFocus}
										onBlur={handleSearchBlur}
									/>
									<InputLeftElement>
										<Icon as={LuSearch} />
									</InputLeftElement>
								</InputGroup>
								{isSearchFocused && products.length > 0 && (
									<Stack
										position="absolute"
										top="100%"
										left={0}
										zIndex={369}
										mt="2"
										p="2"
										bgColor="#E1E0E0"
										boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
										width="100%"
									>
										{products.map((data) => (
											<Flex
												key={data.id}
												alignItems="center"
												cursor="pointer"
												boxShadow="0px 0px 5px gray"
												borderRadius="1px"
												mb={2}
												h="65px"
												bgColor="#C3C1C1"
												fontWeight="semibold"
												overflow="hidden"
												onMouseDown={(e) => {
													e.preventDefault();
													productDetail(data?.id);
												}}
											>
												<Image
													src={`${process.env.REACT_APP_BASE_URL}/products/${data?.imgURL}`}
													alt={data.productName}
													boxSize="65px"
													objectFit="cover"
													mr="2"
												/>
												<Text>{data.productName}</Text>
												<Spacer />
												<Text fontSize={"12px"} whiteSpace="nowrap">
													Rp. {Math.floor(data?.price / 1000).toLocaleString("id-ID")}K
												</Text>
											</Flex>
										))}
										{products.length >= 3 && (
											<Flex
												alignItems="center"
												cursor="pointer"
												boxShadow="0px 0px 5px gray"
												borderRadius="1px"
												mb={2}
												h="65px"
												bgColor="#C3C1C1"
												fontWeight="semibold"
												overflow="hidden"
												onMouseDown={(e) => {
													e.preventDefault();
													searchQuery(search)
												}}
											>
												<Text textAlign={"center"}>
													View All {totalProducts} Results for "{search.charAt(0).toUpperCase() + search.slice(1)}"
												</Text>
											</Flex>
										)}
									</Stack>
								)}
							</div>
							<Button bgColor={"white"} rounded={"full"} cursor={"pointer"}>
								<Icon as={BsCart} w="5" h="5" color={"black"} />
							</Button>
							<Menu alignSelf={"center"}>
								<MenuButton>
									<Button bgColor={"white"} rounded={"full"} cursor={"pointer"}>
										<Icon as={BsPerson} w="5" h="5" color="black" cursor={"pointer"} />
									</Button>
								</MenuButton>
								{token ? (
									<MenuList>
										<Stack alignItems={"center"} justifyContent={"center"} p="3" gap={0}>
											<Avatar mb={2} src={`${process.env.REACT_APP_BASE_URL}/avatars/${avatar}`} size={"lg"} />
											<Text fontSize={"sm"} fontWeight={"normal"}>
												{firstName} {lastName}
											</Text>
											<Text fontSize={"lg"} fontWeight={"medium"}>
												{username}
											</Text>
											<Text fontSize={"xs"} fontWeight={"light"}>
												{email}
											</Text>
										</Stack>
										<MenuDivider />
										<MenuItem onClick={() => navigate("/")} gap="3">
											<Icon as={MdSpaceDashboard} w="5" h="5" color="black" />
											<Text>Dashboard</Text>
										</MenuItem>
										<MenuItem onClick={() => navigate("/")} gap="3">
											<Icon as={BsPerson} w="5" h="5" color="black" />
											<Text>Profile</Text>
										</MenuItem>
										<MenuItem onClick={logout} gap="3">
											<Icon as={MdLogout} w="5" h="5" color="black" />
											<Text>Logout</Text>
										</MenuItem>
									</MenuList>
								) : (
									<MenuList>
										<MenuItem onClick={() => navigate("/login")} gap="3">
											<Icon as={MdLogin} w="5" h="5" color="black" />
											<Text>Sign In</Text>
										</MenuItem>
										<MenuItem onClick={() => navigate("/register")} gap="3">
											<Icon as={MdAppRegistration} w="5" h="5" color="black" />
											<Text>Register</Text>
										</MenuItem>
									</MenuList>
								)}
							</Menu>
						</Flex>
					</Flex>
				</Flex>
			)}
		</>
	);
};