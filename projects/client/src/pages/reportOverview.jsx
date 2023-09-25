import LayoutSidebar from "../pages/layoutSidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { VscGraph } from "react-icons/vsc";
import { BsBoxes } from "react-icons/bs";
import { Error404page } from "./error404";

const ReportOverview = () => {
	const user = useSelector((state) => state?.user?.value);
	const avatar = user?.avatar || null;
	const RoleId = user?.RoleId;

	return RoleId > 1 ? (
		<Flex>
			<LayoutSidebar />
			<Box pt={"30px"} direction={"column"} w={"full"}>
				<Flex ml={"95px"} mb={"80px"} justifyContent={"space-between"}>
					<Box>
						<Text fontSize={"30px"} fontWeight={"bold"}>
							Report Overview
						</Text>
						<Text fontWeight={"light"}>Choose A Report Type </Text>
					</Box>
					<Flex mt={"10px"} as={Link} to={"/profile"} mr={"85px"}>
						<Box mr={"7px"} mt={"5px"}>
							<Text textAlign={"end"} fontWeight={"bold"} fontSize={"15px"}>
								{user?.firstName} {user?.lastName}
							</Text>
							<Text textAlign={"end"} fontSize={"10px"}>
								{user?.username}
							</Text>
						</Box>
						<Avatar
							size={"md"}
							src={`${process.env.REACT_APP_BASE_URL}/avatars/${avatar ? avatar : "default_not_set.png"}`}
						/>
					</Flex>
				</Flex>

				<Stack justifyContent={"center"} alignContent={"center"} justifyItems={"center"} alignItems={"center"}>
					<Flex
						as={Link}
						to={"/dashboard/report/stocks/charts"}
						w={"400px"}
						h={"200px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex direction={"column"} w={"200px"} align={"center"} justify={"center"}>
							<Text fontWeight={"semibold"} fontSize={"45px"}>
								STOCKS
							</Text>
							<Text fontSize={"20px"}>Stocks Report</Text>
						</Flex>
						<Flex w={"200px"} align={"center"} justify={"center"}>
							<BsBoxes size={120} />
						</Flex>
					</Flex>
					<Flex
						mt={"10px"}
						as={Link}
						to={"/dashboard"}
						w={"400px"}
						h={"200px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex w={"200px"} align={"center"} justify={"center"}>
							<VscGraph size={120} />
						</Flex>
						<Flex direction={"column"} w={"200px"} align={"center"} justify={"center"}>
							<Text fontWeight={"semibold"} fontSize={"45px"}>
								SALES
							</Text>
							<Text fontSize={"20px"}>Sales Report</Text>
						</Flex>
					</Flex>
				</Stack>
			</Box>
		</Flex>
	) : (
		<Error404page />
	);
};

export default ReportOverview;
