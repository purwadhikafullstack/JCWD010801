import { Flex, Stack, Text, Image, Divider, Grid, GridItem, Icon } from "@chakra-ui/react";
import { FaFacebookSquare, FaInstagramSquare, FaWhatsappSquare, FaLinkedin } from "react-icons/fa";
import logo from "../assets/public/AM_logo_trans.png";

export const Footer = ({ isNotDisabled = true }) => {
	return (
		<>
			{isNotDisabled && (
				<Stack
					w="100%"
					bgColor="gray.100"
					gap={4}
					pl={{ base: "20px", md: "40px", lg: "60px" }}
					pr={{ base: "20px", md: "40px", lg: "60px" }}
					pt={"30px"}
					pb={"30px"}
					alignItems={"center"}
				>
					<Grid
						w="100%"
						gap={{ base: 10, md: 0 }}
						h="100%"
						templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
						templateRows={{ base: "repeat(2, 1fr)", md: "1fr" }}
					>
						<GridItem justifySelf={{ base: "start", md: "center" }} colSpan={1} rowSpan={1}>
							<Stack gap={0}>
								<Image src={logo} w={"200px"} />
								<Text color={"gray"}>Groceries Right At Your Doorsteps</Text>
							</Stack>
						</GridItem>
						<GridItem justifySelf={{ base: "start", md: "center" }} colSpan={1} rowSpan={1}>
							<Stack>
								<Text fontWeight={"bold"}>LOCATIONS</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Jakarta
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Bandung
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Jogjakarta
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Surabaya
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Batam
								</Text>
							</Stack>
						</GridItem>
						<GridItem justifySelf={{ base: "start", md: "center" }} colSpan={1} rowSpan={1}>
							<Stack>
								<Text fontWeight={"bold"}>HEADQUARTERS</Text>
								<Text
									cursor={"pointer"}
									_hover={{ textDecoration: "underline" }}
									color={"gray"}
									fontSize={{ base: "12px", md: "16px" }}
								>
									AlphaMart Jakarta Office
								</Text>
								<Text
									cursor={"pointer"}
									_hover={{ textDecoration: "underline" }}
									color={"gray"}
									fontSize={{ base: "8px", md: "12px" }}
								>
									Jl. BSD Green Office Park, GOP 9 - G Floor BSD City, Sampora, Kec. Cisauk, Kabupaten Tangerang, Banten
									15345
								</Text>
								<Text
									cursor={"pointer"}
									_hover={{ textDecoration: "underline" }}
									color={"gray"}
									fontSize={{ base: "12px", md: "16px" }}
								>
									AlphaMart Bandung Office
								</Text>
								<Text
									cursor={"pointer"}
									_hover={{ textDecoration: "underline" }}
									color={"gray"}
									fontSize={{ base: "8px", md: "12px" }}
								>
									Menara Monex LT.6, Jl. Asia Afrika No.133-137, Kb. Pisang, Kec. Sumur Bandung, Kota Bandung, Jawa
									Barat 40112
								</Text>
							</Stack>
						</GridItem>
						<GridItem justifySelf={{ base: "start", md: "center" }} colSpan={1} rowSpan={1}>
							<Stack>
								<Text fontWeight={"bold"}>FOLLOW US</Text>
								<Flex gap={3} justifyContent={"space-between"}>
									<Icon cursor={"pointer"} as={FaFacebookSquare} w="7" h="7" />
									<Icon cursor={"pointer"} as={FaInstagramSquare} w="7" h="7" />
									<Icon cursor={"pointer"} as={FaWhatsappSquare} w="7" h="7" />
									<Icon cursor={"pointer"} as={FaLinkedin} w="7" h="7" />
								</Flex>
							</Stack>
						</GridItem>
					</Grid>
					<Divider colorScheme="blackAlpha" />
					<Text fontSize={"sm"} color={"gray.500"}>
						Copyright © {new Date().getFullYear()} Alphamart. All rights reserved.
					</Text>
				</Stack>
			)}
		</>
	);
};
