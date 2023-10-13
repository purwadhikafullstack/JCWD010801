import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import NoDiscountBanner from "../assets/public/no_discount.jpg";
import DiscountBanner from "../assets/public/sale_banner.png";
import NoReview from "../assets/public/no_review.jpg";
import RatingBar from "../components/ratingBar";
import { toast } from "react-toastify";
import {
	Box,
	Flex,
	IconButton,
	Image,
	Tabs,
	Tab,
	TabPanels,
	TabPanel,
	TabList,
	CSSReset,
	useColorModeValue,
	Center,
	Stack,
	Badge,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { MinusIcon, AddIcon } from "@chakra-ui/icons";
import { TiHeartOutline, TiHeartFullOutline } from "react-icons/ti";
import { PiShootingStarDuotone } from "react-icons/pi";
import { TbStar, TbStarFilled, TbStarHalfFilled } from "react-icons/tb";
import { AddToCartButton } from "../components/cart/add";
import { useSelector } from "react-redux";
import { categorizeDate } from "../helper/categorizeDate";
import { censorUsername } from "../helper/censorUsername";

const formatTime = (time) => {
	return time < 10 ? `0${time}` : time;
};

const calculateTimeRemaining = (validUntil) => {
	const currentTime = new Date().getTime();
	const endTime = new Date(validUntil).getTime();
	const timeDiff = endTime - currentTime;

	if (timeDiff <= 0) {
		return { days: "00", hours: "00", minutes: "00", seconds: "00" };
	}

	const totalSeconds = Math.floor(timeDiff / 1000);
	const days = Math.floor(totalSeconds / (3600 * 24));
	const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		days: formatTime(days),
		hours: formatTime(hours),
		minutes: formatTime(minutes),
		seconds: formatTime(seconds),
	};
};

const ProductDetail = () => {
	const { id } = useParams();
	const UserId = useSelector((state) => state?.user?.value?.id);
	const RoleId = useSelector((state) => state?.user?.value?.RoleId);
	const [branches, setBranches] = useState([]);
	const [product, setProduct] = useState([]);
	const [category, setCategory] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [discountData, setDiscountData] = useState(null);
	const [newPrice, setNewPrice] = useState(0);
	const [stock, setStock] = useState(0);
	const [BranchId, setBranchId] = useState(localStorage.getItem("BranchId"));
	const [UAL, setUAL] = useState(localStorage.getItem("UAL") === "true");
	// eslint-disable-next-line
	const [userLat, setUserLat] = useState(localStorage.getItem("lat"));
	const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(discountData?.validUntil));
	const [isLiked, setIsLiked] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [rating, setRating] = useState(0);
	const [oneStarStatic, setOneStarStatic] = useState(0);
	const [twoStarStatic, setTwoStarStatic] = useState(0);
	const [threeStarStatic, setThreeStarStatic] = useState(0);
	const [fourStarStatic, setFourStarStatic] = useState(0);
	const [fiveStarStatic, setFiveStarStatic] = useState(0);
	const [totalReviewsStatic, setTotalReviewsStatic] = useState(0);
	const [itemLimit, setItemLimit] = useState(5);
	const [page, setPage] = useState(1);
	const [selectedRating, setSelectedRating] = useState(null);
	const [sortOrder, setSortOrder] = useState("DESC");
	const [reload, setReload] = useState(false);
	const [reload2, setReload2] = useState(false);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const remaining = calculateTimeRemaining(discountData?.validUntil);
			setTimeRemaining(remaining);
		}, 1000);

		return () => clearInterval(intervalId);
	}, [discountData]);

	useEffect(() => {
		if (!UAL) {
			setBranchId(1);
			toast.info(
				"Please allow location access so that we can show accurate stock availability that is accurate to your location. Currently showing available stock in our Jakarta HQ branch.",
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
		} else if (userLat) {
			setUAL(true);
		}
	}, [UAL, userLat]);

	useEffect(() => {
		fetchBranchData();
	}, []);

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	}, [reload, id, BranchId, isLiked]);

	useEffect(() => {
		fetchReviewData();
		// eslint-disable-next-line
	}, [reload2, id]);

	useEffect(() => {
		fetchStaticReviewData();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		processDiscount();
		// eslint-disable-next-line
	}, [discountData]);

	useEffect(() => {
		fetchLikeStatus();
		// eslint-disable-next-line
	}, [reload, isLiked]);

	const fetchData = async () => {
		try {
			const productResponse = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product/${id}?BranchId=${BranchId}`
			);
			setProduct(productResponse.data.result);
			setDiscountData(
				productResponse?.data?.result?.Discounts?.find((discount) => {
					return discount.isActive === true;
				})
			);
			if (productResponse.data.result.Stocks[0]) {
				setStock(productResponse.data.result.Stocks[0].currentStock);
			} else {
				setStock(0);
			}

			const categoryResponse = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/category/${productResponse.data.result.CategoryId}`
			);
			setCategory(categoryResponse.data.result.category);
		} catch (error) {
			console.error("Error fetching product data.", error);
		}
	};

	const fetchBranchData = async () => {
		try {
			const branchResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(branchResponse.data);
		} catch (error) {
			console.error("Error fetching branch data.", error);
		}
	};
	const currentBranchInfo = branches.find((branch) => branch.id === parseInt(BranchId));
	const currentBranchName = currentBranchInfo?.name;

	const fetchLikeStatus = async () => {
		try {
			const likeResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/like/${id}?UID=${UserId}`);

			if (RoleId < 2) {
				setIsLiked(likeResponse.data.likeStatus);
			}
		} catch (error) {
			console.error("Error fetching product like status.", error);
		}
	};

	const fetchStaticReviewData = async () => {
		try {
			const reviewResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/review/${id}?page=1`);
			setOneStarStatic(reviewResponse.data.oneStar);
			setTwoStarStatic(reviewResponse.data.twoStar);
			setThreeStarStatic(reviewResponse.data.threeStar);
			setFourStarStatic(reviewResponse.data.fourStar);
			setFiveStarStatic(reviewResponse.data.fiveStar);
			setTotalReviewsStatic(reviewResponse.data.total_reviews);
			setRating(reviewResponse.data.avg_rating);
		} catch (error) {
			console.error("Error fetching review data.", error);
		}
	};

	const fetchReviewData = async () => {
		try {
			let apiURL = `${process.env.REACT_APP_API_BASE_URL}/product/review/${id}?page=${page}&sortOrder=${sortOrder}`;

			if (itemLimit) {
				apiURL += `&itemLimit=${itemLimit}`;
			}

			if (selectedRating) {
				apiURL += `&rating=${selectedRating}`;
			}

			const reviewResponse = await Axios.get(apiURL);

			setReviews(reviewResponse.data.result);
		} catch (error) {
			console.error("Error fetching review data.", error);
		}
	};

	const handleLike = async () => {
		try {
			const likeUnlikeResponse = await Axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/product/like/${id}?UID=${UserId}`
			);
			toast.success(likeUnlikeResponse.data.message, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} catch (error) {
			console.error("Error adding product to wishlist.", error);
			toast.error(error.response.data.message, {
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
	};

	const processDiscount = async () => {
		if (discountData !== null) {
			if (discountData.type === "Numeric") {
				setNewPrice(parseInt(product.price, 10) - parseInt(discountData.nominal, 10));
			}
			if (discountData.type === "Percentage") {
				setNewPrice(
					parseInt(product.price, 10) - parseInt(product.price, 10) * (parseInt(discountData.nominal, 10) / 100)
				);
			}
		}
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const increaseQuantity = () => {
		if (quantity >= stock) {
			toast.error(`Currently there are only ${stock} units available.`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			return;
		} else {
			setQuantity(quantity + 1);
		}
	};

	const tabStyles = useColorModeValue({
		_selected: {
			color: "gray.900",
			borderColor: "gray.900",
			bg: "transparent",
		},
	});

	const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

	const formatWeightGrams = (weight) => {
		if (typeof weight !== "number") {
			return weight;
		}

		const weightStr = weight.toString();
		const parts = [];

		for (let i = weightStr.length - 1, j = 1; i >= 0; i--, j++) {
			parts.unshift(weightStr[i]);

			if (j % 3 === 0 && i > 0) {
				parts.unshift(".");
			}
		}

		return parts.join("");
	};

	const truncate = (string, maxLength) => {
		if (string && string.length > maxLength) {
			return string.slice(0, maxLength) + "...";
		}
		return string;
	};

	return (
		<Box justify={"center"}>
			{isMobile ? (
				//! MOBILE DISPLAY
				<Center flexDirection="column" h="100%" w="100%">
					<Stack justify={"center"} align={"center"} wrap={"wrap"} gap={"20px"}>
						<Box>
							<Box fontSize={{ base: "16px", sm: "18px", md: "20px" }} color="gray.600" mb="20px" textAlign={"left"}>
								<Link to="/search" style={{ textDecoration: "underline" }}>
									Browse Products
								</Link>
								{" > "}
								<Link
									to={`/search?q=&sort=productName&order=ASC&cat=${product.CategoryId}&p=1`}
									style={{ textDecoration: "underline" }}
								>
									{category}
								</Link>
								{" > "}
								<span style={{ fontWeight: "bold" }}>{product.productName}</span>
							</Box>
							<Box w={"100%"} h={"100%"} display="flex" justifyContent="center" alignItems="center">
								<Image
									alignSelf={"left"}
									borderRadius={"5px"}
									boxShadow={"1px 2px 3px black"}
									w={"320px"}
									h={"200px"}
									src={`${process.env.REACT_APP_BASE_URL}/products/${product?.imgURL}`}
								/>
							</Box>
						</Box>
						<Box w={"320px"} h={"325px"} borderRadius={"20px"} boxShadow={"7px 7px 7px gray"} mt={"10px"}>
							<Box mb={"110px"} alignContent={"center"} mx={"25px"}>
								<Flex
									pt={"10px"}
									pb={"5px"}
									borderBottom={"1px solid #D3D3D3"}
									textShadow={"5px 5px 5px gray"}
									fontSize={"26px"}
									color={"gray.800"}
									fontFamily={"sans-serif"}
									fontWeight={"bold"}
									justify={"center"}
								>
									{product.productName}
								</Flex>
								<Flex
									color={"gray.700"}
									textShadow={"2px 2px 2px gray"}
									py={2}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
								>
									<Box fontSize={"20px"} fontWeight={"bold"}>
										Rp. {product.price?.toLocaleString("id-ID")}
									</Box>
								</Flex>
								<Flex
									fontSize={"16px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
									align={"center"}
									justify={"space-between"}
								>
									<Box fontWeight={"bold"} fontSize={"16px"}>
										In Stock ({currentBranchName}) :
									</Box>
									<Box ml={"5px"} fontSize={"16px"}>
										{stock} Units
									</Box>
								</Flex>
								<Flex
									fontSize={"16px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
									justify={"space-between"}
								>
									<Box fontWeight={"bold"} fontSize={"16px"}>
										Weight :
									</Box>
									<Box ml={"5px"} fontSize={"16px"}>
										{(product.weight / 1000).toFixed(2)} Kilograms
									</Box>
								</Flex>
								<Box
									w={"275px"}
									fontSize={"18px"}
									fontFamily={"heading"}
									color={"gray.600"}
									justifyContent={"space-between"}
								>
									<Flex alignItems="center" justifyContent={"space-between"} w="100%" mt="25px">
										{isLiked ? (
											<TiHeartFullOutline
												size={40}
												color="red"
												cursor={RoleId === 1 ? "pointer" : "not-allowed"}
												onClick={() => {
													handleLike();
													setReload(!reload);
												}}
											/>
										) : (
											<TiHeartOutline
												size={40}
												color="red"
												cursor={RoleId === 1 ? "pointer" : "not-allowed"}
												onClick={() => {
													handleLike();
													setReload(!reload);
												}}
											/>
										)}
										<Flex alignItems="center" w="106px" h="40px" border="1px solid black" borderRadius="8px">
											<IconButton
												aria-label="Decrease Quantity"
												icon={<MinusIcon />}
												size="sm"
												onClick={decreaseQuantity}
												bg="transparent"
											/>
											<Box px="10px" fontSize="18px">
												{quantity}
											</Box>
											<IconButton
												aria-label="Increase Quantity"
												icon={<AddIcon />}
												size="sm"
												onClick={increaseQuantity}
												bg="transparent"
											/>
										</Flex>
										<AddToCartButton
											ProductId={product.id}
											quantity={quantity}
											name={product.productName}
											isText={true}
										/>
									</Flex>
								</Box>
							</Box>
						</Box>
						<CSSReset />
						<Tabs mt="10px" w="412px" justify="center" align="center">
							<TabList>
								<Tab width="25%" variant="unstyled" sx={tabStyles}>
									Product Details
								</Tab>
								<Tab width="25%" variant="unstyled" sx={tabStyles}>
									Promotions
								</Tab>
								<Tab width="25%" variant="unstyled" sx={tabStyles}>
									Product Reviews
								</Tab>
							</TabList>
							<TabPanels mb={"50px"}>
								<TabPanel w={"340px"}>
									<Stack fontWeight={"bold"} h={"350px"} justifyContent={"center"} fontSize={"30px"} w={"100%"}>
										<Box
											mt={"10px"}
											fontSize={"15px"}
											fontWeight={"semibold"}
											textAlign={"left"}
											w={"330px"}
											h={"80px"}
											textOverflow={"ellipsis"}
										>
											Description ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎:{" "}
											{truncate(product?.description, 100)}
										</Box>
										<Box
											mt={"5px"}
											fontSize={"15px"}
											fontWeight={"semibold"}
											textAlign={"left"}
											w={"330px"}
											textOverflow={"ellipsis"}
										>
											Weight ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ :{" "}
											{formatWeightGrams(product.weight)} grams
										</Box>
										<Box
											mt={"5px"}
											fontSize={"15px"}
											fontWeight={"semibold"}
											textAlign={"left"}
											w={"330px"}
											textOverflow={"ellipsis"}
										>
											Liked By Other Users ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: {product.likeCount} times
										</Box>
										<Box
											mt={"5px"}
											fontSize={"15px"}
											fontWeight={"semibold"}
											textAlign={"left"}
											w={"330px"}
											textOverflow={"ellipsis"}
										>
											Viewed By Other Users ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: {product.viewCount} times
										</Box>
										<Box
											mt={"5px"}
											fontSize={"15px"}
											fontWeight={"semibold"}
											textAlign={"left"}
											w={"330px"}
											textOverflow={"ellipsis"}
										>
											AlphaMart Nationwide Availability : {product.aggregateStock} units
										</Box>
									</Stack>
								</TabPanel>
								<TabPanel w={"340px"}>
									{discountData ? (
										<Box>
											<>
												{discountData.type === "Numeric" ? (
													<Box
														position={"relative"}
														h={"450px"}
														alignContent={"center"}
														justifyContent={"center"}
														fontSize={"30px"}
													>
														<Text
															zIndex={2}
															position={"absolute"}
															fontWeight={"bold"}
															fontSize={"35px"}
															textAlign={"center"}
															w={"100%"}
															mt={"110px"}
														>
															LIMITED TIME OFFER!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"210px"}>
															Rp. {(discountData?.nominal).toLocaleString("id-ID")} Reduction
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															Discount Ends In <br />
															<Badge colorScheme="red" fontSize={"18px"}>
																{timeRemaining?.days} D :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.hours} h :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.minutes} m :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.seconds} s
															</Badge>
														</Text>
														<Image
															fontWeight={"bold"}
															boxSize={"450px"}
															alignContent={"center"}
															justifyContent={"center"}
															zIndex={1}
															src={DiscountBanner}
															objectFit="scale-down"
														/>
													</Box>
												) : discountData.type === "Percentage" ? (
													<Box
														position={"relative"}
														h={"450px"}
														alignContent={"center"}
														justifyContent={"center"}
														fontSize={"30px"}
													>
														<Text
															zIndex={2}
															position={"absolute"}
															fontWeight={"bold"}
															fontSize={"35px"}
															textAlign={"center"}
															w={"100%"}
															mt={"110px"}
														>
															LIMITED TIME OFFER!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"210px"}>
															{discountData?.nominal} % OFF!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															Discount Ends In <br />
															<Badge colorScheme="red" fontSize={"18px"}>
																{timeRemaining?.days} h :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.hours} h :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.minutes} m :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.seconds} s
															</Badge>
														</Text>
														<Image
															fontWeight={"bold"}
															boxSize={"450px"}
															alignContent={"center"}
															justifyContent={"center"}
															zIndex={1}
															src={DiscountBanner}
															objectFit="scale-down"
														/>
													</Box>
												) : discountData.type === "Extra" ? (
													<Box
														position={"relative"}
														h={"450px"}
														alignContent={"center"}
														justifyContent={"center"}
														fontSize={"30px"}
													>
														<Text
															zIndex={2}
															position={"absolute"}
															fontWeight={"bold"}
															fontSize={"35px"}
															textAlign={"center"}
															w={"100%"}
															mt={"110px"}
														>
															LIMITED TIME OFFER!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"210px"}>
															BUY 1 GET {discountData?.nominal}
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															Offer Ends In <br />
															<Badge colorScheme="red" fontSize={"18px"}>
																{timeRemaining?.days} h :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.hours} h :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.minutes} m :
															</Badge>
															<Badge colorScheme="red" fontSize={"18px"} ml={"5px"}>
																{timeRemaining?.seconds} s
															</Badge>
														</Text>
														<Image
															fontWeight={"bold"}
															boxSize={"450px"}
															alignContent={"center"}
															justifyContent={"center"}
															zIndex={1}
															src={DiscountBanner}
															objectFit="scale-down"
														/>
													</Box>
												) : null}
											</>
										</Box>
									) : (
										<Image
											fontWeight={"bold"}
											boxSize={"350px"}
											alignContent={"center"}
											justifyContent={"center"}
											zIndex={1}
											src={NoDiscountBanner}
											objectFit="scale-down"
										/>
									)}
								</TabPanel>
								<TabPanel>{/* Product Review Tab */}</TabPanel>
							</TabPanels>
						</Tabs>
					</Stack>
				</Center>
			) : (
				//! PC DISPLAY
				<Box align={"center"}>
					<Flex
						justify={"center"}
						align={"center"}
						pt={{ base: "25px", sm: "45px" }}
						wrap={"wrap"}
						w={{ base: "1280px", sm: "1280px", md: "1280px" }}
						gap={"20px"}
					>
						<Box>
							<Box fontSize={{ base: "16px", sm: "18px", md: "20px" }} color="gray.600" mb="20px" textAlign={"left"}>
								<Link to="/search" style={{ textDecoration: "underline" }}>
									Browse Products
								</Link>
								{" > "}
								<Link
									to={`/search?q=&sort=productName&order=ASC&cat=${product.CategoryId}&p=1`}
									style={{ textDecoration: "underline" }}
								>
									{category}
								</Link>
								{" > "}
								<span style={{ fontWeight: "bold" }}>{product.productName}</span>
							</Box>
							<Box>
								<Image
									alignSelf={"left"}
									borderRadius={"5px"}
									boxShadow={"1px 2px 3px black"}
									w={{ base: "550px", sm: "550px", md: "600px", lg: "700px" }}
									h={{ base: "350px", sm: "350px", md: "400px", lg: "520px" }}
									src={`${process.env.REACT_APP_BASE_URL}/products/${product?.imgURL}`}
								/>
							</Box>
						</Box>
						<Box
							w={"450px"}
							h={"525px"}
							mt={"55px"}
							borderRadius={"20px"}
							ml={"50px"}
							boxShadow={"7px 7px 7px gray"}
							border={"1px solid black"}
						>
							<Box mb={"110px"} alignContent={"center"} mx={"25px"}>
								<Flex
									pt={"10px"}
									pb={"5px"}
									borderBottom={"1px solid #D3D3D3"}
									textShadow={"5px 5px 5px gray"}
									fontSize={{ base: "40px", sm: "42px", md: "49px" }}
									color={"gray.800"}
									fontFamily={"sans-serif"}
									fontWeight={"bold"}
									justify={"center"}
								>
									{product.productName}
								</Flex>
								<Flex
									color={"gray.700"}
									textShadow={"2px 2px 2px gray"}
									py={2}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
									justifyContent={discountData ? "space-between" : "center"}
								>
									{!discountData ? (
										<Box fontSize={"28px"} fontWeight={"bold"}>
											Rp. {product.price?.toLocaleString("id-ID")}
										</Box>
									) : discountData.type === "Extra" ? (
										<Box fontSize={"28px"} fontWeight={"thin"}>
											Rp. {product.price?.toLocaleString("id-ID")} For 2
										</Box>
									) : (
										<Box fontSize={"28px"} fontWeight={"thin"} textDecoration="line-through">
											Rp. {product.price?.toLocaleString("id-ID")}
										</Box>
									)}
									{discountData ? (
										<>
											{discountData.type === "Numeric" ? (
												<Box fontSize={"28px"} fontWeight={"bold"}>
													Rp. {newPrice?.toLocaleString("id-ID")}
												</Box>
											) : discountData.type === "Percentage" ? (
												<Box fontSize={"28px"} fontWeight={"bold"}>
													Rp. {newPrice?.toLocaleString("id-ID")}
												</Box>
											) : (
												<Badge colorScheme="green" color={"#24690D"} fontSize={"30px"}>
													B1G1
												</Badge>
											)}
										</>
									) : null}
								</Flex>
								<Flex
									fontSize={"20px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
									align={"center"}
									justify={"space-between"}
								>
									<Box fontWeight={"bold"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										In Stock ({currentBranchName}) :
									</Box>
									<Box ml={"5px"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										{stock} Units
									</Box>
								</Flex>
								<Flex
									fontSize={"20px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
									justify={"space-between"}
								>
									<Box fontWeight={"bold"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										Weight :
									</Box>
									<Box ml={"5px"} fontSize={{ base: "15px", sm: "17px", md: "24px" }} alignSelf={"flex-end"}>
										{(product.weight / 1000).toFixed(2)} Kg
									</Box>
								</Flex>
								<Box
									w={{ base: "300px", sm: "270px", md: "350px" }}
									fontSize={{ base: "15px", sm: "17px", md: "24px" }}
									fontFamily={"heading"}
									color={"gray.600"}
									pt={2}
								>
									<Flex alignItems="center" w="400px" ml={"-25px"} mt="25px">
										{isLiked ? (
											<TiHeartFullOutline
												size={45}
												color="red"
												cursor={RoleId === 1 ? "pointer" : "not-allowed"}
												onClick={() => {
													handleLike();
													setReload(!reload);
												}}
											/>
										) : (
											<TiHeartOutline
												size={45}
												color="red"
												cursor={RoleId === 1 ? "pointer" : "not-allowed"}
												onClick={() => {
													handleLike();
													setReload(!reload);
												}}
											/>
										)}
										<Flex
											alignItems="center"
											justifyContent="center"
											w="115px"
											h="41px"
											border="1px solid black"
											borderRadius="8px"
											ml={"126px"}
										>
											<IconButton
												aria-label="Decrease Quantity"
												icon={<MinusIcon />}
												size="sm"
												onClick={decreaseQuantity}
												bg="transparent"
											/>
											<Box px="10px" fontSize="18px">
												{quantity}
											</Box>
											<IconButton
												aria-label="Increase Quantity"
												icon={<AddIcon />}
												size="sm"
												onClick={increaseQuantity}
												bg="transparent"
											/>
										</Flex>
										<AddToCartButton
											ml={"5px"}
											ProductId={product.id}
											quantity={quantity}
											name={product.productName}
											isText={true}
										/>
									</Flex>
								</Box>
							</Box>
						</Box>
						<CSSReset />
						<Tabs mt="20px" w="1280px" isLazy="true" justify="center" align="center">
							<TabList>
								<Tab width="33.33%" variant="unstyled" sx={tabStyles}>
									Product Details
								</Tab>
								<Tab width="33.33%" variant="unstyled" sx={tabStyles}>
									Promotions
								</Tab>
								<Tab width="33.33%" variant="unstyled" sx={tabStyles}>
									Product Reviews
								</Tab>
							</TabList>
							<TabPanels mb={"50px"}>
								<TabPanel>
									<Box
										fontWeight={"bold"}
										h={"350px"}
										alignContent={"center"}
										justifyContent={"center"}
										fontSize={"30px"}
									>
										More Information On {product.productName} :
										<Box mt={"50px"} fontSize={"20px"} fontWeight={"semibold"} textAlign={"left"} ml={"20px"}>
											Description ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎:{" "}
											{truncate(product?.description, 100)}
										</Box>
										<Box mt={"30px"} fontSize={"20px"} fontWeight={"semibold"} textAlign={"left"} ml={"20px"}>
											Weight ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ :{" "}
											{formatWeightGrams(product.weight)} grams
										</Box>
										<Box mt={"30px"} fontSize={"20px"} fontWeight={"semibold"} textAlign={"left"} ml={"20px"}>
											Liked By Other Users ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: {product.likeCount} times
										</Box>
										<Box mt={"30px"} fontSize={"20px"} fontWeight={"semibold"} textAlign={"left"} ml={"20px"}>
											Viewed By Other Users ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎: {product.viewCount} times
										</Box>
										<Box mt={"30px"} fontSize={"20px"} fontWeight={"semibold"} textAlign={"left"} ml={"20px"}>
											AlphaMart Nationwide Availability : {product.aggregateStock} units
										</Box>
									</Box>
								</TabPanel>
								<TabPanel>
									{discountData ? (
										<Box>
											<>
												{discountData.type === "Numeric" ? (
													<Box
														position={"relative"}
														h={"450px"}
														alignContent={"center"}
														justifyContent={"center"}
														fontSize={"30px"}
													>
														<Text
															zIndex={2}
															position={"absolute"}
															fontWeight={"bold"}
															fontSize={"45px"}
															textAlign={"center"}
															w={"100%"}
															mt={"110px"}
														>
															LIMITED TIME OFFER!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"210px"}>
															Rp. {(discountData?.nominal).toLocaleString("id-ID")} Reduction
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															Discount Ends In
														</Text>
														<Stack zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															<Flex
																zIndex={2}
																position={"absolute"}
																justify={"center"}
																textAlign={"center"}
																w={"100%"}
																mt={"50px"}
															>
																<Badge colorScheme="red" fontSize={"25px"}>
																	{timeRemaining?.days} D :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.hours} h :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.minutes} m :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.seconds} s
																</Badge>
															</Flex>
														</Stack>
														<Image
															fontWeight={"bold"}
															w={"100%"}
															h={"450px"}
															alignContent={"center"}
															justifyContent={"center"}
															zIndex={1}
															src={DiscountBanner}
															objectFit={"fill"}
														/>
													</Box>
												) : discountData.type === "Percentage" ? (
													<Box
														position={"relative"}
														h={"450px"}
														alignContent={"center"}
														justifyContent={"center"}
														fontSize={"30px"}
													>
														<Text
															zIndex={2}
															position={"absolute"}
															fontWeight={"bold"}
															fontSize={"45px"}
															textAlign={"center"}
															w={"100%"}
															mt={"110px"}
														>
															LIMITED TIME OFFER!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"210px"}>
															{discountData?.nominal} % OFF!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															Discount Ends In
														</Text>
														<Stack zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															<Flex
																zIndex={2}
																position={"absolute"}
																justify={"center"}
																textAlign={"center"}
																w={"100%"}
																mt={"50px"}
															>
																<Badge colorScheme="red" fontSize={"25px"}>
																	{timeRemaining?.days} D :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.hours} h :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.minutes} m :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.seconds} s
																</Badge>
															</Flex>
														</Stack>
														<Image
															fontWeight={"bold"}
															w={"100%"}
															h={"450px"}
															alignContent={"center"}
															justifyContent={"center"}
															zIndex={1}
															src={DiscountBanner}
															objectFit={"fill"}
														/>
													</Box>
												) : discountData.type === "Extra" ? (
													<Box
														position={"relative"}
														h={"450px"}
														alignContent={"center"}
														justifyContent={"center"}
														fontSize={"30px"}
													>
														<Text
															zIndex={2}
															position={"absolute"}
															fontWeight={"bold"}
															fontSize={"45px"}
															textAlign={"center"}
															w={"100%"}
															mt={"110px"}
														>
															LIMITED TIME OFFER!
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"210px"}>
															BUY 1 GET {discountData?.nominal}
														</Text>
														<Text zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															Offer Ends In
														</Text>
														<Stack zIndex={2} position={"absolute"} textAlign={"center"} w={"100%"} mt={"290px"}>
															<Flex
																zIndex={2}
																position={"absolute"}
																justify={"center"}
																textAlign={"center"}
																w={"100%"}
																mt={"50px"}
															>
																<Badge colorScheme="red" fontSize={"25px"}>
																	{timeRemaining?.days} D :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.hours} h :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.minutes} m :
																</Badge>
																<Badge colorScheme="red" fontSize={"25px"} ml={"5px"}>
																	{timeRemaining?.seconds} s
																</Badge>
															</Flex>
														</Stack>
														<Image
															fontWeight={"bold"}
															w={"100%"}
															h={"450px"}
															alignContent={"center"}
															justifyContent={"center"}
															zIndex={1}
															src={DiscountBanner}
															objectFit={"fill"}
														/>
													</Box>
												) : null}
											</>
										</Box>
									) : (
										<Image
											fontWeight={"bold"}
											w={"100%"}
											h={"450px"}
											alignContent={"center"}
											justifyContent={"center"}
											src={NoDiscountBanner}
											objectFit={"cover"}
										/>
									)}
								</TabPanel>
								<TabPanel>
									<Stack h={"600px"} alignContent={"center"}>
										<Text fontSize={"30px"} fontWeight={"bold"}>
											What Others Said About {product.productName} :
										</Text>
										{reviews.length === 0 ? (
											<Image
												fontWeight={"bold"}
												w={"100%"}
												h={"480px"}
												alignContent={"center"}
												justifyContent={"center"}
												src={NoReview}
												objectFit="fill"
											/>
										) : (
											<Flex w={"1250px"} h={"550px"} justifyContent={"space-between"}>
												<Stack
													alignSelf={"center"}
													w={"300px"}
													h={"400px"}
													border={"5px ridge grey"}
													borderRadius={"15px"}
													position="sticky"
													top="0"
													zIndex="1"
													py={5}
													px={2}
												>
													<Flex align={"center"} justify={"center"}>
														{Array.from({ length: Math.floor(rating) }).map((_, index) => (
															<TbStarFilled key={index} size={35} color="#DA9100" />
														))}
														{rating % 1 === 0.5 ? <TbStarHalfFilled size={35} color="#DA9100" /> : null}
														{Array.from({ length: 5 - Math.ceil(rating) }).map((_, index) => (
															<TbStar key={index} size={35} color="grey" />
														))}
													</Flex>
													<Flex justify={"center"} align={"center"}>
														<PiShootingStarDuotone size={100} color="#DA9100" />
														<Text fontWeight={"bold"} fontSize={"60px"}>
															{rating}
														</Text>
														<Text fontSize={"20px"}> ‎ / 5.0</Text>
													</Flex>
													<Text>{totalReviewsStatic} Reviews</Text>
													<Flex align={"center"} justify={"center"}>
														<span>1 ‎</span>
														<TbStarFilled
															className="star-icon"
															size={25}
															cursor={oneStarStatic !== 0 ? "pointer" : "not-allowed"}
															onClick={() => {
																if (oneStarStatic !== 0) {
																	setSelectedRating(1);
																	setPage(1);
																	setReload2(!reload2);
																} else {
																	toast.info("Sorry, no 1 star review is available.", {
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
															}}
														/>
														<RatingBar filledPercentage={(oneStarStatic / totalReviewsStatic) * 100} /> ‎{" "}
														{oneStarStatic}
													</Flex>
													<Flex align={"center"} justify={"center"}>
														<span>2 ‎</span>
														<TbStarFilled
															className="star-icon"
															size={25}
															cursor={twoStarStatic !== 0 ? "pointer" : "not-allowed"}
															onClick={() => {
																if (twoStarStatic !== 0) {
																	setSelectedRating(2);
																	setPage(1);
																	setReload2(!reload2);
																} else {
																	toast.info("Sorry, no 2 star review is available.", {
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
															}}
														/>
														<RatingBar filledPercentage={(twoStarStatic / totalReviewsStatic) * 100} /> ‎{" "}
														{twoStarStatic}
													</Flex>
													<Flex align={"center"} justify={"center"}>
														<span>3 ‎</span>
														<TbStarFilled
															className="star-icon"
															size={25}
															cursor={threeStarStatic !== 0 ? "pointer" : "not-allowed"}
															onClick={() => {
																if (threeStarStatic !== 0) {
																	setSelectedRating(3);
																	setPage(1);
																	setReload2(!reload2);
																} else {
																	toast.info("Sorry, no 3 star review is available.", {
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
															}}
														/>
														<RatingBar filledPercentage={(threeStarStatic / totalReviewsStatic) * 100} /> ‎{" "}
														{threeStarStatic}
													</Flex>
													<Flex align={"center"} justify={"center"}>
														<span>4 ‎</span>
														<TbStarFilled
															className="star-icon"
															size={25}
															cursor={fourStarStatic !== 0 ? "pointer" : "not-allowed"}
															onClick={() => {
																if (fourStarStatic !== 0) {
																	setSelectedRating(4);
																	setPage(1);
																	setReload2(!reload2);
																} else {
																	toast.info("Sorry, no 4 star review is available.", {
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
															}}
														/>
														<RatingBar filledPercentage={(fourStarStatic / totalReviewsStatic) * 100} /> ‎{" "}
														{fourStarStatic}
													</Flex>
													<Flex align={"center"} justify={"center"}>
														<span>5 ‎</span>
														<TbStarFilled
															className="star-icon"
															size={25}
															cursor={fiveStarStatic !== 0 ? "pointer" : "not-allowed"}
															onClick={() => {
																if (fiveStarStatic !== 0) {
																	setSelectedRating(5);
																	setPage(1);
																	setReload2(!reload2);
																} else {
																	toast.info("Sorry, no 5 star review is available.", {
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
															}}
														/>
														<RatingBar filledPercentage={(fiveStarStatic / totalReviewsStatic) * 100} /> ‎{" "}
														{fiveStarStatic}
													</Flex>
												</Stack>
												<Stack overflowY={"auto"} className="scrollbar-4px" mt={"5px"}>
													{reviews.map((item) => (
														<Flex
															key={item.id}
															border={"1px ridge grey"}
															borderRadius={"100px"}
															w={"900px"}
															h={"150px"}
															p={5}
															alignSelf={"flex-end"}
															justifyContent={"space-between"}
														>
															<Flex w={"20%"} align={"center"} justify={"flex-start"}>
																{item.rating === 1 ? (
																	<Flex w={"155px"} h={"35px"} align={"center"} justify={"center"}>
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStar size={30} color="grey" />
																		<TbStar size={30} color="grey" />
																		<TbStar size={30} color="grey" />
																		<TbStar size={30} color="grey" />
																	</Flex>
																) : item.rating === 2 ? (
																	<Flex w={"155px"} h={"35px"} align={"center"} justify={"center"}>
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStar size={30} color="grey" />
																		<TbStar size={30} color="grey" />
																		<TbStar size={30} color="grey" />
																	</Flex>
																) : item.rating === 3 ? (
																	<Flex w={"155px"} h={"35px"} align={"center"} justify={"center"}>
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStar size={30} color="grey" />
																		<TbStar size={30} color="grey" />
																	</Flex>
																) : item.rating === 4 ? (
																	<Flex w={"155px"} h={"35px"} align={"center"} justify={"center"}>
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStar size={30} color="grey" />
																	</Flex>
																) : (
																	<Flex w={"155px"} h={"35px"} align={"center"} justify={"center"}>
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																		<TbStarFilled size={30} color="#DA9100" />
																	</Flex>
																)}
															</Flex>
															<Flex w={"60%"} flexDirection="column" alignItems="flex-start">
																<Flex align={"center"} w={"250px"}>
																	<Text fontWeight={"bold"} fontSize={"22px"}>
																		{censorUsername(item?.User?.username)}
																	</Text>
																	<Text fontStyle={"italic"} ml={"25px"}>
																		{categorizeDate(item?.createdAt)}
																	</Text>
																</Flex>
																<Text
																	style={{
																		fontSize: "18px",
																		overflow: "hidden",
																		textOverflow: "ellipsis",
																		whiteSpace: "break-spaces",
																		maxWidth: "100%",
																		maxHeight: "100px",
																	}}
																>
																	{item.comment}
																</Text>
															</Flex>
															<Flex w={"20%"} align={"center"} justify={"flex-end"}>
																<Image
																	boxSize={"100px"}
																	borderRadius={"5px"}
																	rounded={"50px"}
																	boxShadow={"1px 2px 3px black"}
																	src={`${process.env.REACT_APP_BASE_URL}/avatars/${
																		item.User.avatar !== null ? item.User.avatar : "default_not_set_thumb.png"
																	}`}
																/>
															</Flex>
														</Flex>
													))}
												</Stack>
											</Flex>
										)}
									</Stack>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Flex>
				</Box>
			)}
		</Box>
	);
};

export default ProductDetail;
