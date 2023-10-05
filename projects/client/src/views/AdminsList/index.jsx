import Axios from "axios";
import AddAdmin from "./components/addAdmin";
import LayoutSidebar from "../../pages/layoutSidebar";
import { Avatar, Box, Button, Flex, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { EmptyList } from "../OrdersList/components/emptyList";

export const AdminListPage = () => {
	const navigate = useNavigate();
	const [branch, setBranch] = useState();
	const [data, setData] = useState();
	const [countAdmins, setCountAdmins] = useState();
	const [search, setSearch] = useState("");
	const [branchId, setBranchId] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [reload, setReload] = useState(false);
	const token = localStorage.getItem("token");
	const [sort, setSort] = useState(["firstName", "ASC"]);
	const user = useSelector((state) => state?.user?.value);

	const getEmployee = async (pageNum) => {
		try {
			const response = await Axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/admin/all?search=${search}&page=${pageNum}&limit=8&branchId=${branchId}&sortField=${sort[0]}&sortOrder=${sort[1]}`
			);
			setCountAdmins(response.data.countAdmins);
			setData(response.data.result);
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
		if (page > 1) getEmployee(page - 1);
	};

	const nextPage = () => {
		if (page < totalPage) {
			getEmployee(page + 1);
		}
	};

	useEffect(() => {
		if (user.RoleId === 1 || user.RoleId === 2) navigate("/");
		if (!token) navigate("/");
		getEmployee(page);
		getBranches();
		// eslint-disable-next-line
	}, [search, branchId, sort, reload]);

	return (
		<Flex>
			<LayoutSidebar />
			<Flex w={"full"} pt={"10px"}>
				<Box w={"full"} margin={"auto"}>
					<Flex mx={"80px"} justifyContent={"space-between"}>
						<Box>
							<Text fontSize={"30px"} fontWeight={"bold"}>
								Admins ({countAdmins})
							</Text>
							<Text fontWeight={"light"}>Currently there are {countAdmins} admins from all branches</Text>
						</Box>
						<AddAdmin reload={reload} setReload={setReload} />
					</Flex>
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
							w={"165px"}
							ml={"10px"}
							border="1px solid #373433"
							borderRadius={"20px"}
							focusBorderColor="#373433"
							placeholder="Filter by branch"
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
						<Select
							w={"90px"}
							ml={"10px"}
							border="1px solid #373433"
							borderRadius={"20px"}
							focusBorderColor="#373433"
							value={sort}
							onChange={(e) => setSort(e.target.value.split(","))}
						>
							<option value="firstName,ASC">A-Z</option>
							<option value="firstName,DESC">Z-A</option>
						</Select>
					</Flex>
					<Flex my={"20px"} mx={"10px"} maxW={"1400px"} flexWrap={"wrap"} justifyContent={"center"}>
						{data && data.length > 0 ? (
							data?.map((item) => {
								return (
									<>
										<Box w={"240px"} ml={"25px"} my={"10px"} bg={"#f7f7f9"} borderRadius={"8px"}>
											<Flex pt={"10px"} pl={"20px"}>
												<Avatar  src={`${process.env.REACT_APP_BASE_URL}/avatars/${item?.avatar ? item?.avatar : "default_not_set.png"}`} />
												<Box mt={"5px"}>
													<Text ml={"10px"} fontWeight={"bold"}>
														{item.firstName} {item?.lastName}
													</Text>
													<Text ml={"10px"} fontWeight={"light"} fontSize={"12px"}>
														{item?.username}
													</Text>
												</Box>
											</Flex>
											<Flex mt={"15px"} justifyContent={"center"}>
												<Text
													w={"80px"}
													h={"25px"}
													bg={"green.100"}
													color={"green"}
													borderRadius={"5px"}
													lineHeight={"25px"}
													textAlign={"center"}
												>
													Admin
												</Text>
												<Text
													ml={"10px"}
													w={"90px"}
													h={"25px"}
													bg={"green.100"}
													color={"green"}
													borderRadius={"5px"}
													lineHeight={"25px"}
													textAlign={"center"}
												>
													{item?.Branch?.name}
												</Text>
											</Flex>
											<Flex mt={"15px"} ml={"8px"}>
												<Text ml={"10px"} fontSize={"12px"} fontWeight={"bold"}>
													Email:
												</Text>
												<Text fontWeight={"light"} fontSize={"12px"}>
													‎ {item?.email}
												</Text>
											</Flex>
											<Flex mb={"5px"} ml={"8px"}>
												<Text ml={"10px"} fontSize={"12px"} fontWeight={"bold"}>
													Phone:
												</Text>
												<Text fontWeight={"light"} fontSize={"12px"}>
													‎ {item?.phone}
												</Text>
											</Flex>
										</Box>
									</>
								);
							})
						) : (
							<Flex justifyContent={"center"}>
								<EmptyList />
							</Flex>
						)}
					</Flex>
					<Flex justifyContent={"center"}>
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
			</Flex>
		</Flex>
	);
};
