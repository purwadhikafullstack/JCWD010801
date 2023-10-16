import React from "react";
import source from "../../assets/public/AM_bg_login.png";
import sourceLogo from "../../assets/public/AM_logo_white.png";
import sourceGraphic from "../../assets/public/AM_graphic.png";
import { Flex, Image, Box } from "@chakra-ui/react";
import { RegisterFields } from "./components/registerField";

export const RegisterPageView = () => {
	return (
		<Flex minH="100vh" justifyContent="center">
			<Image position="absolute" w="full" h="100%" src={source} />
			<Flex
				position={"relative"}
				display={{ base: "none", md: "block", lg: "block" }}
				boxShadow="0px 0px 10px black"
				marginY="auto"
				w={["200px", "300px", "400px"]}
				h={["720px"]}
				bg="#373433"
			>
				<Flex mt="50px" justifyContent="center">
					<Image w={["100px", "200px", "300px"]} src={sourceLogo} />
				</Flex>
				<Flex mt="276.7px" justifyContent="center">
					<Image w={["100px", "200px", "400px"]} src={sourceGraphic} />
				</Flex>
			</Flex>
			<Flex
				position={"relative"}
				boxShadow="0px 0px 10px black"
				marginY={{ base: "5", md: "auto" }}
				w={["260px", "380px", "400px"]}
				minH={["90%", "700px"]}
				// pb={"5"}
				bg="#F6F6F6"
			>
				<Flex align="center" justify="center" h="100%" w={"100%"}>
					<Box w="80%">
						<RegisterFields />
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};
