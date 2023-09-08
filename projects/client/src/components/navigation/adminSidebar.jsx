import source from "../../assets/public/AM_logo_white.png";
import sourceLogo from "../../assets/public/AM_logo_only_white_trans.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { SlLogout } from "react-icons/sl";
import { FaBars } from "react-icons/fa";
import { AiOutlineBranches } from "react-icons/ai";
import { BsGraphUpArrow, BsPersonGear } from "react-icons/bs";
import { useSelector } from "react-redux";

export const AdminSidebar = () => {
	const [navSize, setNavsize] = useState("small");
	const superAdmin = useSelector((state) => state.user.value);
	return (
		<Flex
			position={"fixed"}
			w={navSize === "small" ? "100px" : "170px"}
			h={"100vh"}
			backgroundColor={"blackAlpha.900"}
			borderTopRightRadius={"30px"}
			boxShadow="0px 0px 8px black"
			justifyContent={"space-between"}
			direction={"column"}
		>
			<Flex mt={"10px"} direction={"column"}>
				<Flex justifyContent={"center"} as={Link} to={"/"}>
					<Image
						w={navSize === "small" ? "60px" : "120px"}
						src={navSize === "small" ? sourceLogo : source}
						transition="transform 0.3s ease-in-out"
						_hover={{ transform: "scale(1.1)" }}
					/>
				</Flex>
			</Flex>
			<Box>
				<Flex
					onClick={() => {
						navSize === "small" ? setNavsize("large") : setNavsize("small");
					}}
					_hover={{ transform: "scale(1.1)" }}
					transition="transform 0.3s ease-in-out"
					justifyContent={"center"}
				>
					<IconButton
						mb={"15px"}
						variant={"unstyled"}
						icon={<FaBars size={25} />}
						color={"white"}
						ml={navSize === "large" ? "0px" : "15px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					/>
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} mr={"10px"} mt={"7px"} fontSize={"16px"}>
							Dashboard
						</Text>
					) : null}
				</Flex>
				<Flex
					as={Link}
					to={"/admindashboard"}
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<AiOutlineBranches size={30} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Branches
						</Text>
					) : null}
				</Flex>
				<Flex
					as={Link}
					to={"/admindashboard"}
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "24px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<BsGraphUpArrow size={27} />
					{navSize === "large" ? (
						<Text cursor={"pointer"} color={"white"} ml={"12px"} mt={"2px"} fontSize={"16px"}>
							Report
						</Text>
					) : null}
				</Flex>
				{superAdmin.RoleId === 3 ? (
					<Flex
						as={Link}
						to={"/admindashboard/adminslist"}
						mb={"20px"}
						color={"white"}
						transition="transform 0.3s ease-in-out"
						_hover={{ transform: "scale(1.1)" }}
						ml={navSize === "large" ? "20px" : "0px"}
						mt={navSize === "large" ? "20px" : "0px"}
						justifyContent={navSize === "large" ? "start" : "center"}
					>
						<Box mt={navSize === "large" ? "8px" : "0px"}>
							<BsPersonGear size={32} />
						</Box>
						{navSize === "large" ? (
							<Text cursor={"pointer"} color={"white"} ml={"12px"} fontSize={"16px"}>
								Admin Management
							</Text>
						) : null}
					</Flex>
				) : null}
			</Box>
			<Flex mb={"20px"} justifyContent={"center"} color={"white"}>
				<SlLogout size={25} />
				{navSize === "large" ? (
					<Text cursor={"pointer"} color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
						Logout
					</Text>
				) : null}
			</Flex>
		</Flex>
	);
};
