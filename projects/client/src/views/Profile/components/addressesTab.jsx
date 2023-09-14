import { useEffect, useState } from "react";
import { Box, Grid, Text, Badge, Input, Button, Flex } from "@chakra-ui/react";
import Axios from "axios";
import AddAddress from "./address/addAddress";
import DeleteAddressButton from "./address/deleteAddress";
import UpdateAddress from "./address/updateAddress";
import MainAddressButton from "./address/setMainAddress";

const AddressesTab = () => {
	const [data, setData] = useState([]);
	const token = localStorage.getItem("token");
	const [totalPage, setTotalPage] = useState(1);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [reload, setReload] = useState(0);
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
			setData(response.data.result);
			setTotalPage(response.data.totalPage);
		} catch (error) {}
	};
	useEffect(() => {
		getAddress();
	}, [reload, search, page]);

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
				<AddAddress reload={reload} setReload={setReload} />
				<Input placeholder="Search" value={search} onChange={handleSearchChange} size="md" ml={"4"} border={"1px"} />
			</Flex>
			{data?.map((value, index) => (
				<Box key={index} borderWidth="1px" borderRadius="md" p={4} boxShadow="md" mb={4}>
					{value?.isMain && (
						<Badge colorScheme="green" h="max-content" size={"sm"}>
							Main
						</Badge>
					)}
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
							/>
							{!value?.isMain && <DeleteAddressButton id={value?.id} reload={reload} setReload={setReload} />}
						</Flex>
						{!value?.isMain && <MainAddressButton id={value?.id} reload={reload} setReload={setReload} />}
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
						<Text>{value?.postal_code}</Text>
					</Grid>
					<Flex mt={"1"}></Flex>
				</Box>
			))}
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
				<Text>{`${page} / ${totalPage}`}</Text>
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
					isDisabled={page === totalPage}
					ml={2}
				>
					Next
				</Button>
			</Box>
		</Box>
	);
};

export default AddressesTab;
