import Axios from "axios";
import LayoutSidebar from "../../../pages/layoutSidebar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { FaBoxOpen } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { VscGraphLine } from "react-icons/vsc";
import { RiFileList3Fill } from "react-icons/ri";
import { BsFillPersonFill } from "react-icons/bs";
import { useEffect, useState } from "react";

export const BranchAdminDashboardButton = () => {
	const [branches, setBranches] = useState([]);
	const navigate = useNavigate("");
	const user = useSelector((state) => state?.user?.value);
	const currentBranchInfo = branches.find((branch) => branch.id === user.BranchId);
	const currentBranchName = currentBranchInfo?.name;

	const fetchBranchData = async () => {
		try {
			const branchResponse = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/branches`);
			setBranches(branchResponse.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchBranchData();
	}, []);

	return (
		<Flex display={["block", "block", "flex", "flex"]}>
			<Flex mt={["10px", "10px", "0px", "0px"]}>
				<LayoutSidebar />
			</Flex>
			<Flex justifyContent={"center"} direction={"column"} w={"full"}>
				<Flex ml={["15px", "18px", "6%", "7%"]} justifyContent={"space-between"}>
					<Box mt={["12px", "12px", "0px", "0px"]}>
						<Text fontSize={["12px", "20px", "25px", "30px"]} fontWeight={"bold"}>
							Dashboard Overview
						</Text>
						<Text fontSize={["10px", "12px", "17px", "17px"]} fontWeight={"light"}>
							{currentBranchName} Branch Admin
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
						<Flex mt={"5px"} ml={["8px", "15px"]} direction={"column"}>
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
						<Flex mr={["0px", "10px"]} mt={["0px", "45px", "40px", "40px"]} justifyContent={"end"}>
							<BsFillPersonFill size={[90]} />
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
						<Flex mt={"5px"} ml={["8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "28px", "25px", "30px"]}>
								Product
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								AlphaMart {currentBranchName} Product Management
							</Text>
						</Flex>
						<Flex mr={["5px", "10px"]} mt={["10px", "52px", "40px", "50px"]} justifyContent={"end"}>
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
						<Flex mt={"5px"} ml={["8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "25px", "30px"]}>
								Discounts
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "11px", "12px"]}>
								AlphaMart {currentBranchName} Voucher & Discount
							</Text>
						</Flex>
						<Flex mr={["8px", "10px"]} mt={["0px", "55px", "42px", "50px"]} justifyContent={"end"}>
							<MdDiscount size={80} />
						</Flex>
					</Box>
				</Flex>
				<Flex display={["box", "box", "flex", "flex"]} mt={["2px", "2px", "15px", "15px"]} justifyContent={"center"}>
					<Box
						onClick={() => navigate("/dashboard/orders-list")}
						w={["full", "full", "43%", "43%"]}
						h={["140px", "250px"]}
						ml={["0px", "0px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mt={"9px"} ml={["8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "35px", "35px"]}>
								Order List
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "12px", "12px", "12px"]}>
								Orders for AlphaMart {currentBranchName} Branch
							</Text>
						</Flex>
						<Flex mt={["0px", "88px", "75px", "75px"]} mr={["2px", "1px", "15px", "15px"]} justifyContent={"end"}>
							<RiFileList3Fill size={95} />
						</Flex>
					</Box>
					<Box
						mt={["10px", "10px", "0px", "0px"]}
						onClick={() => navigate("/dashboard/report/welcome")}
						w={["full", "full", "43%", "43%"]}
						h={["145px", "250px"]}
						ml={["0px", "0px", "12px", "12px"]}
						borderRadius={"10px"}
						boxShadow="0px 0px 5px gray"
						bg={"blackAlpha.100"}
						transition="background-color 0.3s ease-in-out"
						_hover={{ bg: "blackAlpha.500" }}
					>
						<Flex mb={["15px", "0px"]} mt={"5px"} ml={["8px", "15px"]} direction={"column"}>
							<Text fontWeight={"bold"} fontFamily={"sans-serif"} fontSize={["20px", "30px", "40px", "40px"]}>
								Report
							</Text>
							<Text fontFamily={"sans-serif"} fontSize={["10px", "10px", "12px", "12px"]}>
								Report for AlphaMart {currentBranchName} Branch
							</Text>
						</Flex>
						<Flex mt={["0px", "95px", "78px", "78px"]} mr={["8px", "15px"]} justifyContent={"end"}>
							<VscGraphLine size={90} />
						</Flex>
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};
