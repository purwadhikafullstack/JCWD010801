import Axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Box, Button, Flex, Image, Input, Select, Text } from "@chakra-ui/react";
import { HiOutlineTruck } from "react-icons/hi";
import { AiOutlineShopping, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { EmptyList } from "../emptyList";
import { PaymentProofAdmin } from "./paymentProofAdmin";

export const PendingOrders = () => {
	const [list, setList] = useState();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [selectedDate, setSelectedDate] = useState("");
	const [sort, setSort] = useState("DESC");
	const [reload, setReload] = useState(false);
	const [status, setStatus] = useState("");
	const [branches, setBranches] = useState([]);
	const user = useSelector((state) => state?.user?.value);
	const token = localStorage.getItem("token");
	console.log(reload);
	const fetchBranchData = async () => {
		try {
			const branchResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(branchResponse.data);
		} catch (error) {
			console.log(error);
		}
	};
	const currentBranchInfo = branches.find((branch) => branch.id === user.BranchId);
	const currentBranchName = currentBranchInfo?.name;
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const ordersList = async (pageNum) => {
		try {
			const queryParams = {};
			if (selectedDate) {
				queryParams.date = selectedDate;
			}
			const response = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/order/branchadmin?search=${search}&page=${pageNum}&limit=4&sort=${sort}&status=Pending payment confirmation`,
				{
					headers,
					params: queryParams,
				}
			);
			setList(response.data.result);
			setPage(response.data.currentPage);
			setTotalPage(response.data.totalPage);
			// setReload(true);
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
		fetchBranchData();
	}, [selectedDate, search, sort, status]);
	return (
		<Flex>
			<Flex justifyContent={"center"} direction={"column"} w={"full"} ml={"10px"}>
				<Flex ml={"20px"} mt={"3px"}>
					<AiOutlineShopping color="blue" size={25} />
					<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
						Alphamart {currentBranchName}
					</Text>
				</Flex>
				<Flex justifyContent={"center"}>
					<Input
						borderRadius={"20px"}
						border="1px solid #373433"
						focusBorderColor="#373433"
						w={"250px"}
						placeholder="Search"
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
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
					<Select
						textAlign={"start"}
						pl={"10px"}
						w={"140px"}
						border="1px solid #373433"
						borderRadius={"20px"}
						focusBorderColor="#373433"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={""}>Status</option>
						<option value={"Waiting payment"}>Waiting for payment</option>
						<option value={"Pending payment confirmation"}>Pending payment confirmation</option>
						<option value={"Processing"}>Processing</option>
						<option value={"Sent"}>Sent</option>
						<option value={"Received"}>Received</option>
						<option value={"Cancelled"}>Cancelled</option>
					</Select>
					<Input
						borderRadius={"20px"}
						border="1px solid #373433"
						focusBorderColor="#373433"
						ml={"10px"}
						w={"150px"}
						placeholder="Date"
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
					/>
				</Flex>
				<Box
					w={"95%"}
					maxH={"55vh"}
					borderRadius={"10px"}
					boxShadow="0px 0px 3px gray"
					mt={"10px"}
					pb={"10px"}
					ml={"18px"}
					// maxH={"345px"}
					overflowY={"scroll"}
				>
					{list && list.length > 0 ? (
						list?.map((item) => {
							return (
								<Box
									w={"98%"}
									mt={"10px"}
									ml={"10px"}
									pb={"10px"}
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
											{new Date(`${item.updatedAt}`).toLocaleDateString("us-us", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
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
															{item.quantity} Items X Rp. {item.Product.price},00
														</Text>
													</Box>
												</Flex>
											))}
										</Box>
										<Flex direction={"column"} justifyContent={"end"} mt={"25px"} mr={"20px"}>
											<Flex textAlign={"end"} ml={"15px"}>
												<HiOutlineTruck size={21} />
												<Text ml={"5px"} color={"gray.500"} fontSize={"14px"}>
													{item.shipment} - {item.shipmentMethod}
												</Text>
											</Flex>
											<Text textAlign={"end"} color={"gray.500"} fontSize={"15px"}>
												Total amount
											</Text>
											<Text textAlign={"end"} color={"gray.500"} fontWeight={"bold"} fontSize={"11px"}>
												Rp. {item.subtotal},00 - {item.discount}%
											</Text>
											<Text textAlign={"end"} color={"black"} fontWeight={"bold"} fontSize={"18px"}>
												Rp. {item.total},00
											</Text>
										</Flex>
									</Flex>
									<Flex mt={"10px"} mr={"10px"} justifyContent={"end"} alignItems={"center"}>
										<PaymentProofAdmin
											reload={reload}
											setReload={setReload}
											orderId={item?.id}
											imgURL={item?.paymentProof}
										/>
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
