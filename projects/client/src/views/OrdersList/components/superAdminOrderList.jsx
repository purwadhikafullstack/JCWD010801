import Axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Box, Button, Flex, Heading, Image, Input, Select, Text } from "@chakra-ui/react";
import { HiOutlineTruck } from "react-icons/hi";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineShopping } from "react-icons/ai";
import { EmptyList } from "./emptyList";
import { AdminSidebar } from "../../../components/navigation/adminSidebar";

export const SuperAdminOrdersList = () => {
	const [list, setList] = useState();
	const [branch, setBranch] = useState();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const [branchId, setBranchId] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [sort, setSort] = useState("DESC");
	// const [reload, setReload] = useState(false);
	const token = localStorage.getItem("token");
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
				`${process.env.REACT_APP_API_BASE_URL}/order/superadmin?search=${search}&page=${pageNum}&limit=4&sort=${sort}&branchId=${branchId}&status=${status}`,
				{
					headers,
					params: queryParams,
				}
			);
			console.log(response.data);
			setList(response.data.result);
			setPage(response.data.currentPage);
			setTotalPage(response.data.totalPage);
			// setReload(true);
		} catch (error) {
			console.log(error);
		}
	};

	const getBranches = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranch(response.data);
		} catch (err) {
			console.log(err);
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
		getBranches();
	}, [selectedDate, search, sort, branchId, status]);
	return (
		<Flex>
			<AdminSidebar />
			<Flex justifyContent={"center"} direction={"column"} w={"full"} ml={"10px"}>
				<Heading ml={"20px"} mt={"20px"}>
					All orders from all branches
				</Heading>
				<Flex mt={"20px"} justifyContent={"center"}>
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
						w={"115px"}
						ml={"10px"}
						border="1px solid #373433"
						borderRadius={"20px"}
						focusBorderColor="#373433"
						value={branchId}
						onChange={(e) => setBranchId(e.target.value)}
					>
						<option value="">Branch</option>
						{branch?.map((item) => {
							return (
								<option key={item?.id} value={item?.id}>
									{item?.name}
								</option>
							);
						})}
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
					borderRadius={"10px"}
					boxShadow="0px 0px 3px gray"
					mt={"10px"}
					pb={"10px"}
					ml={"18px"}
					maxH={"408px"}
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
									<Flex mt={"3px"}>
										<AiOutlineShopping color="blue" size={25} />
										<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
											Alphamart {item?.Cart?.Branch?.name}
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
														<Text ml={"15px"} fontWeight={"bold"}>
															{item.Product.productName}
														</Text>
														<Text ml={"15px"} color={"balck"} fontSize={"11px"}>
															{item.Product.description}
														</Text>
														<Text ml={"15px"} color={"gray.500"} fontSize={"11px"}>
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
								</Box>
							);
						})
					) : (
						<Flex justifyContent={"center"}>
							<EmptyList />
						</Flex>
					)}
				</Box>
				<Flex mt={"20px"} justifyContent={"center"}>
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
