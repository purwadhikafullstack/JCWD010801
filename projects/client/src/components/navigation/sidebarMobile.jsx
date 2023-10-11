import AlphaMartLogo from "../../assets/public/AM_logo_trans.png";
import Alpha from "../../assets/public/AM_logo_only_trans.png";
import "react-toastify/dist/ReactToastify.css";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { setValue } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LuHome } from "react-icons/lu";
import { SlLogout } from "react-icons/sl";
import { LiaBoxSolid } from "react-icons/lia";
import { BsPersonGear } from "react-icons/bs";
import { VscGraphLine } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineShopping } from "react-icons/ai";
import { MdOutlineDiscount } from "react-icons/md";
import { RiDashboardLine, RiFileList3Line } from "react-icons/ri";

export const SidebarMobile = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state?.user?.value);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem("token");
		toast.success("You have successfully logged out.", {
			position: "top-right",
			autoClose: 4000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
		dispatch(setValue({}));
		navigate("/login");
	};

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
							<Image cursor={"pointer"} onClick={() => navigate("/")} src={AlphaMartLogo} w={"200px"} />
						</DrawerHeader>
						<DrawerBody>
							<List spacing={3}>
								<ListItem cursor={"pointer"} onClick={() => navigate("/dashboard")} p={2} borderRadius={"10px"}>
									<Flex gap={7}>
										<Icon as={RiDashboardLine} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Dashboard
										</Text>
									</Flex>
								</ListItem>
								<ListItem cursor={"pointer"} onClick={() => navigate("/")} p={2} borderRadius={"10px"}>
									<Flex gap={7}>
										<Icon as={LuHome} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Home
										</Text>
									</Flex>
								</ListItem>
								<ListItem
									cursor={"pointer"}
									onClick={() => navigate("/dashboard/product-management")}
									p={2}
									borderRadius={"10px"}
								>
									<Flex gap={7}>
										<Icon as={LiaBoxSolid} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Products
										</Text>
									</Flex>
								</ListItem>
								<ListItem
									cursor={"pointer"}
									onClick={() => navigate("/dashboard/orders-list")}
									p={2}
									borderRadius={"10px"}
								>
									<Flex gap={7}>
										<Icon as={AiOutlineShopping} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Orders
										</Text>
									</Flex>
								</ListItem>
								<ListItem
									cursor={"pointer"}
									onClick={() => navigate("/dashboard/discount-overview")}
									p={2}
									borderRadius={"10px"}
								>
									<Flex gap={7}>
										<Icon as={MdOutlineDiscount} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Discount
										</Text>
									</Flex>
								</ListItem>
								<ListItem cursor={"pointer"} onClick={() => navigate("/")} p={2} borderRadius={"10px"}>
									<Flex gap={7}>
										<Icon as={RiFileList3Line} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Sales
										</Text>
									</Flex>
								</ListItem>
								<ListItem
									cursor={"pointer"}
									onClick={() => navigate("/dashboard/report/overview")}
									p={2}
									borderRadius={"10px"}
								>
									<Flex gap={7}>
										<Icon as={VscGraphLine} w="7" h="7" color={"black"} />
										<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
											Report
										</Text>
									</Flex>
								</ListItem>
								{user.RoleId === 3 ? (
									<ListItem
										cursor={"pointer"}
										onClick={() => navigate("/dashboard/admins-list")}
										p={2}
										borderRadius={"10px"}
									>
										<Flex gap={7}>
											<Icon as={BsPersonGear} w="7" h="7" color={"black"} />
											<Text fontSize={"xl"} cursor={"pointer"} fontWeight={"medium"}>
												Admin Management
											</Text>
										</Flex>
									</ListItem>
								) : null}
							</List>
						</DrawerBody>
						<DrawerFooter>
							<Stack>
								<Flex w="100%" justifyContent={"center"} alignItems={"center"}>
									<Flex onClick={logout} gap="2" alignItems={"center"} justifyContent={"center"}>
										<Icon as={SlLogout} color={"black"} w={"5"} h={"5"} />

										<Text onClick={() => navigate("/")} cursor={"pointer"} fontSize={"lg"} fontWeight={"medium"}>
											Logut
										</Text>
									</Flex>
								</Flex>
							</Stack>
						</DrawerFooter>
					</DrawerContent>
				</DrawerOverlay>
			</Drawer>
		</>
	);
};
