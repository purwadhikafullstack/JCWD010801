import LayoutSidebar from "../../../pages/layoutSidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { FaShop } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa";
import { VscGraphLine } from "react-icons/vsc";
import { RiFileList3Fill } from "react-icons/ri";
import { BsFillPersonFill } from "react-icons/bs";

export const BranchAdminDashboardButton = () => {
	const user = useSelector((state) => state?.user?.value);
	
	return (
		<Flex>
			<LayoutSidebar />
			<Box pt={"30px"} direction={"column"} w={"full"}>
				<Flex ml={"80px"} justifyContent={"space-between"}>
					<Box>
						<Text fontSize={"30px"} fontWeight={"bold"}>
							Dashboard Overview
						</Text>
						<Text fontWeight={"light"}>Branch Admin </Text>
					</Box>
					<Flex mt={"10px"} as={Link} to={"/profile"} mr={"85px"}>
						<Box mr={"7px"} mt={"5px"}>
							<Text textAlign={"end"} fontWeight={"bold"} fontSize={"15px"}>
								{user.firstName} {user.lastName}
							</Text>
							<Text textAlign={"end"} fontSize={"10px"}>
								{user.username}
							</Text>
						</Box>
						<Avatar size={"md"} src={`${process.env.REACT_APP_BASE_URL}/avatars/${user?.avatar}`} />
					</Flex>
				</Flex>
				<Flex mt={"30px"} justifyContent={"center"}>
					<Box
						as={Link}
						to={"/profile"}
						w={"28%"}
						h={"200px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 4px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={"15px"} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={"30px"}>
								Profile
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={"12px"}>
								Your Profile
							</Text>
						</Flex>
						<Flex mr={"10px"} mt={"45px"} justifyContent={"end"}>
							<BsFillPersonFill size={90} />
						</Flex>
					</Box>
					<Box
						as={Link}
						to={"/dashboard/product-management"}
						ml={"15px"}
						w={"28%"}
						h={"200px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 4px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={"15px"} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={"30px"}>
								Product
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={"12px"}>
								AlphaMart Product Management
							</Text>
						</Flex>
						<Flex mr={"10px"} mt={"45px"} justifyContent={"end"}>
							<FaBoxOpen size={90} />
						</Flex>
					</Box>
					<Box
						as={Link}
						to={"/dashboard"}
						ml={"15px"}
						w={"28%"}
						h={"200px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 4px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={"15px"} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={"30px"}>
								Branch Info
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={"12px"}>
								AlphaMart Branch Information
							</Text>
						</Flex>
						<Flex mr={"10px"} mt={"50px"} justifyContent={"end"}>
							<FaShop size={80} />
						</Flex>
					</Box>
				</Flex>
				<Flex mt={"15px"} justifyContent={"center"}>
					<Box
						as={Link}
						to={"/dashboard/orders-list"}
						w={"43%"}
						h={"250px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"9px"} ml={"15px"} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={"35px"}>
								Order List
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={"12px"}>
								Hoamz
							</Text>
						</Flex>
						<Flex mt={"60px"} mr={"15px"} justifyContent={"end"}>
							<RiFileList3Fill size={100} />
						</Flex>
					</Box>
					<Box
						as={Link}
						to={"/dashboard/welcome"}
						ml={"15px"}
						w={"42%"}
						h={"250px"}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={"15px"} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={"40px"}>
								Report
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={"12px"}>
								Report
							</Text>
						</Flex>
						<Flex mt={"65px"} mr={"10px"} justifyContent={"end"}>
							<VscGraphLine size={100} />
						</Flex>
					</Box>
				</Flex>
			</Box>
		</Flex>
	);
};
