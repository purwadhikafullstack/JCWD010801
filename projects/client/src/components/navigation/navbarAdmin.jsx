import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AlphaMartLogo from "../../assets/public/AMS_logo_trans.png";

export const NavbarAdmin = () => {
	const navigate = useNavigate();

	return (
		<Flex alignItems={"center"} justifyContent={"right"} w={"100%"} h={"85px"}>
			<Image
				src={AlphaMartLogo}
				onClick={() => navigate("/dashboard")}
				maxW={"350px"}
				maxH={"100%"}
				objectFit="contain"
				mr={"25px"}
				cursor={"pointer"}
			/>
		</Flex>
	);
};
