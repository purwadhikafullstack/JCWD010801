import {
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalBody,
	Stack,
	Icon,
	Heading,
	Text,
	Flex,
	Button,
} from "@chakra-ui/react";
import { ButtonTemp } from "../../../components/button";
import { BsCartX } from "react-icons/bs";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refreshCart } from "../../../redux/cartSlice";

export const ClearCart = ({ isEmpty }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const token = localStorage.getItem("token");
	const dispatch = useDispatch();

	const handleClear = async () => {
		try {
			await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			dispatch(refreshCart());
			onClose();

			toast.success("Your cart has been cleared", {
				position: "top-center",
				autoClose: 2500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} catch (err) {
			onClose();
			toast.error("Failed to clear your cart, please try again later.", {
				position: "top-center",
				autoClose: 2500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		}
	};

	return (
		<>
			<Button
				bgColor={"white"}
				isDisabled={isEmpty ? true : false}
				onClick={onOpen}
				cursor={"pointer"}
				color={"red.300"}
				_hover={{ color: "red" }}
			>
				<Text fontSize={"light"}>Clear Cart</Text>
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody p={5}>
						<Stack p={3} gap={5} w="100%" h="100%" justifyContent={"center"} alignItems={"center"}>
							<Icon color={"red"} as={BsCartX} w="14" h="14" />
							<Heading>Clear Cart ?</Heading>
							<Text textAlign={"center"} fontWeight={"light"}>
								Are you sure you want to clear your cart? All of the items in your cart will be removed.
							</Text>
							<Flex w="100%" gap={5}>
								<Button w={"50%"} onClick={onClose}>
									Cancel
								</Button>
								<ButtonTemp w={"50%"} content={"Confirm"} onClick={handleClear} />
							</Flex>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
