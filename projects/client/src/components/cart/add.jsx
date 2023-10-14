import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
	Button,
	Icon,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Stack,
	Heading,
	Text,
	Flex,
} from "@chakra-ui/react";
import { BsCartPlus } from "react-icons/bs";
import { ButtonTemp } from "../button";
import { useDispatch, useSelector } from "react-redux";
import { refreshCart } from "../../redux/cartSlice";

export const AddToCartButton = ({ ProductId, quantity, name, isText = false, ml = 0 }) => {
	const token = localStorage.getItem("token");
	const BranchId = localStorage.getItem("BranchId");
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { RoleId } = useSelector((state) => state.user.value);

	const handleAdd = async () => {
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_API_BASE_URL}/cart`,
				{ ProductId, quantity, BranchId },
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);

			if (data.status === "Switched") onOpen();
			else {
				dispatch(refreshCart());
				toast.success(`${quantity} ${name} added to cart`, {
					position: "top-center",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			}
		} catch (err) {
			if (!token)
				toast.error(`You need to sign in first.`, {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			else if (+err.response.data.status === 403) {
				toast.error(err.response.data.message, {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
			} else
				toast.error(`Failed to add ${name} to cart. Please try again later.`, {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
		}
	};

	const handleAbandon = async () => {
		try {
			await axios.put(
				`${process.env.REACT_APP_API_BASE_URL}/cart`,
				{ BranchId },
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			handleAdd();
		} catch (err) {
			toast.error(err.response.data.message, {
				position: "top-center",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		}
	};

	const handleConfirm = () => {
		handleAbandon();
		onClose();
	};

	return (
		<>
			{isText ? (
				<ButtonTemp isDisabled={RoleId === 1 ? false : true} ml={ml} content={"Add to cart"} onClick={handleAdd} cursor={"pointer"} />
			) : (
				<Button isDisabled={RoleId === 1 ? false : true} onClick={handleAdd} bgColor={"white"} rounded={"full"} cursor={"pointer"}>
					<Icon as={BsCartPlus} w="5" h="5" color={"black"} />
				</Button>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Stack p={3} gap={5} w="100%" h="100%" justifyContent={"center"} alignItems={"center"}>
							<Icon as={HiOutlineExclamationCircle} w="14" h="14" />
							<Heading>Abandon Cart ?</Heading>
							<Text textAlign={"center"} fontWeight={"light"}>
								Your cart will be cleared if you switch your branch location.
							</Text>
							<Flex w="100%" justifyContent={"center"} gap={3}>
								<Button onClick={onClose}>Cancel</Button>
								<ButtonTemp content={"Confirm"} onClick={handleConfirm} />
							</Flex>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
