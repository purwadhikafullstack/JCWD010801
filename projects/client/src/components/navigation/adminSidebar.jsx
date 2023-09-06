import { BsGraphUpArrow, BsPersonGear } from "react-icons/bs";
import sourceLogo from "../../assets/public/AM_logo_only_trans.png";
import { Box, Flex, Image } from "@chakra-ui/react";
import { AiOutlineBranches } from "react-icons/ai";
import { Link } from "react-router-dom";

export const AdminSidebar = () => {
	return (
		<Flex
			w={"100px"}
			h={"100vh"}
			bg={"gray.50"}
			borderTopRightRadius={"30px"}
			boxShadow="0px 0px 8px black"
			direction={"column"}
		>
			<Flex as={Link} to={"/"} justifyContent={"center"}>
				<Image
					w={"90px"}
					src={sourceLogo}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.1)" }}
				/>
			</Flex>
			<Box>
				<Flex
					mb={"20px"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					justifyContent={"center"}
				>
					<AiOutlineBranches size={30} />
				</Flex>
				<Flex
					mb={"20px"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					justifyContent={"center"}
				>
					<BsGraphUpArrow size={28} />
				</Flex>
				<Flex
					mb={"20px"}
					transition="transform 0.3s ease-in-out"
					_hover={{ transform: "scale(1.2)" }}
					justifyContent={"center"}
				>
					<BsPersonGear size={32} />
				</Flex>
			</Box>
		</Flex>
	);
};
