import {
	List,
	ListItem,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Icon,
	Image,
	Stack,
	Text,
	useDisclosure,
	Divider,
	Box,
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineShopping } from "react-icons/ai";
import { MdOutlineDiscount } from "react-icons/md";
import { BsBagHeartFill } from "react-icons/bs";
import { LuHome } from "react-icons/lu";
import AlphaMartLogo from "../../assets/public/AM_logo_trans.png";
import Alpha from "../../assets/public/AM_logo_only_trans.png";
import { useSelector } from "react-redux";

export const NavbarMobile = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();
	const address = useSelector((state) => state?.address?.value);
	const RoleId = useSelector((state) => state?.user?.value?.RoleId);
	const token = localStorage.getItem("token");

	const handleNavigate = (to) => {
		navigate(to);
		onClose();
	}

	return (
		<>
			<Flex display={{ base: "flex", lg: "none" }}>
				<Button
					onClick={onOpen}
					bgColor={"white"}
					border={"none"}
					display={{ base: "block", lg: "none" }}
					borderRadius={"full"}
				>
					<Icon as={RxHamburgerMenu} w={"5"} h={"5"} color={"black"} display={{ base: "block", lg: "none" }} />
				</Button>
				<Image src={Alpha} w={"40px"} />
			</Flex>
			<Drawer isOpen={isOpen} placement={"left"} onClose={onClose} size={"xs"}>
				<DrawerOverlay>
					<DrawerContent bgColor={"white"}>
						<DrawerCloseButton />
						<DrawerHeader alignItems={"center"} justifySelf={"center"}>
							<Image cursor={"pointer"} onClick={() => handleNavigate("/")} src={AlphaMartLogo} w={"200px"} />
						</DrawerHeader>
						<DrawerBody>
							<List spacing={3}>
								<ListItem cursor={"pointer"} onClick={() => handleNavigate("/")} p={2} borderRadius={"10px"}>
									<Flex gap={7}>
										<Icon as={LuHome} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Home
										</Text>
									</Flex>
								</ListItem>
								<ListItem cursor={"pointer"} onClick={() => handleNavigate("/search")} p={2} borderRadius={"10px"}>
									<Flex gap={7}>
										<Icon as={AiOutlineShopping} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Shop
										</Text>
									</Flex>
								</ListItem>
								{+RoleId === 1 && (
									<>
									<ListItem cursor={"pointer"} onClick={() => handleNavigate("/voucher")} p={2} borderRadius={"10px"}>
										<Flex gap={7}>
											<Icon as={MdOutlineDiscount} w="7" h="7" color={"black"} />
											<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
												Vouchers
											</Text>
										</Flex>
									</ListItem>
									<ListItem display={{ base: "flex", md: "none" }} cursor={"pointer"} onClick={() => handleNavigate("/voucher")} p={2} borderRadius={"10px"}>
										<Flex gap={7}>
											<Icon as={BsBagHeartFill} w="7" h="7" color={"black"} />
											<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
												Wishlist
											</Text>
										</Flex>
									</ListItem>
									</>
								)}
							</List>
						</DrawerBody>
						<DrawerFooter>
							<Stack>
								{token && address !== undefined && Object.keys(address).length > 0 ? (
									<Flex w="100%" justifyContent={"space-between"} alignItems={"center"}>
										<Flex gap="2" alignItems={"center"} justifyContent={"center"}>
											<Icon as={CiLocationOn} color={"black"} w={"5"} h={"5"} />
											<Stack gap={0}>
												<Box onClick={() => navigate("/profile#addresses")}>
													<Text fontSize={{ base: "xs", lg: "sm" }}>Deliver To</Text>
													<Text cursor={"pointer"} fontSize={{ base: "sm", lg: "md" }} fontWeight={"medium"}>
														{address.label}
													</Text>
												</Box>
											</Stack>
										</Flex>
									</Flex>
								) : null}
								<Divider />
								<Text fontSize={"sm"} color={"gray.500"}>
									Copyright © {new Date().getFullYear()} Alphamart. All rights reserved.
								</Text>
							</Stack>
						</DrawerFooter>
					</DrawerContent>
				</DrawerOverlay>
			</Drawer>
		</>
	);
};
