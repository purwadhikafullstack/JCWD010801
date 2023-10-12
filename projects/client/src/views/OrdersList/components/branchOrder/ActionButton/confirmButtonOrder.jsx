import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {
	Flex,
	Text,
	Icon,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	Heading,
	ModalOverlay,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { MdOutlineCheck } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ButtonTemp } from "../../../../../components/button";

export const ConfirmButtonOrder2 = ({ reload, setReload, invoice, orderId }) => {
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleSubmit = async () => {
		try {
			await axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/order/received-confirmation/${orderId}`,
				{},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success(`Order ${invoice} confirmed`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			setReload(!reload);
			onClose();
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

	useEffect(() => {
		setReload(true);
	}, [reload]);

	return (
		<>
			<Button
				my={"auto"}
				backgroundColor={"green"}
				color={"white"}
				mr={"10px"}
				_hover={{
					textColor: "#0A0A0B",
					bg: "#F0F0F0",
					_before: {
						bg: "inherit",
					},
					_after: {
						bg: "inherit",
					},
				}}
				onClick={onOpen}
			>
				<Flex mr={"5px"}>
					<MdOutlineCheck />
				</Flex>
				Confirm Order
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Stack p={3} gap={5} w="100%" h="100%" justifyContent={"center"} alignItems={"center"}>
							<Icon as={HiOutlineExclamationCircle} w="14" h="14" />
							<Heading>Confirm Order ?</Heading>
							<Text textAlign={"center"} fontWeight={"light"}>
								Are you sure you want to confirm order {invoice}?
							</Text>
							<Flex w="100%" justifyContent={"center"} gap={3}>
								<Button onClick={onClose}>Cancel</Button>
								<ButtonTemp content={"Confirm"} onClick={handleSubmit} />
							</Flex>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
