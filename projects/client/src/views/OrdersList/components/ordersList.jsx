import Axios from "axios";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Select,
	Text,
} from "@chakra-ui/react";
import { AiOutlineShopping } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import { MenuOrder } from "./menu";

export const OrdersList = () => {
	const [list, setList] = useState();
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const ordersList = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order`, { headers });
			setList(response.data.result);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		ordersList();
	}, []);
	return (
		<Box>
			<Heading>Your orders list</Heading>
			<Flex mt={"20px"} justifyContent={"center"}>
				<Input
					borderRadius={"20px"}
					border="1px solid #373433"
					focusBorderColor="#373433"
					w={"250px"}
					placeholder="Search"
					type="search"
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
				<Menu isLazy>
					<MenuButton
						textAlign={"start"}
						ml={"10px"}
						pl={"20px"}
						w={"100px"}
						border="1px solid #373433"
						borderRadius={"20px"}
						focusBorderColor="#373433"
						placeholder="Status"
					>
						Status
						<MenuList>
							<MenuItem>Waiting for payment</MenuItem>
							<MenuItem>Success</MenuItem>
							<MenuItem>Unsuccess</MenuItem>
							<MenuItem>Canceled</MenuItem>
						</MenuList>
					</MenuButton>
				</Menu>
				<Input
					borderRadius={"20px"}
					border="1px solid #373433"
					focusBorderColor="#373433"
					ml={"10px"}
					w={"150px"}
					placeholder="Date"
					type="date"
				/>
			</Flex>
			{list?.map((item) => {
				return (
					<Box
						pl={"20px"}
						w={"full"}
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
								Alphamart Bandung
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
						<Flex mt={"10px"} mr={"10px"} justifyContent={"end"} alignItems={"center"}>
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
							<MenuOrder orderId={item?.id} imgURL={item?.paymentProof} date={item?.createdAt} branch={"Bandung"} amount={item.total} />
						</Flex>
					</Box>
				);
			})}
		</Box>
	);
};
