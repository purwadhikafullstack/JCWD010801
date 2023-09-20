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

function Order() {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
	const [address, setAddress] = useState([]);
	const [branch, setBranch] = useState([]);
	const [totalPage, setTotalPage] = useState(1);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
	const [selectedShippingCourier, setSelectedShippingCourier] = useState("");
	const [dataOngkir, setDataOngkir] = useState({});
	const [cost, setCost] = useState({});
	const reduxStore = useSelector((state) => state?.user);
	const firstName = reduxStore?.value?.firstName;
	const lastName = reduxStore?.value?.lastName;
	const phone = reduxStore?.value?.phone;
	const token = localStorage.getItem("token");
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
	const getBranch = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches/`);
			console.log(response);
			setBranch(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	console.log(address);
	console.log(branch);
	console.log("method", selectedShippingMethod);
	const [items, setItems] = useState([
		{
			id: 1,
			name: "Product A",
			price: 100000,
			quantity: 2,
			imageUrl: "https://s3.bukalapak.com/img/362652081/w-1000/nutribaby-1-400g-800x800.jpg",
			desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum, nesciunt? Sunt, dolore ipsum suscipit corporis voluptatem praesentium fugit necessitatibus rem, ab odit saepe! Totam, commodi quod minus dolore natus sapiente!",
			weight: 10,
		},
		{
			id: 2,
			name: "Product B",
			price: 75000,
			quantity: 1,
			imageUrl: "https://s3.bukalapak.com/img/3743886257/w-1000/Vidoran_6_12_bulan___Susu_Bayi_.jpg",
			desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum, nesciunt? Sunt, dolore ipsum suscipit corporis voluptatem praesentium fugit necessitatibus rem, ab odit saepe! Totam, commodi quod minus dolore natus sapiente!",
			weight: 10,
		},
		{
			id: 3,
			name: "Product B",
			price: 75000,
			quantity: 1,
			imageUrl: "https://s3.bukalapak.com/img/3743886257/w-1000/Vidoran_6_12_bulan___Susu_Bayi_.jpg",
			desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum, nesciunt? Sunt, dolore ipsum suscipit corporis voluptatem praesentium fugit necessitatibus rem, ab odit saepe! Totam, commodi quod minus dolore natus sapiente!",
			weight: 10,
		},
		{
			id: 4,
			name: "Product B",
			price: 75000,
			quantity: 1,
			imageUrl: "https://s3.bukalapak.com/img/3743886257/w-1000/Vidoran_6_12_bulan___Susu_Bayi_.jpg",
			weight: 10,
		},
		{
			id: 5,
			name: "Product B",
			price: 75000,
			quantity: 1,
			imageUrl: "https://s3.bukalapak.com/img/3743886257/w-1000/Vidoran_6_12_bulan___Susu_Bayi_.jpg",
			weight: 10,
		},
	]);

	const getOngkir = async (courier) => {
		try {
			const data = {
				courier: courier,
				destination: address[0]?.city_id,
				weight: 1000,
				origin: branch[0]?.city_id,
			};
			const response = await Axios.post("http://localhost:8000/api/order/shipment", data);
			console.log(response);
			setDataOngkir(response.data.data);
		} catch (error) {
			console.log(error);
		}
	};
	console.log("dataOngkir: ", dataOngkir);
	const formatToRupiah = (value) => {
		const formatter = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		return formatter.format(value);
	};

	console.log("cost: ", cost);

	const calculateTotal = () => {
		return items.reduce((total, item) => total + item.price * item.quantity, 0);
	};
	useEffect(() => {
		getAddress();
		getBranch();
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
						<Box  w={"full"} borderRadius={8} pl={"4"}>
							<Text fontWeight={"bold"} >
								{firstName} {lastName}
							</Text>
							<Text>{phone}</Text>
							<Text lineHeight={4} color={"gray"}>{address[0]?.address}</Text>
							<Text lineHeight={4} color={"gray"}>{address[0]?.city}, {address[0]?.province}, {address[0]?.postal_code}</Text>
							
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
						{items.map((item, index) => (
							<Box mb={"4"} boxShadow={"md"} p={4} borderRadius={8} key={index}>
								<Flex gap={4} flexDirection={isSmallerThan768 ? "column" : ""}>
									<Flex gap={4} flex={isSmallerThan768 ? "" : "0 0 100%"} maxWidth={250}>
										<Image src={item.imageUrl} alt={item.name} boxSize={20} />
										<Box>
											<Text fontWeight={"bold"}>{item.name}</Text>

											<Text>
												{item.quantity} x {formatToRupiah(item.price)}
											</Text>
											<Text>{item.weight * item.quantity} gram(s)</Text>
											<Text fontWeight={"bold"} fontSize={"lg"}>
												{formatToRupiah(item.price * item.quantity)}
											</Text>
										</Box>
									</Flex>
									<Box>
										<Text fontSize={"sm"}>{item.desc}</Text>
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
							setSelectedShippingMethod("")
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
								setCost(objGetCost);
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
							<Text>{formatToRupiah(cost.cost[0].value)}</Text>
							</Flex>
							<Flex justify={"space-between"}>
							<Text fontWeight={"bold"}>Estimated shipping</Text>
							<Text>{cost.cost[0].etd}</Text>
							</Flex>
							
						</Box>
					) : null}
					<Box mt={8}>
						<Text fontSize="2xl" flexGrow={1}>
							Total: {formatToRupiah(calculateTotal())}
						</Text>
						<Spacer />
						<Button colorScheme="blue" size="lg" mt={8} w={"full"}>
							Place Order
						</Button>
					</Box>
				</Box>
			</Flex>
		</Container>
	);
}

export default Order;
