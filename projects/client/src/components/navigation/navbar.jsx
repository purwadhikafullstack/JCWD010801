import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import AlphaMartLogo from "../../assets/public/AM_logo_trans.png";
import {
	Flex,
	Stack,
	Text,
	Image,
	Avatar,
	Button,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuList,
	MenuItem,
	MenuButton,
	MenuDivider,
	Spacer,
	Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../redux/userSlice";
import { BsBell, BsCart, BsPerson } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { MdLogout, MdLogin, MdAppRegistration } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { NavbarMobile } from "./navbarMobile";
import { SearchMobile } from "./searchMobile";
import { toast } from "react-toastify";
import { setValueAddress } from "../../redux/addressSlice";
import { ReferralModal } from "./referralModal";
import { ResendVerification } from "./resendVerification";
import { AiOutlineBell } from "react-icons/ai";

export const Navbar = ({ isNotDisabled = true }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");
	const reduxStore = useSelector((state) => state?.user);
	const username = reduxStore?.value?.username;
	const email = reduxStore?.value?.email;
	const avatar = reduxStore?.value?.avatar;
	const firstName = reduxStore?.value?.firstName;
	const lastName = reduxStore?.value?.lastName;
	const RoleId = reduxStore?.value?.RoleId;
	const isVerified = reduxStore?.value?.isVerified;
	const { refresh } = useSelector((state) => state.cart.value);
	const [search, setSearch] = useState("");
	const [products, setProducts] = useState([]);
	const [totalProducts, setTotalProducts] = useState(0);
	const [reload, setReload] = useState(false);
	const [isSearchFocused, setSearchFocused] = useState(false);
	const [totalCartItems, setTotalCartItems] = useState(0);
	const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0);
	const address = useSelector((state) => state?.address?.value);

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

	const fetchCart = async () => {
		try {
			const { data } = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			setTotalCartItems(data?.total);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchUnreadNotification = async() => {
		try {
			const { data } = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			setTotalUnreadNotifications(data.unreadTotal);
		} catch (error) {
			console.log(error);
		}
	}

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
		// eslint-disable-next-line
	}, [reload, search]);

	useEffect(() => {
		fetchCart();
		fetchUnreadNotification();
		// eslint-disable-next-line
	}, [refresh]);

	const logout = () => {
		localStorage.removeItem("token");
		toast.success("You have successfully logged out.", {
			position: "top-right",
			autoClose: 4000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
		dispatch(setValue({}));	
		dispatch(setValueAddress({}))
		navigate("/login");
		setProducts([]);
	};

	const productDetail = (PID) => {
		Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/product/view/${PID}`, {
			RoleId: RoleId,
		});
		navigate(`/product/${PID}`);
		setProducts([]);
	};

	const searchQuery = (query) => {
		navigate(`/search?q=${query}&sort=productName&order=ASC&cat=&p=1`);
		setProducts([]);
		setSearch("");
	};

	return (
		<>
			{isNotDisabled && (
				<Stack
				position={"sticky"}
				top={0}
				zIndex={20}
				w={"100%"}
				bgColor={"white"}
				>
					<Flex
						alignItems={"center"}
						justifyContent={"space-between"}
						w={"100%"}
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
								{token && address !== undefined && Object.keys(address).length > 0 ? (
									<Flex gap="2" alignItems={"center"} justifyContent={"center"}>
										<Icon as={CiLocationOn} color={"black"} w={"5"} h={"5"} />
										<Stack gap={0}>
											<Box onClick={() => navigate("/profile#addresses")}>
												<Text fontSize={{ base: "xs", lg: "sm" }}>Deliver To</Text>
												<Text cursor={"pointer"} fontSize={{ base: "sm", lg: "md" }} fontWeight={"medium"}>
													{address.label}
												</Text>
											</Box>
										</Stack>
									</Flex>
								) : null}
								<Text
									onClick={() => navigate("/search")}
									fontSize={{ base: "sm", lg: "md" }}
									cursor={"pointer"}
									fontWeight={"medium"}
								>
									Shop
								</Text>
								<Text
									onClick={() => navigate("/voucher")}
									fontSize={{ base: "sm", lg: "md" }}
									cursor={"pointer"}
									fontWeight={"medium"}
								>
									Voucher
								</Text>
							</Flex>
							<Flex gap={{ base: 1, md: 3 }} alignItems={"center"}>
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
														searchQuery(search);
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
								<Button
									isDisabled={+RoleId === 1 ? false : true}
									bgColor={"white"}
									rounded={"full"}
									cursor={"pointer"}
									onClick={() => navigate("/notification")}
								>
									<Icon as={BsBell} w="5" h="5" color={"black"} pos="relative" />
									{totalUnreadNotifications > 0 && (
										<Flex
											w={5}
											h={5}
											bg={"blackAlpha.700"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
											right={1}
										>
											<Text fontSize={"10px"} align={"center"} justifyContent={"center"} color={"white"} textAlign={"center"}>
												{totalUnreadNotifications}
											</Text>
										</Flex>
									)}
								</Button>
								<Button
									isDisabled={+RoleId === 1 ? false : true}
									bgColor={"white"}
									rounded={"full"}
									cursor={"pointer"}
									onClick={() => navigate("/cart")}
								>
									<Icon as={BsCart} w="5" h="5" color={"black"} pos="relative" />
									{totalCartItems > 0 && (
										<Flex
											w={5}
											h={5}
											bg={"blackAlpha.700"}
											border={"2px solid white"}
											rounded={"full"}
											justifyContent={"center"}
											alignItems={"center"}
											pos={"absolute"}
											top={1}
											right={1}
										>
											<Text fontSize={"10px"} color={"white"} textAlign={"center"}>
												{totalCartItems}
											</Text>
										</Flex>
									)}
								</Button>
								<Menu alignSelf={"center"}>
									<Button as={MenuButton} p={0} bgColor={"white"} pt={1} borderRadius={"full"} cursor={"pointer"}>
										<Icon as={BsPerson} w="5" h="5" color="black" cursor={"pointer"} />
									</Button>
									{token ? (
										<MenuList>
											<Stack alignItems={"center"} justifyContent={"center"} p="3" gap={0}>
												<Avatar
													mb={2}
													src={`${process.env.REACT_APP_BASE_URL}/avatars/${avatar ? avatar : "default_not_set.png"}`}
													size={"lg"}
												/>
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
											{RoleId > 1 ? (
												<MenuItem onClick={() => navigate("/dashboard")} gap="3">
													<Icon as={MdSpaceDashboard} w="5" h="5" color="black" />
													<Text>Dashboard</Text>
												</MenuItem>
											) : (
												<ReferralModal/>
											)}
											<MenuItem onClick={() => navigate("/profile")} gap="3">
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
					{isVerified === false && (<ResendVerification/>)}
				</Stack>
			)}
		</>
	);
};
