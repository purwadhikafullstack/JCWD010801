import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Button,
	Input,
	Select,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Image,
	Flex,
	Spacer,
	useMediaQuery,
} from "@chakra-ui/react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { ButtonTemp } from "../../../components/button";

function Order() {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
	const [address, setAddress] = useState([]);
	const [branch, setBranch] = useState({});
	const [totalPage, setTotalPage] = useState(1);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
	const [selectedShippingCourier, setSelectedShippingCourier] = useState("");
	const [dataOngkir, setDataOngkir] = useState({});
	const [cost, setCost] = useState({});
	const [item, setItem] = useState([]);
	const [subTotalItem, setSubTotalItem] = useState([]);
	const [shipmentFee, setShipmentFee] = useState();
	const [etd, setEtd] = useState("");
	const reduxStore = useSelector((state) => state?.user);
	const firstName = reduxStore?.value?.firstName;
	const lastName = reduxStore?.value?.lastName;
	const phone = reduxStore?.value?.phone;
	const token = localStorage.getItem("token");
	const getCartItems = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response);
			setBranch(response.data.cart.Branch);
			setItem(response.data.cart_items);
			setSubTotalItem(response.data.subtotal);
		} catch (error) {}
	};

	const getAddress = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					search,
					page,
					sort: "asc",
				},
			});
			setAddress(response.data.result);
			setTotalPage(response.data.totalPage);
		} catch (error) {}
	};

	const totalWeight = item.reduce((total, item) => {
		return total + item.Product.weight * item.quantity;
	}, 0);

	const getOngkir = async (courier) => {
		try {
			const data = {
				courier: courier,
				destination: address[0]?.city_id,
				weight: totalWeight,
				origin: branch?.city_id,
			};
			const response = await Axios.post("http://localhost:8000/api/order/shipment", data);

			setDataOngkir(response.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const formatToRupiah = (value) => {
		const formatter = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		return formatter.format(value);
	};

	console.log("subtotal: ", subTotalItem);
	const totalSubtotalItem = subTotalItem.reduce((total, item) => {
		const subtotalValue = parseInt(item.subtotal, 10); // Mengonversi subtotal menjadi angka
		return total + subtotalValue;
	}, 0);

	const tax = (totalSubtotalItem + shipmentFee) / 10;
	const total = tax + (totalSubtotalItem + shipmentFee);
	const subtotal = totalSubtotalItem + shipmentFee;
	console.log(total);
	const handleSubmit = async (data) => {
		try {
			data = {
				shipment: selectedShippingCourier,
				shipmentMethod: selectedShippingMethod,
				etd: etd,
				shippingFee: shipmentFee,
				tax: tax,
				total: total,
				subtotal: subtotal,
				discount: 0,
			};
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/order/`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getCartItems();
		getAddress();
		if (page > totalPage) {
			setPage(totalPage);
		}
	}, [search, page, totalPage]);
	const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");
	return (
		<Container maxW="container.lg" py={8}>
			<Heading as="h1" size="xl" mb={4}>
				Checkout
			</Heading>
			<Flex columnGap={"8"} flexDirection={isSmallerThan768 ? "column" : ""}>
				<Box flex={"60%"}>
					<VStack spacing={4} align="start">
						<Text fontSize="xl">Shipping Information</Text>
						<Box w={"full"} borderRadius={8} pl={"4"}>
							<Text fontWeight={"bold"}>
								{firstName} {lastName}
							</Text>
							<Text>{phone}</Text>
							<Text lineHeight={4} color={"gray"}>
								{address[0]?.address}
							</Text>
							<Text lineHeight={4} color={"gray"}>
								{address[0]?.city}, {address[0]?.province}, {address[0]?.postal_code}
							</Text>
						</Box>
					</VStack>
					<Box mt={isSmallerThan768 ? 8 : 4}>
						<Text fontSize="xl" mb={4}>
							Payment Information
						</Text>
						<VStack spacing={4} align="start">
							<Select
								placeholder="Payment Method"
								value={selectedPaymentMethod}
								onChange={(e) => setSelectedPaymentMethod(e.target.value)}
							>
								<option value="bank-transfer">Bank Transfer</option>
								<option value="credit-card" disabled={true}>
									Credit Card
								</option>
								<option value="e-wallet" disabled={true}>
									E-Wallet
								</option>
							</Select>
						</VStack>
					</Box>
					<Box mt={8}>
						<Text fontSize="xl" mb={4}>
							Shopping Cart
						</Text>
						{item.map((item, index) => (
							<Box mb={"4"} boxShadow={"md"} p={4} borderRadius={8} key={index}>
								<Flex gap={4} flexDirection={isSmallerThan768 ? "column" : ""}>
									<Flex gap={4} flex={isSmallerThan768 ? "" : "0 0 100%"} maxWidth={250}>
										<Image
											src={`${process.env.REACT_APP_BASE_URL}/products/${item.Product.imgURL}`}
											alt={item.name}
											boxSize={20}
										/>
										<Box>
											<Text fontWeight={"bold"}>{item.Product.productName}</Text>

											<Text>
												{item.quantity} x {formatToRupiah(item.Product.price)}
											</Text>
											<Text>{item.Product.weight * item.quantity} gram(s)</Text>
											<Text fontWeight={"bold"} fontSize={"lg"}>
												{formatToRupiah(item.Product.price * item.quantity)}
											</Text>
										</Box>
									</Flex>
									<Box>
										<Text fontSize={"sm"}>{item.Product.description}</Text>
									</Box>
								</Flex>
							</Box>
						))}
					</Box>
				</Box>
				<Box boxShadow={"lg"} p={4} borderRadius={8} h={"max-content"} flex={"40%"} position={"sticky"} top={24}>
					<Text fontSize="xl" mb={4}>
						Shipping Method
					</Text>
					<Select
						placeholder="Select Courier"
						value={selectedShippingCourier}
						onChange={(e) => {
							setSelectedShippingCourier(e.target.value);
							getOngkir(e.target.value);
							setSelectedShippingMethod("");
						}}
					>
						<option value="jne">JNE</option>
						<option value="pos">POS</option>
						<option value="tiki">TIKI</option>
					</Select>
					{selectedShippingCourier ? (
						<Select
							mt={6}
							placeholder="Select Shipping Method"
							value={selectedShippingMethod}
							onChange={(e) => {
								setSelectedShippingMethod(e.target.value);
								const objGetCost = dataOngkir?.costs?.find((item) => item.service === e.target.value);
								console.log(objGetCost);
								setCost(objGetCost);
								setShipmentFee(objGetCost.cost[0].value);
								setEtd(objGetCost.cost[0].etd);
							}}
						>
							{dataOngkir?.costs?.map((item, index) => (
								<option value={item.service} key={index}>
									{item.service}
								</option>
							))}
						</Select>
					) : null}
					{selectedShippingMethod && selectedShippingCourier ? (
						<Box mt={6}>
							<Flex justify={"space-between"}>
								<Text fontWeight={"bold"}>Shipment fee</Text>
								<Text>{formatToRupiah(shipmentFee)}</Text>
							</Flex>
							<Flex justify={"space-between"}>
								<Text fontWeight={"bold"}>Estimated shipping day(s)</Text>
								<Text>{etd}</Text>
							</Flex>
							<Flex justify={"space-between"}>
								<Text fontWeight={"bold"}>Subtotal</Text>
								<Text>{formatToRupiah(subtotal)}</Text>
							</Flex>
							<Flex justify={"space-between"}>
								<Text fontWeight={"bold"}>Tax</Text>
								<Text>{formatToRupiah(tax)}</Text>
							</Flex>
						</Box>
					) : null}
					<Box mt={8}>
						{!isNaN(total) ? (
							<Text fontSize="2xl" flexGrow={1}>
								Total: {formatToRupiah(total)}
							</Text>
						) : null}
						<Spacer />
						<ButtonTemp size="lg" mt={8} w={"full"} onClick={handleSubmit} content={"Place Order"} />
					</Box>
				</Box>
			</Flex>
		</Container>
	);
}

export default Order;
