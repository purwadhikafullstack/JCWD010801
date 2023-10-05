import { useEffect, useState } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	Select,
	Image,
	Flex,
	Spacer,
	useMediaQuery,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Menu,
	MenuDivider,
	Icon,
	FormControl,
} from "@chakra-ui/react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ButtonTemp } from "../../../components/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckIcon } from "@chakra-ui/icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { refreshCart } from "../../../redux/cartSlice";
function Order() {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank-transfer");
	const [address, setAddress] = useState([]);
	const [branch, setBranch] = useState({});
	const [selectedAddress, setSelectedAddress] = useState({});
	const [dataOngkir, setDataOngkir] = useState({});
	const [item, setItem] = useState([]);
	const [subTotalItem, setSubTotalItem] = useState([]);
	const [shipmentFee, setShipmentFee] = useState();
	const [etd, setEtd] = useState("");
	const [filteredAddress, setFilteredAddress] = useState([]);
	const [shipmentMethods, setShipmentMethods] = useState("");
	const [shipments, setShipments] = useState("");
	const [discount, setDiscount] = useState(0);
	const reduxStore = useSelector((state) => state?.user);
	const firstName = reduxStore?.value?.firstName;
	const lastName = reduxStore?.value?.lastName;
	const phone = reduxStore?.value?.phone;
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const getFilterAddress = (address) => address.filter((item) => item.city_id === branch?.city_id);

	const voucher = useSelector((state) => state.voucher.value);

	const getCartItems = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
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
			});
			if (response.data.total_addresses === 0) {
				navigate("/profile");
				toast.warn("You must add your address first, before continue your order", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			}
			setAddress(response.data.result);
			setSelectedAddress(response.data.result[0]);
		} catch (error) {}
	};

	useEffect(() => {
		setFilteredAddress(getFilterAddress(address));
	}, [address]);

	const totalWeight = item.reduce((total, item) => {
		return total + item.Product.weight * item.quantity;
	}, 0);

	const getRajaOngkir = async (courier) => {
		try {
			const data = {
				courier: courier,
				destination: selectedAddress?.city_id,
				weight: totalWeight,
				origin: branch?.city_id,
			};
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/order/shipment`, data);
			setDataOngkir(response.data.data);
		} catch (error) {}
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

	const countDiscount = (shipmentFeeDiscount) => {
        if ( voucher.isPercentage && voucher.type === "Shipment" ) return setDiscount((shipmentFeeDiscount * voucher.nominal / 100))
        else if ( voucher.isPercentage && voucher.type === "Total purchase" ) {
			if ((totalSubtotalItem * voucher.nominal / 100) > voucher.maxDisc) return setDiscount(voucher.maxDisc)
			else return setDiscount(totalSubtotalItem * voucher.nominal / 100)
		} 
		else setDiscount(voucher.nominal)
    }
	const totalSubtotalItem = subTotalItem.reduce((total, item) => {
		const subtotalValue = parseInt(item.subtotal, 10);
		return total + subtotalValue;
	}, 0);
	const tax = voucher.VoucherId ? (totalSubtotalItem + shipmentFee - discount) / 10 : (totalSubtotalItem + shipmentFee) / 10;
	const total = voucher.VoucherId ? tax + (totalSubtotalItem + shipmentFee - discount) : tax + (totalSubtotalItem + shipmentFee) ;
	const subtotal = totalSubtotalItem + shipmentFee;
	const validationSchema = Yup.object({
		shipmentMethod: Yup.string().required("Shipping method is required"),
		shipment: Yup.string().required("Shipping courier is required"),
	});
	const handleSubmit = async (data) => {
		try {
			data = {
				shipment: shipments,
				shipmentMethod: shipmentMethods,
				etd: etd,
				shippingFee: shipmentFee,
				tax: tax,
				total: total,
				subtotal: subtotal,
				discount: discount,
				AddressId: selectedAddress.id,
				VoucherId: voucher.VoucherId
			};
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/order/`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// voucher.VoucherId && await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/voucher/${voucher.VoucherId}`, {}, {
			// 	headers: {
			// 		Authorization: `Bearer ${token}`,
			// 	},
			// });

			const result = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/latest-id`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success(response.data.message, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});

			dispatch(refreshCart());
			navigate("/profile");

			await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/order/expire/${result.data.latestId}`, {}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

		} catch (error) {
			toast.error(error?.response.data.error.message, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		}
	};
	useEffect(() => {
		getAddress();
		getCartItems();
	}, []);
	const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");
	return (
		<Formik
			initialValues={{
				shipmentMethod: "",
				shipment: "",
			}}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<Form>
					<Container maxW="container.lg" py={8}>
						<Heading as="h1" size="xl" mb={4}>
							Checkout
						</Heading>
						<Flex columnGap={"8"} flexDirection={isSmallerThan768 ? "column" : ""}>
							<Box flex={"60%"}>
								<VStack spacing={4} align="start">
									<Text fontSize="xl">Shipping Information</Text>
									<Flex justify={"space-evenly"} w={"full"}>
										<Box w={"full"} borderRadius={8} pl={"4"}>
											<Text fontWeight={"bold"}>
												{firstName} {lastName}
											</Text>
											<Text>{phone}</Text>
											<Text lineHeight={4} color={"gray"}>
												{selectedAddress.address}
											</Text>
											<Text lineHeight={4} color={"gray"}>
												{selectedAddress.city}, {selectedAddress.province}, {selectedAddress.postal_code}
											</Text>
										</Box>
										<Menu>
											<MenuButton as={Button} pl="10px" pr="22px" py="0px">
												<Text fontSize="xs">Select Address</Text>
											</MenuButton>
											<MenuList>
												{filteredAddress?.map((item, index) => (
													<Box key={index}>
														<MenuItem onClick={() => setSelectedAddress(item)}>
															<Box>
																<Flex justify={"space-between"} w={"full"}>
																	<Text fontWeight={"bold"} mb={2} px={3}>
																		{item.label}
																	</Text>
																	{item.id === selectedAddress.id && (
																		<Icon as={CheckIcon} color="teal.500" fontSize="13px" />
																	)}
																</Flex>
																<Text lineHeight={4} color={"gray"} mb={1} px={3}>
																	{item.address}
																</Text>
																<Text lineHeight={4} color={"gray"} mb={2} px={3}>
																	{item.city}, {item.province}, {item.postal_code}
																</Text>
															</Box>
														</MenuItem>
														<MenuDivider />
													</Box>
												))}
											</MenuList>
										</Menu>
									</Flex>
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
								<Field name="shipment">
									{({ field }) => (
										<FormControl>
											<Select
												{...field}
												placeholder="Select Courier"
												id="shipment"
												onChange={(e) => {
													getRajaOngkir(e.target.value);
													props.setFieldValue("shipment", e.target.value);
													setShipments(e.target.value);
													setShipmentMethods("");
												}}
											>
												<option value="jne">JNE</option>
												<option value="pos">POS</option>
												<option value="tiki">TIKI</option>
											</Select>
											<ErrorMessage name="shipment" component="div" style={{ color: "red" }} />
										</FormControl>
									)}
								</Field>
								{shipments ? (
									<Field name="shipmentMethod">
										{({ field }) => (
											<FormControl>
												<Select
													{...field}
													mt={6}
													placeholder="Select Shipping Method"
													id="shipmentMethod"
													onChange={(e) => {
														props.setFieldValue("shipmentMethod", e.target.value);
														setShipmentMethods(e.target.value);
														const objGetCost = dataOngkir?.costs?.find((item) => item.service === e.target.value);
														setShipmentFee(objGetCost.cost[0].value);
														setEtd(objGetCost.cost[0].etd);
														countDiscount(objGetCost.cost[0].value);
													}}
												>
													{dataOngkir?.costs?.map((item, index) => (
														<option value={item.service} key={index}>
															{item.service}
														</option>
													))}
												</Select>
												<ErrorMessage name="shipmentMethod" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
								) : null}
								{shipmentMethods && shipments ? (
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
										{voucher.VoucherId && (
											<Flex justify={"space-between"}>
												<Text fontWeight={"bold"}>{voucher.type === "Shipment" ? "Shipment" : "Shopping"} Discount</Text>
												<Text>{formatToRupiah(discount)}</Text>
											</Flex>
										)}
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
								</Box>
								<ButtonTemp
									type="submit"
									size="lg"
									mt={8}
									w={"full"}
									content={"Place Order"}
									isDisabled={!props.dirty || !props.isValid}
								/>
							</Box>
						</Flex>
					</Container>
				</Form>
			)}
		</Formik>
	);
}

export default Order;
