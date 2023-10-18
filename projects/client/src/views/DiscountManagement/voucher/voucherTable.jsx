import axios from "axios";
import {
	Stack,
	Table,
	Thead,
	Tr,
	Th,
	Td,
	Flex,
	Image,
	Text,
	Tbody,
	Input,
	Select,
	InputGroup,
	InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/navigation/pagination";
import { ButtonTemp } from "../../../components/button";
import { VoucherManagementDetails } from "./voucherDetails";
import { BiSort, BiSortDown, BiSortUp } from "react-icons/bi";
import { useSelector } from "react-redux";

export const VoucherTable = () => {
	const [vouchers, setVouchers] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
    // eslint-disable-next-line
	const [total, setTotal] = useState(1);
	const [branches, setBranches] = useState([]);
	const [sortBy, setSortBy] = useState("id");
	const [order, setOrder] = useState("ASC");
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const searchRef = useRef();
	const typeRef = useRef();
	const startAvailableFromRef = useRef();
	const endAvailableFromRef = useRef();
	const startValidUntilRef = useRef();
	const endValidUntilRef = useRef();
	const branchIdRef = useRef();

	const RoleId = useSelector((state) => state.user.value.RoleId);

	const nextPage = () => {
		if (page < totalPages) {
			setPage((prevPage) => +prevPage + 1);
		}
	};

	const prevPage = () => {
		if (page > 1) {
			setPage((prevPage) => +prevPage - 1);
		}
	};

	const goToPage = (page) => {
		setPage(page);
	};

	const fetchBranches = async () => {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/branch`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			setBranches(data.result);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchData = async () => {
		try {
			let branchId
			const search = searchRef.current.value;
			const type = typeRef.current.value;
			const startAvailableFrom = startAvailableFromRef.current.value;
			const endAvailableFrom = endAvailableFromRef.current.value;
			const startValidUntil = startValidUntilRef.current.value;
			const endValidUntil = endValidUntilRef.current.value;
			if (RoleId === 3) branchId = branchIdRef.current.value;
			const { data } = await axios.get(
				`${
					process.env.REACT_APP_API_BASE_URL
				}/voucher?page=${page}&limit=8&BranchId=${branchId}&search=${search}&type=${type}&startAvailableFrom=${startAvailableFrom}&endAvailableFrom=${endAvailableFrom}&startValidUntil=${startValidUntil}&endValidUntil=${endValidUntil}&sortBy=${sortBy}&order=${
					order ? "ASC" : "DESC"
				}`,
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			setVouchers(data.result);
			setTotal(data.total);
			setTotalPages(data.totalPages);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchBranches();
        // eslint-disable-next-line
	}, []);

	useEffect(() => {
		fetchData();
        // eslint-disable-next-line
	}, [page, sortBy, order]);

	return (
		<Stack gap={10} w={"100%"}>
			<Stack gap={7} w={"100%"}>
				<Flex alignItems={"center"} gap={8}>
					<Stack>
						<Text fontWeight={"semibold"} color={"gray"}>
							Available From
						</Text>
						<Flex alignItems={"center"} gap={3}>
							<Input
								onChange={fetchData}
								ref={startAvailableFromRef}
								type="datetime-local"
								focusBorderColor="gray.500"
							/>
							<Text fontWeight={"semibold"} color={"gray"}>
								to
							</Text>
							<Input onChange={fetchData} ref={endAvailableFromRef} type="datetime-local" focusBorderColor="gray.500" />
						</Flex>
					</Stack>
					<Stack>
						<Text fontWeight={"semibold"} color={"gray"}>
							Valid Until
						</Text>
						<Flex alignItems={"center"} gap={3}>
							<Input onChange={fetchData} ref={startValidUntilRef} type="datetime-local" focusBorderColor="gray.500" />
							<Text fontWeight={"semibold"} color={"gray"}>
								to
							</Text>
							<Input onChange={fetchData} ref={endValidUntilRef} type="datetime-local" focusBorderColor="gray.500" />
						</Flex>
					</Stack>
				</Flex>
				<Flex alignItems={"center"} gap={3}>
					<InputGroup w={"300px"}>
						<Input
							type="search"
							placeholder={"Search by voucher name"}
							focusBorderColor="gray.500"
							borderColor={"gray.300"}
							ref={searchRef}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									fetchData();
								}
							}}
						/>
						<InputRightElement w={20} p={1}>
							<ButtonTemp onClick={fetchData} size={"sm"} content={"Search"} />
						</InputRightElement>
					</InputGroup>
					<Select
						w={"150px"}
						borderColor={"gray.300"}
						focusBorderColor="gray.500"
						defaultValue={""}
						ref={typeRef}
						onClick={fetchData}
					>
						<option value={""}>All Types</option>
						<option value={"Single item"}>Single Item</option>
						<option value={"Total purchase"}>Total Purchase</option>
						<option value={"Shipment"}>Shipment</option>
					</Select>
					{RoleId === 3 && (
						<Select
							w={"150px"}
							borderColor={"gray.300"}
							focusBorderColor="gray.500"
							defaultValue={""}
							ref={branchIdRef}
							onChange={fetchData}
						>
							<option value={""}>All Branches</option>
							{branches.map(({ name, id }) => {
								return <option value={id}>{name}</option>;
							})}
						</Select>
					)}
				</Flex>
			</Stack>
			<Table size="sm" variant={"striped"}>
				<Thead
					style={{
						position: "sticky",
						top: 0,
						zIndex: 1,
						backgroundColor: "#FFFFFF",
					}}
				>
					<Tr>
						<Th
							cursor={"pointer"}
							onClick={() => {
								setSortBy("id");
								setOrder(!order);
							}}
						>
							<Flex gap={2} alignItems={"center"} justifyContent={"center"}>
								<Text>ID</Text>
								{sortBy === "id" && order ? (
									<BiSortDown size={15} />
								) : sortBy === "id" && !order ? (
									<BiSortUp size={15} />
								) : (
									<BiSort size={15} color="#3E3D40" />
								)}
							</Flex>
						</Th>
						<Th
							cursor={"pointer"}
							onClick={() => {
								setSortBy("name");
								setOrder(!order);
							}}
						>
							<Flex gap={2} alignItems={"center"} justifyContent={"center"}>
								<Text>Name</Text>
								{sortBy === "name" && order ? (
									<BiSortDown size={15} />
								) : sortBy === "name" && !order ? (
									<BiSortUp size={15} />
								) : (
									<BiSort size={15} color="#3E3D40" />
								)}
							</Flex>
						</Th>
						<Th textAlign={"center"}>Discount Code</Th>
						<Th textAlign={"center"}>Type</Th>
						<Th textAlign={"center"}>Nominal</Th>
						<Th textAlign={"center"}>Product</Th>
						{RoleId === 3 && <Th textAlign={"center"}>Branch</Th>}
						<Th
							cursor={"pointer"}
							onClick={() => {
								setSortBy("availableFrom");
								setOrder(!order);
							}}
						>
							<Flex gap={2} alignItems={"center"} justifyContent={"center"}>
								<Text>Available From</Text>
								{sortBy === "availableFrom" && order ? (
									<BiSortDown size={15} />
								) : sortBy === "availableFrom" && !order ? (
									<BiSortUp size={15} />
								) : (
									<BiSort size={15} color="#3E3D40" />
								)}
							</Flex>
						</Th>
						<Th
							cursor={"pointer"}
							onClick={() => {
								setSortBy("validUntil");
								setOrder(!order);
							}}
						>
							<Flex gap={2} alignItems={"center"} justifyContent={"center"}>
								<Text>Expiry Date</Text>
								{sortBy === "validUntil" && order ? (
									<BiSortDown size={15} />
								) : sortBy === "validUntil" && !order ? (
									<BiSortUp size={15} />
								) : (
									<BiSort size={15} color="#3E3D40" />
								)}
							</Flex>
						</Th>
						<Th textAlign={"center"}>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{vouchers.map(
						(
							{
								id,
								Product,
								type,
								nominal,
								availableFrom,
								validUntil,
								name,
								code,
								isPercentage,
								minimumPayment,
								maximumDiscount,
								BranchId,
								Branch,
								amountPerRedeem,
							},
							idx
						) => {
							return (
								<Tr key={idx}>
									<Td py={8}>{id}.</Td>
									<Td>
										<Text>{name}</Text>
									</Td>
									<Td>
										<Text textAlign={!code && "center"} fontWeight={!code && "bold"}>
											{code ? code : "---"}
										</Text>
									</Td>
									<Td>
										<Text>{type}</Text>
									</Td>
									<Td>
										<Text>
											{isPercentage
												? `${nominal}% up to Rp. ${maximumDiscount.toLocaleString("id-ID")}`
												: `Rp. ${nominal.toLocaleString("id-ID")}`}
										</Text>
									</Td>
									<Td>
										{Product ? (
											<Flex gap={2} alignItems={"center"}>
												<Image
													src={`${process.env.REACT_APP_BASE_URL}/products/${Product?.imgURL}`}
													alt={Product?.productName}
													cursor={"pointer"}
													onClick={() => navigate(`/product/${Product?.id}`)}
													boxSize="75px"
													objectFit="cover"
													borderRadius={"5px"}
												/>
												<Text>{Product?.productName}</Text>
											</Flex>
										) : (
											<Text fontWeight={"bold"} textAlign={"center"}>
												---
											</Text>
										)}
									</Td>
									{RoleId === 3 && (
										<Td>
											<Text>{BranchId ? Branch?.name : "All"}</Text>
										</Td>
									)}
									<Td>
										<Text>
											{new Date(availableFrom)?.toLocaleString("en-EN", {
												timeStyle: "medium",
												dateStyle: "long",
											})}
										</Text>
									</Td>
									<Td>
										<Text>
											{new Date(validUntil)?.toLocaleString("en-EN", {
												timeStyle: "medium",
												dateStyle: "long",
											})}
										</Text>
									</Td>
									<Td justifyContent={"center"}>
										<VoucherManagementDetails
											name={name}
											code={code}
											minimumPayment={minimumPayment}
											maximumDiscount={maximumDiscount}
											type={type}
											nominal={nominal}
											amountPerRedeem={amountPerRedeem}
											BranchId={BranchId}
											isPercentage={isPercentage}
											validUntil={validUntil}
											availableFrom={availableFrom}
										/>
									</Td>
								</Tr>
							);
						}
					)}
				</Tbody>
			</Table>
			<Pagination
				page={page}
				totalPages={totalPages}
				prevPage={prevPage}
				nextPage={nextPage}
				goToPage={goToPage}
				lastPage={totalPages}
			/>
		</Stack>
	);
};
