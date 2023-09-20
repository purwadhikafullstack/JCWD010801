import Axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Box, Button, Flex, Heading, Image, Input, Select, Text } from "@chakra-ui/react";
import { AiOutlineShopping } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { AdminSidebar } from "../../../components/navigation/adminSidebar";

export const BranchAdminOrdersList = () => {
	const [list, setList] = useState();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [selectedDate, setSelectedDate] = useState("");
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
				`${process.env.REACT_APP_API_BASE_URL}/order/branchadmin?search=${search}&page=${pageNum}&limit=4`,
				{
					headers,
					params: queryParams,
				}
			);
			setList(response.data.result);
			setPage(response.data.currentPage);
			setTotalPage(response.data.totalPage);
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
	}, [selectedDate, search]);
	return (
		<Flex>
			<AdminSidebar />
			<Flex justifyContent={"center"} direction={"column"} w={"full"} ml={"20px"}>
				<Heading>Admin orders list</Heading>
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
						placeholder="Sort"
					>
						<option>All</option>
					</Select>
					<Select
						textAlign={"start"}
						pl={"10px"}
						w={"140px"}
						border="1px solid #373433"
						borderRadius={"20px"}
						focusBorderColor="#373433"
						placeholder="Status"
					>
						Status
						<option>Waiting for payment</option>
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
				{list?.map((item) => {
					return (
						<Box
							pl={"20px"}
							w={"98%"}
							pb={"10px"}
							bg={"white"}
							mt={"20px"}
							borderRadius={"8px"}
							boxShadow="0px 0px 3px gray"
						>
							<Flex pt={"5px"}>
								<Text fontSize={"15px"} fontWeight={"bold"}>
									Shop
								</Text>
								<Text mt={"2px"} ml={"10px"} fontSize={"13px"}>
									{new Date(`${item.Order.createdAt}`).toLocaleDateString("us-us", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</Text>
								<Badge ml={"10px"} mt={"2px"} colorScheme="green">
									{item.Order.status}
								</Badge>
								<Text mt={"2px"} ml={"10px"} fontFamily={"monospace"} fontSize={"13px"}>
									INV/20230813/MPL/3400120239
								</Text>
							</Flex>
							<Flex mt={"3px"}>
								<AiOutlineShopping color="blue" size={25} />
								<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
									Alphamart {item.Order.Cart.Branch.name}
								</Text>
							</Flex>
							<Flex justifyContent={"space-between"}>
								<Box>
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
											<Text ml={"15px"} color={"gray.500"} fontSize={"11px"}>
												{item.quantity} Items X {item.Product.price}{" "}
											</Text>
										</Box>
									</Flex>
								</Box>
								<Flex direction={"column"} justifyContent={"end"} mt={"25px"} mr={"20px"}>
									<Text color={"gray.500"} fontSize={"15px"}>
										Total amount
									</Text>
									<Text color={"black"} fontWeight={"bold"} fontSize={"18px"}>
										Rp. {item.Order.subtotal},00
									</Text>
								</Flex>
							</Flex>
							<Flex mt={"10px"} justifyContent={"end"}>
								<Button
									my={"auto"}
									backgroundColor={"#000000"}
									color={"white"}
									mr={"10px"}
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
									Review
								</Button>
								<Flex mr={"10px"} alignItems={"center"}>
									<BsThreeDotsVertical size={25} />
								</Flex>
							</Flex>
						</Box>
					);
				})}
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