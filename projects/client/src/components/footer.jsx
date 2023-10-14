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
								<Text color={"gray"}>Groceries right at your doorstep</Text>
								{/* <Text fontSize={'md'} fontWeight={'medium'} color={'gray.500'}>
                                Groceries right at your doorstep
                            </Text> */}
							</Stack>
						</GridItem>
						<GridItem justifySelf={{ base: "start", md: "center" }} colSpan={1} rowSpan={1}>
							<Stack>
								<Text fontWeight={"bold"}>LOCATION</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Bandung
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Jakarta
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Surabaya
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									Yogyakarta
								</Text>
							</Stack>
						</GridItem>
						<GridItem justifySelf={{ base: "start", md: "center" }} colSpan={1} rowSpan={1}>
							<Stack>
								<Text fontWeight={"bold"}>HEADQUARTERS</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									HQ Bandung
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									HQ Jakarta
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									HQ Surabaya
								</Text>
								<Text cursor={"pointer"} _hover={{ textDecoration: "underline" }} color={"gray"}>
									HQ Yogyakarta
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
