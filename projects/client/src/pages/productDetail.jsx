import Axios from "axios";
import {
	Box,
	Button,
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { MinusIcon, AddIcon } from "@chakra-ui/icons";

const ProductDetail = () => {
	const { id } = useParams();
	// const isAdmin = useSelector((state) => state.user.value.isAdmin);
	const [product, setProduct] = useState([]);
	const [category, setCategory] = useState("");
	const [quantity, setQuantity] = useState(1);

	const fetchData = async () => {
		try {
			const productResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id}`);
			setProduct(productResponse.data.result);
			const categoryResponse = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/product/category/${productResponse.data.result.CategoryId}`
			);
			setCategory(categoryResponse.data.result.category);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, [id]);

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const increaseQuantity = () => {
		setQuantity(quantity + 1);
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

	const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

	return (
		<Box justify={"center"}>
			{isMobile ? (
				//! MOBILE DISPLAY
				<Center flexDirection="column" h="100%" w="90%">
					<Stack justify={"center"} align={"center"} wrap={"wrap"} gap={"20px"}>
						<Box>
							<Box fontSize={{ base: "16px", sm: "18px", md: "20px" }} color="gray.600" mb="20px" textAlign={"left"}>
								<Link to="/search" style={{ textDecoration: "underline" }}>
									Browse Products
								</Link>
								{" > "}
								<Link to={`/search/category/${product.CategoryId}`} style={{ textDecoration: "underline" }}>
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
						<Box
							w={"320px"}
							h={"325px"}
							borderRadius={"20px"}
							boxShadow={"7px 7px 7px gray"}
							mt={"10px"}
						>
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
								>
									<Box fontWeight={"bold"} fontSize={"16px"}>
										In Stock :
									</Box>
									<Box ml={"5px"} fontSize={"16px"}>
										{product.stock} Units
									</Box>
								</Flex>
								<Flex
									fontSize={"16px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
								>
									<Box fontWeight={"bold"} fontSize={"16px"}>
										Weight ‎ ‎ :
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
										<Flex
											alignItems="center"
											justifyContent="center"
											w="115px"
											h="45px"
											border="1px solid black"
											borderRadius="8px"
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
										<Button
											backgroundColor={"#000000"}
											color={"white"}
											_hover={{
												textColor: "#0A0A0B",
												bg: "#F0F0F0",
												_before: {
													bg: "inherit",
												},
												_after: {
													bg: "inherit",
												},
											}}
										>
											Add to Cart
										</Button>
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
									Choose Delivery Branch
								</Tab>
								<Tab width="25%" variant="unstyled" sx={tabStyles}>
									Product Reviews
								</Tab>
							</TabList>
							<TabPanels mb={"50px"}>
								<TabPanel>
									<Box fontWeight={"bold"}>Product Description :</Box>
									<Box mt={"35px"}>{product.description}</Box>
								</TabPanel>
								<TabPanel>{/* Choose Delivery Branch Tab */}</TabPanel>
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
								<Link to={`/search/category/${product.CategoryId}`} style={{ textDecoration: "underline" }}>
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
								>
									<Box fontSize={{ base: "25px", sm: "27px", md: "34px" }} fontWeight={"bold"}>
										Rp. {product.price?.toLocaleString("id-ID")}
									</Box>
								</Flex>
								<Flex
									fontSize={"20px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
								>
									<Box fontWeight={"bold"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										In Stock :
									</Box>
									<Box ml={"5px"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										{product.stock} Units
									</Box>
								</Flex>
								<Flex
									fontSize={"20px"}
									color={"gray.600"}
									py={3}
									borderBottom={"1px solid #D3D3D3"}
									fontFamily={"sans-serif"}
								>
									<Box fontWeight={"bold"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										Weight ‎ ‎ :
									</Box>
									<Box ml={"5px"} fontSize={{ base: "15px", sm: "17px", md: "24px" }}>
										{(product.weight / 1000).toFixed(2)} Kilograms
									</Box>
								</Flex>
								<Box
									w={{ base: "300px", sm: "270px", md: "350px" }}
									fontSize={{ base: "15px", sm: "17px", md: "24px" }}
									fontFamily={"heading"}
									color={"gray.600"}
									pt={2}
								>
									<Flex alignItems="center" w="100%" mt="25px">
										<Flex
											alignItems="center"
											justifyContent="center"
											w="115px"
											h="45px"
											border="1px solid black"
											borderRadius="8px"
											ml={"-25px"}
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
										<Button
											backgroundColor={"#000000"}
											color={"white"}
											ml={"25px"}
											_hover={{
												textColor: "#0A0A0B",
												bg: "#F0F0F0",
												_before: {
													bg: "inherit",
												},
												_after: {
													bg: "inherit",
												},
											}}
										>
											Add to Cart
										</Button>
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
									Choose Delivery Branch
								</Tab>
								<Tab width="33.33%" variant="unstyled" sx={tabStyles}>
									Product Reviews
								</Tab>
							</TabList>
							<TabPanels mb={"50px"}>
								<TabPanel>
									<Box fontWeight={"bold"}>Product Description :</Box>
									<Box mt={"35px"}>{product.description}</Box>
								</TabPanel>
								<TabPanel>{/* Choose Delivery Branch Tab */}</TabPanel>
								<TabPanel>{/* Product Review Tab */}</TabPanel>
							</TabPanels>
						</Tabs>
					</Flex>
				</Box>
			)}
		</Box>
	);
};

export default ProductDetail;
