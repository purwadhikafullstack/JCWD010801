import { BsGraphUpArrow, BsPersonGear } from "react-icons/bs";
import { SlLogout } from "react-icons/sl";
import { FaBars } from "react-icons/fa";
import source from "../../assets/public/AM_logo_white.png";
import sourceLogo from "../../assets/public/AM_logo_only_white_trans.png";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { AiOutlineBranches } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState } from "react";

export const AdminSidebar = () => {
	const [navSize, setNavsize] = useState("small");
	return (
		<Flex
			w={navSize === "small" ? "100px" : "200px"}
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
				<Flex justifyContent={"center"}>
					<IconButton
						left={"7px"}
						variant={"unstyled"}
						icon={<FaBars size={25} />}
						color={"white"}
						onClick={() => {
							navSize === "small" ? setNavsize("large") : setNavsize("small");
						}}
					/>
					{navSize === "large" ? (
						<Text color={"white"} mt={"3px"} fontSize={"20px"}>
							Menu
						</Text>
					) : null}
				</Flex>
			</Flex>
			<Box>
				<Flex
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<AiOutlineBranches size={30} />
					{navSize === "large" ? (
						<Text color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Branches
						</Text>
					) : null}
				</Flex>
				<Flex
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "24px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<BsGraphUpArrow size={27} />
					{navSize === "large" ? (
						<Text color={"white"} ml={"12px"} mt={"2px"} fontSize={"16px"}>
							Report
						</Text>
					) : null}
				</Flex>
				<Flex
					mb={"20px"}
					color={"white"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					ml={navSize === "large" ? "20px" : "0px"}
					justifyContent={navSize === "large" ? "start" : "center"}
				>
					<BsPersonGear size={32} />
					{navSize === "large" ? (
						<Text color={"white"} ml={"12px"} mt={"2px"} fontSize={"16px"}>
							Menu
						</Text>
					) : null}
				</Flex>
			</Box>
			<Flex mb={"20px"} justifyContent={"center"} color={"white"}>
				<SlLogout size={25} />
				{navSize === "large" ? (
						<Text color={"white"} ml={"11px"} mt={"2px"} fontSize={"16px"}>
							Logout
						</Text>
					) : null}
			</Flex>
		</Flex>
	);
};
