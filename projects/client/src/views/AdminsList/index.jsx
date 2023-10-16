import Axios from "axios";
import AddAdmin from "./components/addAdmin";
import LayoutSidebar from "../../pages/layoutSidebar";
import { Avatar, Badge, Box, Button, Flex, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { EmptyList } from "../OrdersList/components/emptyList";
import DetailAdmin from "./components/detailAdminModal";

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
		if (user.RoleId === 1 || user.RoleId === 2) navigate("/dashboard");
		if (!token) navigate("/");
		getEmployee(page);
		getBranches();
		// eslint-disable-next-line
	}, [search, branchId, sort, reload]);

	return (
		<Flex display={["block", "block", "flex", "flex"]}>
			<Flex mt={["10px", "10px", "0px", "0px"]}>
				<LayoutSidebar />
			</Flex>
			<Flex justifyContent={"center"} w={"full"} pt={"10px"}>
				<Box w={"f	ull"} margin={"auto"}>
					<Flex mx={"5%"} justifyContent={"space-between"}>
						<Box mr={"15px"}>
							<Text fontSize={"30px"} fontWeight={"bold"}>
								Admins ({countAdmins})
							</Text>
							<Text fontWeight={"light"}>Currently there are {countAdmins} admins from all branches</Text>
						</Box>
						<AddAdmin reload={reload} setReload={setReload} />
					</Flex>
					<Flex flexWrap={"wrap"} mt={"20px"} justifyContent={"center"}>
						<Input
							borderRadius={"20px"}
							border="1px solid #373433"
							focusBorderColor="#373433"
							w={"280px"}
							placeholder="Search"
							type="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Select
							w={"165px"}
							ml={["0px", "10px"]}
							mt={["10px", "0px"]}
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
							w={"110px"}
							ml={"10px"}
							mt={["10px", "0px"]}
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
					<Flex mb={"10px"} mt={"10px"} maxW={"1400px"} flexWrap={"wrap"} justifyContent={"center"}>
						{data && data.length > 0 ? (
							data?.map((item, index) => {
								return (
									<>
										<Box
											key={index}
											w={["170px", "200px", "240px"]}
											m={"10px"}
											bg={"#f7f7f9"}
											boxShadow="0px 0px 2px gray"
											borderRadius={"8px"}
										>
											<Flex pt={"8px"} pl={"20px"}>
												<Avatar
													mt={["7px", "7px", "4px"]}
													src={`${process.env.REACT_APP_BASE_URL}/avatars/${
														item?.avatar ? item?.avatar : "default_not_set.png"
													}`}
												/>
												<Box mt={"5px"}>
													<Text mr={"4px"} ml={"7px"} fontSize={["14px", "16px"]} fontWeight={"bold"}>
														{item.firstName} {item?.lastName}
													</Text>
													<Text ml={"10px"} fontWeight={"light"} fontSize={"12px"}>
														{item?.username}
													</Text>
												</Box>
											</Flex>
											<Flex mt={"15px"} justifyContent={"center"}>
												<Badge colorScheme="green">Admin</Badge>
												<Badge ml={"10px"} colorScheme="yellow">
													{item?.Branch?.name}
												</Badge>
											</Flex>

											<Box mt={"15px"} ml={["0px", "8px"]}>
												<Text ml={"10px"} fontSize={"10px"} fontWeight={"bold"}>
													E-mail:
												</Text>
												<Text ml={"7px"} fontWeight={"light"} fontSize={"12px"}>
													‎ {item?.email}
												</Text>
											</Box>
											<Flex justifyContent={"space-between"}>
												<Box mb={"5px"} ml={["0px", "8px"]}>
													<Text ml={"10px"} fontSize={"10px"} fontWeight={"bold"}>
														Phone:
													</Text>
													<Text ml={"7px"} fontWeight={"light"} fontSize={"12px"}>
														‎ {item?.phone}
													</Text>
												</Box>
												<DetailAdmin
													avatar={item.avatar}
													firstName={item.firstName}
													lastName={item.lastName}
													username={item.username}
													email={item.email}
													phone={item.phone}
													gender={item.gender}
													joinDate={item.createdAt}
													birthDate={item.birthDate}
													branch={item?.Branch?.name}
												/>
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
