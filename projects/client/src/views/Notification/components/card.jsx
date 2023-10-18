import axios from "axios";
import {
	Badge,
	Flex,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Spacer,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { MdDiscount } from "react-icons/md";
import { BiReceipt } from "react-icons/bi";
import { BsCircleFill } from "react-icons/bs";
import { DeleteNotification } from "./delete";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { refreshCart } from "../../../redux/cartSlice";

export const NotificationCard = ({ item, setReload, isLast = false }) => {
	const { type, name, isRead, id, createdAt } = item;
	const description = item?.description;
	const promoCode = item?.promoCode;
	const token = localStorage.getItem("token");
	const dispatch = useDispatch();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleRead = async () => {
		try {
			await axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/notification/${id}`,
				{},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			setReload((reload) => !reload);
			dispatch(refreshCart());
		} catch (err) {
			console.log(err);
		}
	};

	const handleOpen = () => {
		onOpen();
		handleRead();
	};

	return (
		<>
			<Flex
				cursor={"pointer"}
				p={{ base: 2, md: 3 }}
				alignItems={"center"}
				onClick={isRead ? onOpen : handleOpen}
				borderBottom={isLast ? null : "1px solid gray"}
				w={"100%"}
				maxH={"80px"}
				color={isRead ? "blackAlpha.600" : "black"}
				zIndex={5}
			>
				<Icon as={type === "Discount" ? MdDiscount : BiReceipt} w={7} h={7} />
				<Stack
					overflow={"hidden"}
					whiteSpace={"nowrap"}
					textOverflow={"ellipsis"}
					w={"60%"}
					ml={5}
					justifyContent={"center"}
					gap={2}
				>
					<Text fontSize={{ base: "15px", md: "20px" }} fontWeight={"semibold"}>
						{name}
					</Text>
					<Text fontSize={{ base: "12px", md: "16px" }}>{description}</Text>
				</Stack>
				<Spacer />
				<Stack mr={{ base: 0, md: 5 }} textAlign={"end"} gap={3} justifyContent={"center"} alignItems={"end"}>
					<Text fontWeight={"semibold"}>
						{new Date(createdAt)?.toLocaleDateString("us-US", {
							month: "short",
							day: "numeric",
						})}
					</Text>
					<Icon display={isRead ? "none" : "flex"} as={BsCircleFill} w={4} h={4} color={"red.700"} />
				</Stack>
				<DeleteNotification setReload={setReload} id={id} />
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bgColor={"black"} borderRadius={"10px"}>
					<ModalCloseButton />
					<ModalBody p={1}>
						<Stack borderRadius={"10px"} bgColor={"white"} p={8} alignItems={"center"} gap={2}>
							{type === "Discount" ? (
								<>
									<MdDiscount size={60} />
									<Badge fontSize={"18px"} colorScheme="orange">
										OFFER
									</Badge>
								</>
							) : (
								<>
									<BiReceipt size={60} />
									<Badge fontSize={"18px"} mt={3} colorScheme="blue">
										ORDER
									</Badge>
								</>
							)}
							<Text fontSize={"20px"} textAlign={"center"} fontWeight={"semibold"}>
								{name}
							</Text>
							{promoCode && (
								<Stack alignSelf={"start"} position={"absolute"} gap={0}>
									<Text fontSize={"13px"} textAlign={"center"}>
										PROMO CODE
									</Text>
									<Text fontSize={"20px"} fontWeight={"bold"}>
										{promoCode}
									</Text>
								</Stack>
							)}
							<Flex alignSelf={"start"} alignItems={"center"} gap={1} color={"gray"}>
								<Icon as={AiOutlineClockCircle} w={4} h={4} />
								<Text fontSize={"12px"}>
									{new Date(createdAt)?.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Text>
							</Flex>
							<Text alignSelf={"start"} textAlign={"start"}>
								{description}
							</Text>
							<Flex m={0} w={"100%"} justifyContent={"flex-end"}>
								<DeleteNotification onDetail={true} setReload={setReload} id={id} />
							</Flex>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
