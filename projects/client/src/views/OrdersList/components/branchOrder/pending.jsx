import Axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Box, Button, Flex, FormControl, FormLabel, Image, Input, Select, Text } from "@chakra-ui/react";
import { HiOutlineTruck } from "react-icons/hi";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { EmptyList } from "../emptyList";
import { PaymentProofAdmin } from "./paymentProofAdmin";
import { DetailProcessModal } from "./ModalProcessing/detailOrderModal";

export const PendingOrders = ({ reload, setReload }) => {
	const [list, setList] = useState();
	const [searchName, setSearchName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [sort, setSort] = useState("DESC");
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const formatRupiah = (number) => {
		const formatter = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		});

		let formatted = formatter.format(number);
		formatted = formatted.replace("Rp", "Rp.");
		return formatted;
	};
	const ordersList = async (pageNum) => {
		try {
			const response = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/order/branchadmin?searchName=${searchName}&page=${pageNum}&limit=5&sort=${sort}&status=Pending payment confirmation&startDate=${startDate}&endDate=${endDate}`,
				{
					headers,
				}
			);
			setList(response.data.result);
			setPage(response.data.currentPage);
			setTotalPage(response.data.totalPage);
			setReload(true);
		} catch (error) {
			console.log(error);
		}
	};

	const prevPage = () => {
		if (page > 1) ordersList(page - 1);
	};
	const nextPage = () => {
		if (page < totalPage) {
			ordersList(page + 1);
		}
	};
	useEffect(() => {
		ordersList(page);
		// eslint-disable-next-line
	}, [startDate, endDate, searchName, sort, reload, page]);
	return (
		<Flex>
			<Flex justifyContent={"center"} direction={"column"} w={"full"} ml={"10px"}>
				<Flex justifyContent={"center"}>
					<Box>
						<FormControl>
							<FormLabel fontSize={"12px"} ml={"10px"}>
								Search by Name or Email
							</FormLabel>
							<Input
								borderRadius={"20px"}
								border="1px solid #373433"
								focusBorderColor="#373433"
								w={"200px"}
								placeholder="Search"
								type="search"
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
							/>
						</FormControl>
					</Box>
					<Box>
						<FormControl>
							<FormLabel fontSize={"12px"} ml={"15px"}>
								Sort by
							</FormLabel>
							<Select
								w={"105px"}
								ml={"10px"}
								border="1px solid #373433"
								borderRadius={"20px"}
								focusBorderColor="#373433"
								value={sort}
								onChange={(e) => setSort(e.target.value)}
							>
								<option value="DESC">Newest</option>
								<option value="ASC">Oldest</option>
							</Select>
						</FormControl>
					</Box>
					<Box>
						<FormControl>
							<FormLabel fontSize={"12px"} ml={"15px"}>
								Start Date
							</FormLabel>
							<Input
								borderRadius={"20px"}
								border="1px solid #373433"
								focusBorderColor="#373433"
								ml={"10px"}
								w={"150px"}
								placeholder="Date"
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</FormControl>
					</Box>
					<Box>
						<FormControl>
							<FormLabel fontSize={"12px"} ml={"15px"}>
								End Date
							</FormLabel>
							<Input
								borderRadius={"20px"}
								border="1px solid #373433"
								focusBorderColor="#373433"
								ml={"10px"}
								w={"150px"}
								placeholder="Date"
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</FormControl>
					</Box>
				</Flex>
				<Box
					w={"95%"}
					maxH={"55vh"}
					borderRadius={"10px"}
					boxShadow="0px 0px 3px gray"
					mt={"10px"}
					pb={"10px"}
					ml={"18px"}
					overflowY={"scroll"}
				>
					{list && list.length > 0 ? (
						list?.map((item, index) => {
							return (
								<Box
									key={index}
									w={"98%"}
									mt={"10px"}
									ml={"10px"}
									pb={"8px"}
									pl={"20px"}
									bg={"white"}
									borderRadius={"8px"}
									boxShadow="0px 0px 3px gray"
								>
									<Flex pt={"5px"}>
										<Text fontSize={"15px"} fontWeight={"bold"}>
											Shop
										</Text>
										<Text mt={"2px"} ml={"10px"} fontSize={"13px"}>
											{new Date(`${item.updatedAt}`)
												.toLocaleDateString("us-us", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "numeric",
													minute: "numeric",
													second: "numeric",
													hour12: false,
												})
												.replace("at", "|")}
										</Text>
										{item.status === "Sent" || item.status === "Received" ? (
											<Badge ml={"10px"} mt={"2px"} colorScheme="green">
												{item.status}
											</Badge>
										) : item.status === "Waiting for payment" || item.status === "Pending payment confirmation" ? (
											<Badge ml={"10px"} mt={"2px"} colorScheme="yellow">
												{item.status}
											</Badge>
										) : item.status === "Processing" ? (
											<Badge ml={"10px"} mt={"2px"} colorScheme="blue">
												{item.status}
											</Badge>
										) : (
											<Badge ml={"10px"} mt={"2px"} colorScheme="red">
												{item.status}
											</Badge>
										)}
										<Text mt={"2px"} ml={"10px"} fontFamily={"monospace"} fontSize={"13px"}>
											{item.invoice}
										</Text>
									</Flex>
									<Flex justifyContent={"space-between"}>
										<Box>
											{item.Order_details.map((item) => (
												<Flex mt={"10px"}>
													<Box
														as={Image}
														w={"100px"}
														bg={"gray.100"}
														src={`${process.env.REACT_APP_BASE_URL}/products/${item?.Product.imgURL}`}
													></Box>
													<Box>
														<Text textAlign={"start"} ml={"15px"} fontWeight={"bold"}>
															{item.Product.productName}
														</Text>
														<Text textAlign={"start"} ml={"15px"} color={"balck"} fontSize={"11px"}>
															{item.Product.description}
														</Text>
														<Text textAlign={"start"} ml={"15px"} color={"gray.500"} fontSize={"11px"}>
															{item.quantity} Items X {formatRupiah(item.Product.price)}
														</Text>
													</Box>
												</Flex>
											))}
											<Flex justifyContent={"start"}>
												<Box>
													<Text textAlign={"start"} fontSize={"15px"} fontWeight={"semibold"}>
														{item.Cart.User.firstName} {item.Cart.User.lastName}
													</Text>
													<Text textAlign={"start"} fontSize={"12px"} fontWeight={"light"} fontFamily={"serif"}>
														{item.Cart.User.email}
													</Text>
													<Text textAlign={"start"} fontSize={"12px"} fontWeight={"bold"} fontFamily={"serif"}>
														{item.Cart.User.phone}
													</Text>
													<Text textAlign={"start"} fontSize={"12px"} fontWeight={"light"}>
														{item.Address?.address}
													</Text>
													<Text textAlign={"start"} fontSize={"12px"} fontWeight={"light"}>
														{item.Address?.city}, {item.Address?.province}
													</Text>
												</Box>
											</Flex>
										</Box>
										<Flex direction={"column"} justifyContent={"end"} mt={"25px"} mr={"20px"}>
											<Flex justifyContent={"end"}>
												<HiOutlineTruck size={21} />
												<Text textAlign={"end"} ml={"5px"} color={"gray.500"} fontSize={"14px"}>
													{item.shipment} - {item.shipmentMethod}
												</Text>
											</Flex>
											{item.status !== "Cancelled" ? (
												<Text textAlign={"end"} ml={"5px"} color={"gray.500"} fontSize={"14px"}>
													ETA day(s): {item.etd}
												</Text>
											) : null}
											<Text textAlign={"end"} color={"gray.500"} fontSize={"15px"}>
												Total amount
											</Text>
											<Text textAlign={"end"} color={"gray.500"} fontWeight={"bold"} fontSize={"11px"}>
												{formatRupiah(item.subtotal)} - {formatRupiah(item.discount)}
											</Text>
											<Text textAlign={"end"} color={"black"} fontWeight={"bold"} fontSize={"18px"}>
												{formatRupiah(item.total)}
											</Text>
										</Flex>
									</Flex>
									<Flex justifyContent={"space-between"}>
										<Flex mt={"10px"} mr={"10px"}>
											<DetailProcessModal
												reload={reload}
												setReload={setReload}
												orderId={item?.id}
												paymentProof={item?.paymentProof}
												created={item?.createdAt}
												date={item?.updatedAt}
												status={item?.status}
												subtotal={item?.subtotal}
												tax={item?.tax}
												discount={item?.discount}
												total={item?.total}
												shipment={item?.shipment}
												shipmentMethod={item?.shipmentMethod}
												etd={item?.etd}
												label={item?.Address.label}
												address={item?.Address.address}
												subdistrict={item?.Address.subdistrict}
												city={item?.Address.city}
												province={item?.Address.province}
												postal_code={item?.Address.postal_code}
												quantity={item?.Order_details[0]?.quantity}
												productName={item?.Order_details[0]?.Product.productName}
												productPhoto={item?.Order_details[0]?.Product.productPhoto}
												description={item?.Order_details[0]?.Product.description}
												price={item?.Order_details[0]?.Product.price}
											/>
										</Flex>
										<Flex mt={"10px"} mr={"7px"} justifyContent={"end"} alignItems={"center"}>
											<PaymentProofAdmin
												reload={reload}
												setReload={setReload}
												orderId={item?.id}
												imgURL={item?.paymentProof}
											/>
										</Flex>
									</Flex>
								</Box>
							);
						})
					) : (
						<Flex justifyContent={"center"}>
							<EmptyList />
						</Flex>
					)}
				</Box>
				<Flex mt={"14px"} justifyContent={"center"}>
					<Button
						backgroundColor={"#000000"}
						color={"white"}
						mr={"5px"}
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
						transition="transform 0.3s ease-in-out"
						onClick={prevPage}
						disabled={page === 1}
					>
						<AiOutlineArrowLeft />
					</Button>
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
						transition="transform 0.3s ease-in-out"
						disabled
					>
						{page}
					</Button>
					<Button
						backgroundColor={"#000000"}
						color={"white"}
						ml={"5px"}
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
						transition="transform 0.3s ease-in-out"
						onClick={nextPage}
						disabled={page === totalPage}
					>
						<AiOutlineArrowRight />
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
