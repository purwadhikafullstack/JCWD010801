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
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineShopping } from "react-icons/ai";
import { MdOutlineDiscount } from "react-icons/md";
import { LuHome } from "react-icons/lu";
import AlphaMartLogo from "../../assets/public/AM_logo_trans.png";
import Alpha from "../../assets/public/AM_logo_only_trans.png";

export const NavbarMobile = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();

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
								<ListItem cursor={"pointer"} onClick={() => handleNavigate("/voucher")} p={2} borderRadius={"10px"}>
									<Flex gap={7}>
										<Icon as={MdOutlineDiscount} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Vouchers
										</Text>
									</Flex>
								</ListItem>
							</List>
						</DrawerBody>
						<DrawerFooter>
							<Stack>
								<Flex w={"100%"} gap="2" alignItems={"center"}>
									<Icon as={CiLocationOn} color={"black"} w={"5"} h={"5"} />
									<Stack gap={0}>
										<Text fontSize={"sm"}>Deliver to</Text>
										<Text onClick={() => handleNavigate("/")} cursor={"pointer"} fontSize={"lg"} fontWeight={"medium"}>
											Address
										</Text>
									</Stack>
								</Flex>
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
