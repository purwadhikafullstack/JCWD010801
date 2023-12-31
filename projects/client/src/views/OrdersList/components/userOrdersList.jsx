import Axios from "axios";
import ReviewModal from "./reviewModal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState } from "react";
import {
	Badge,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Image,
	Input,
	Select,
	Text,
} from "@chakra-ui/react";
import { HiOutlineTruck } from "react-icons/hi";
import { AiOutlineShopping, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { MenuOrder } from "./menu";
import { EmptyList } from "./emptyList";
import { DetailProcessModal } from "./branchOrder/ModalProcessing/detailOrderModal";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmButtonOrder2 } from "./branchOrder/ActionButton/confirmButtonOrder";
import { UploadProofButton } from "./branchOrder/ActionButton/uploadButtonOrder";

export const UserOrdersList = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const [list, setList] = useState();
	const [branch, setBranch] = useState();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const [branchId, setBranchId] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [sort, setSort] = useState("DESC");
	const [reload, setReload] = useState(false);
	// const [showReviewButton, setShowReviewButton] = useState("");

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
				`${process.env.REACT_APP_API_BASE_URL}/order?search=${search}&page=${pageNum}&limit=5&sort=${sort}&status=${status}&branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`,
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
		// eslint-disable-next-line
	}, [startDate, endDate, branchId, search, sort, status, reload, branchId]);
	return (
		<Box>
			<Heading>Your orders list</Heading>
			<Flex flexWrap={"wrap"} maxWidth={"full"} mt={"20px"} justifyContent={"center"}>
				<Box>
					<FormControl>
						<FormLabel fontSize={"12px"} ml={"12px"}>
							Invoice Number
						</FormLabel>
						<Input
							borderRadius={"20px"}
							mr={"10px"}
							border="1px solid #373433"
							focusBorderColor="#373433"
							w={"150px"}
							placeholder="Search"
							type="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</FormControl>
				</Box>
				<Box>
					<FormControl>
						<FormLabel fontSize={"12px"} ml={"10px"}>
							Filter by branch
						</FormLabel>
						<Select
							w={["150px", "115px"]}
							mr={["0px", "10px"]}
							border="1px solid #373433"
							borderRadius={"20px"}
							focusBorderColor="#373433"
							placeholder="Branch"
							value={branchId}
							onChange={(e) => setBranchId(e.target.value)}
						>
							<option value="">All</option>
							{branch?.map((item) => {
								return (
									<option key={item?.id} value={item?.id}>
										{item?.name}
									</option>
								);
							})}
						</Select>
					</FormControl>
				</Box>
				<Box>
					<FormControl>
						<FormLabel fontSize={"12px"} mt={["8px", "0px"]} ml={["10px"]}>
							Select by status
						</FormLabel>
						<Select
							textAlign={"start"}
							w={["150px", "120px"]}
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
					</FormControl>
				</Box>
				<Box>
					<FormControl>
						<FormLabel fontSize={"12px"} mt={["8px", "0px"]} ml={"20px"}>
							Sort by
						</FormLabel>
						<Select
							w={["150px", "105px"]}
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
						<FormLabel fontSize={"12px"} mt={["8px", "0px"]} ml={"12px"}>
							Start Date
						</FormLabel>
						<Input
							borderRadius={"20px"}
							border="1px solid #373433"
							focusBorderColor="#373433"
							ml={["0px", "10px"]}
							w={["150px", "150px"]}
							placeholder="Date"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</FormControl>
				</Box>
				<Box>
					<FormControl>
						<FormLabel fontSize={"12px"} mt={["8px", "0px"]} ml={"20px"}>
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
			{list && list.length > 0 ? (
				list?.map((item, index) => {
					return (
						<Box
							key={index}
							pl={"20px"}
							w={"full"}
							pb={"10px"}
							bg={"white"}
							mt={"20px"}
							borderRadius={"8px"}
							boxShadow="0px 0px 3px gray"
						>
							<Flex display={["block", "flex"]} pt={"5px"}>
								<Flex>
									<Text fontSize={["12px", "15px"]} fontWeight={"bold"}>
										Shop
									</Text>
									<Text mt={"2px"} ml={"10px"} fontSize={["10px", "13px"]}>
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
								</Flex>
								<Flex>
									<Text mt={"2px"} ml={["0px", "10px"]} fontFamily={"monospace"} fontSize={["11px", "13px"]}>
										{item.invoice}
									</Text>
								</Flex>
							</Flex>
							{item?.Cart?.BranchId === 1 ? (
								<Flex mt={"3px"}>
									<AiOutlineShopping color="#E25668" size={25} />
									<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={["11px", "13px"]}>
										Alphamart {item?.Cart?.Branch?.name}
									</Text>
								</Flex>
							) : item?.Cart?.BranchId === 2 ? (
								<Flex mt={"3px"}>
									<AiOutlineShopping color="#E28956" size={25} />
									<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
										Alphamart {item?.Cart?.Branch?.name}
									</Text>
								</Flex>
							) : item?.Cart?.BranchId === 3 ? (
								<Flex mt={"3px"}>
									<AiOutlineShopping color="#68E256" size={25} />
									<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
										Alphamart {item?.Cart?.Branch?.name}
									</Text>
								</Flex>
							) : item?.Cart?.BranchId === 4 ? (
								<Flex mt={"3px"}>
									<AiOutlineShopping color="#56E2CF" size={25} />
									<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
										Alphamart {item?.Cart?.Branch?.name}
									</Text>
								</Flex>
							) : (
								<Flex mt={"3px"}>
									<AiOutlineShopping color="#5668E2" size={25} />
									<Text ml={"5px"} mt={"4px"} fontWeight={"bold"} fontSize={"13px"}>
										Alphamart {item?.Cart?.Branch?.name}
									</Text>
								</Flex>
							)}
							<Flex display={["block", "flex"]} justifyContent={"space-between"}>
								<Box>
									{item.Order_details.map((i) => (
										<Flex mt={"10px"}>
											<Flex w={"120px"} h={"110px"} bg={"black"}>
												<Image
													onClick={() => navigate(`/product/${i.Product.id}`)}
													objectFit={"cover"}
													src={`${process.env.REACT_APP_BASE_URL}/products/${i?.Product.imgURL}`}
												/>
											</Flex>
											<Flex justifyContent={"center"} direction={"column"}>
												<Text textAlign={"start"} ml={"15px"} fontWeight={"bold"}>
													{i.Product.productName}
												</Text>
												<Text textAlign={"start"} mr={"4px"} ml={"15px"} color={"balck"} fontSize={"11px"}>
													{i.Product.description}
												</Text>
												<Text textAlign={"start"} ml={"15px"} color={"gray.500"} fontSize={"11px"}>
													{i.quantity} Items X {formatRupiah(i.Product.price)}
												</Text>
												{item.status === "Received" ? (
													<ReviewModal id={i.Product.id} quantity={i.quantity} invoice={item.invoice} />
												) : null}
											</Flex>
										</Flex>
									))}
								</Box>
								<Flex>
									{item.status !== "Cancelled" ? (
										<Flex direction={"column"} justifyContent={"end"} mt={"10px"} mr={"20px"}>
											<Flex justifyContent={["start", "end"]}>
												<HiOutlineTruck size={21} />
												<Text textAlign={"end"} ml={"5px"} color={"gray.500"} fontSize={"14px"}>
													{item.shipment} - {item.shipmentMethod}
												</Text>
											</Flex>
											{item.status !== "Cancelled" ? (
												<Text textAlign={["start", "end"]} color={"gray.500"} fontSize={"14px"}>
													ETA day(s): {item.etd}
												</Text>
											) : null}
											<Text textAlign={["start", "end"]} color={"gray.500"} fontSize={"15px"}>
												Total amount
											</Text>
											<Text textAlign={["start", "end"]} color={"gray.500"} fontWeight={"bold"} fontSize={"11px"}>
												{formatRupiah(item.subtotal)}
												{item.discount === 0 || item.discount === null ? null : (
													<>
														{" "}
														{" - "}
														{formatRupiah(item.discount)}
													</>
												)}
											</Text>
											<Text textAlign={["start", "end"]} color={"black"} fontWeight={"bold"} fontSize={"18px"}>
												{formatRupiah(item.total)}
											</Text>
										</Flex>
									) : null}
								</Flex>
							</Flex>
							<Flex mt={["20px", "10px"]} mr={"10px"} justifyContent={["space-between", "end"]} alignItems={"center"}>
								<Flex>
									{item.status === "Received" ? (
										<Button
											size={["sm", "md"]}
											as={Link}
											to={"/search"}
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
											<Flex mr={"5px"}>
												<AiOutlineShopping />
											</Flex>
											Shop Again
										</Button>
									) : null}
									{item.status === "Waiting payment" ? (
										<UploadProofButton
											date={item?.createdAt}
											branch={item?.Cart?.Branch?.name}
											amount={item?.total}
											reload={reload}
											setReload={setReload}
											orderId={item?.id}
										/>
									) : null}
									{item.status === "Sent" ? (
										<ConfirmButtonOrder2 reload={reload} setReload={setReload} orderId={item?.id} />
									) : null}
									<Flex>
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
								</Flex>
								<Flex>
									{item.status !== "Cancelled" || item.status !== "Sent" || item.status !== "Received" ? (
										<MenuOrder
											orderId={item?.id}
											imgURL={item?.paymentProof}
											date={item?.createdAt}
											branch={item?.Cart?.Branch?.name}
											amount={item?.total}
											status={item?.status}
											invoice={item?.invoice}
											reload={reload}
											setReload={setReload}
										/>
									) : null}
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
		</Box>
	);
};
