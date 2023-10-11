import LayoutSidebar from "../../../pages/layoutSidebar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { FaBoxOpen } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { VscGraphLine } from "react-icons/vsc";
import { RiFileList3Fill } from "react-icons/ri";
import { BsFillPersonFill } from "react-icons/bs";

export const SuperAdminDashboardButton = () => {
	const user = useSelector((state) => state?.user?.value);
	const navigate = useNavigate("");
	return (
		<Flex display={["block", "block", "flex", "flex"]}>
			<Flex mt={["10px", "10px", "0px", "0px"]}>
				<LayoutSidebar />
			</Flex>
			<Flex justifyContent={"center"} w={"full"} direction={"column"}>
				<Flex ml={["15px", "18px", "6%", "7%"]} justifyContent={"space-between"}>
					<Box mt={["12px", "12px", "0px", "0px"]}>
						<Text fontSize={["12px", "20px", "25px", "30px"]} fontWeight={"bold"}>
							Dashboard Overview
						</Text>
						<Text fontSize={["10px", "12px", "17px", "17px"]} fontWeight={"light"}>
							Super Admin
						</Text>
					</Box>
					<Flex mt={"10px"} as={Link} to={"/profile"} mr={["15px", "15px", "40px", "7%"]}>
						<Box mr={"7px"} mt={"5px"}>
							<Text textAlign={"end"} fontWeight={"bold"} fontSize={["10px", "15px"]}>
								{user.firstName} {user.lastName}
							</Text>
							<Text textAlign={"end"} fontSize={"10px"}>
								{user.username}
							</Text>
						</Box>
						<Avatar
							size={"md"}
							src={`${process.env.REACT_APP_BASE_URL}/avatars/${user?.avatar ? user?.avatar : "default_not_set.png"}`}
						/>
					</Flex>
				</Flex>
				<Flex display={["box", "box", "flex", "flex"]} mt={["8px", "30px"]} justifyContent={"center"}>
					<Box
						onClick={() => navigate("/profile")}
						w={["full", "full", "28%", "28%"]}
						h={["138px", "200px"]}
						ml={["0px", "0px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 4px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={["8px", "8px", "8px", "15px"]} direction={"column"}>
							<Text
								fontWeight={"bold"}
								fontFamily={"sans-serif"}
								mt={"5px"}
								fontSize={["20px", "30px", "25px", "30px"]}
							>
								Profile
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "12px", "12px"]}>
								Your Profile
							</Text>
						</Flex>
						<Flex mr={["0px", "10px"]} mt={["0px", "45px", "43px", "40px"]} justifyContent={"end"}>
							<BsFillPersonFill size={90} />
						</Flex>
					</Box>
					<Box
						mt={["10px", "10px", "0px", "0px"]}
						onClick={() => navigate("/dashboard/product-management")}
						w={["full", "full", "28%", "28%"]}
						ml={["0px", "0px", "15px", "15px"]}
						h={["138px", "200px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 4px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={["8px", "8px", "8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "28px", "25px", "30px"]}>
								Product
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								Alphamart's products
							</Text>
						</Flex>
						<Flex mr={["5px", "10px"]} mt={["10px", "52px", "50px", "50px"]} justifyContent={"end"}>
							<FaBoxOpen size={90} />
						</Flex>
					</Box>
					<Box
						mt={["10px", "10px", "0px", "0px"]}
						onClick={() => navigate("/dashboard/discount-overview")}
						w={["full", "full", "28%", "28%"]}
						ml={["0px", "0px", "15px", "15px"]}
						h={["125px", "200px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 4px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={["8px", "8px", "8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "25px", "30px"]}>
								Discounts
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								AlphaMart Voucher & Discount
							</Text>
						</Flex>
						<Flex mr={["8px", "10px"]} mt={["5px", "60px", "60px", "55px"]} justifyContent={"end"}>
							<MdDiscount size={70} />
						</Flex>
					</Box>
				</Flex>
				<Flex display={["box", "box", "flex", "flex"]} mt={["2px", "2px", "15px", "15px"]} justifyContent={"center"}>
					<Box
						mt={["10px", "10px", "0px", "0px"]}
						onClick={() => navigate("/dashboard/admins-list")}
						w={["full", "full", "28%", "28%"]}
						ml={["0px", "0px", "0px", "0px"]}
						h={["135px", "250px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"9px"} ml={["8px", "8px", "8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "23px", "22px", "30px"]}>
								Admin Management
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								Create new admin's branch
							</Text>
						</Flex>
						<Flex mr={["8px", "10px"]} mt={["0px", "95px", "60px", "85px"]} justifyContent={"end"}>
							<FaUsersGear size={90} />
						</Flex>
					</Box>
					<Box
						mt={["10px", "10px", "0px", "0px"]}
						onClick={() => navigate("/dashboard/orders-list")}
						w={["full", "full", "28%", "28%"]}
						ml={["0px", "0px", "15px", "15px"]}
						h={["138px", "250px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={["8px", "8px", "8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "25px", "30px"]}>
								Order List
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								All branches orders
							</Text>
						</Flex>
						<Flex mr={["4px", "4px", "10px", "15px"]} mt={["0px", "95px", "95px", "88px"]} justifyContent={"end"}>
							<RiFileList3Fill size={90} />
						</Flex>
					</Box>
					<Box
						mt={["10px", "10px", "0px", "0px"]}
						onClick={() => navigate("/dashboard/product-management")}
						w={["full", "full", "28%", "28%"]}
						ml={["0px", "0px", "15px", "15px"]}
						h={["125px", "250px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"5px"} ml={["8px", "8px", "8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "25px", "30px"]}>
								Report
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								Alphamart all branches reports
							</Text>
						</Flex>
						<Flex mr={["8px", "15px"]} mt={["0px", "98px", "98px", "95px"]} justifyContent={"end"}>
							<VscGraphLine size={85} />
						</Flex>
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};
