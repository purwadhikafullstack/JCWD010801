import { useEffect, useState } from "react";
import { Box, Grid, Text, Badge, Input, Button, Flex, Stack, Heading } from "@chakra-ui/react";
import Axios from "axios";
import AddAddress from "./address/addAddress";
import DeleteAddressButton from "./address/deleteAddress";
import UpdateAddress from "./address/updateAddress";
import MainAddressButton from "./address/setMainAddress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const AddressesTab = () => {
	const [data, setData] = useState([]);
	const token = localStorage.getItem("token");
	const [totalPage, setTotalPage] = useState(1);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [reload, setReload] = useState(0);
	const [province, setProvince] = useState([]);
	const [city, setCity] = useState([]);
	const [branches, setBranches] = useState([]);
	const dataMainAddress = useSelector((state) => state.address.value);

	const fetchBranchData = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(response.data);
		} catch (error) {}
	};

	const getAddress = async () => {
		try {
			const response = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/address?page=${page}&search=${search}&sort=asc`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setData(response.data.result);
			setTotalPage(response.data.totalPage);
		} catch (error) {}
	};

	const getProvince = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/province`);
			setProvince(response.data.data.rajaongkir.results);
		} catch (error) {
			toast.error("Key Raja Ongkir is expired", {
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
	const getCity = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/city`);
			setCity(response.data.data.rajaongkir.results);
		} catch (error) {
			toast.error("Key Raja Ongkir is expired", {
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
		getProvince();
		getCity();
		fetchBranchData();
	}, []);
	useEffect(() => {
		getAddress();
		if (page > totalPage && totalPage !== 0) {
			setPage(totalPage);
		}
		// eslint-disable-next-line
	}, [reload, search, page, totalPage]);
	useEffect(() => {
		if (dataMainAddress !== undefined && Object.keys(dataMainAddress).length > 0 && branches.length !== 0) {
			const filteredBranch = branches.filter(
				(item) =>
					dataMainAddress.lat <= item.northeast_lat &&
					dataMainAddress.lat >= item.southwest_lat &&
					dataMainAddress.lng <= item.northeast_lng &&
					dataMainAddress.lng >= item.southwest_lng
			);

			if (filteredBranch.length > 0) {
				localStorage.setItem("BranchId", parseInt(filteredBranch[0].id));
			}
		}
		// eslint-disable-next-line
	}, [data]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		setPage(1);
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
	};
	return (
		<Box maxW="600px" mx="auto" p={4} w={{ md: "80%", base: "100%" }}>
			<Flex>
				<AddAddress reload={reload} setReload={setReload} province={province} city={city} />

				<Input
					placeholder="Search"
					value={search}
					onChange={handleSearchChange}
					size="md"
					ml={"4"}
					border={"1px"}
					focusBorderColor="#373433"
				/>
			</Flex>
			{data?.map((value, index) => (
				<Box key={index} borderWidth="1px" borderRadius="md" p={4} boxShadow="md" mb={4}>
					<Flex justify={"space-between"} align={"center"}>
						<Flex align={"center"}>
							<Text fontWeight="bold" fontSize="xl" mb={2}>
								{value?.label}
							</Text>
							<UpdateAddress
								id={value?.id}
								reload={reload}
								setReload={setReload}
								label={value?.label}
								address={value?.address}
								city_id={value?.city_id}
								city_name={value?.city}
								province_name={value?.province}
								province_id={value?.province_id}
								subdistrict={value?.subdistrict}
								postal_code={value?.postal_code}
								province={province}
								city={city}
							/>
						</Flex>
						{value?.isMain ? (
							<Badge colorScheme="green" h="max-content" size={"sm"}>
								Main
							</Badge>
						) : (
							<MainAddressButton id={value?.id} reload={reload} setReload={setReload} data={data} />
						)}
					</Flex>
					<Grid templateColumns="max-content 1fr" gap={2}>
						<Text fontWeight="bold">Address</Text>
						<Text>{value?.address}</Text>
						<Text fontWeight="bold">Subdistrict</Text>
						<Text>{value?.subdistrict}</Text>
						<Text fontWeight="bold">City</Text>
						<Text>{value?.city}</Text>
						<Text fontWeight="bold">Province</Text>
						<Text>{value?.province}</Text>
						<Text fontWeight="bold">Postal Code</Text>
						<Flex justify={"space-between"}>
							<Text>{value?.postal_code}</Text>
							{!value?.isMain && <DeleteAddressButton id={value?.id} reload={reload} setReload={setReload} />}
						</Flex>
					</Grid>
					<Flex mt={"1"}></Flex>
				</Box>
			))}
			{data?.length === 0 && (
				<Stack w={"100%"} my={5} justifyContent={"center"} alignItems={"center"}>
					<Heading fontSize={"70px"}>{":("}</Heading>
					<Text mt={6} fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
						No address found
					</Text>
				</Stack>
			)}

			<Box mt={4} display="flex" justifyContent="center" alignItems={"center"}>
				<Button
					backgroundColor="#000000"
					color="white"
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
					onClick={() => handlePageChange(page - 1)}
					isDisabled={page === 1}
					mr={2}
				>
					Prev.
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
				>
					{page}
				</Button>
				<Button
					backgroundColor="#000000"
					color="white"
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
					onClick={() => handlePageChange(page + 1)}
					isDisabled={page === totalPage || totalPage === 0}
					ml={2}
				>
					Next
				</Button>
			</Box>
		</Box>
	);
};

export default AddressesTab;
