import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
} from "@chakra-ui/react";
import { useState } from "react";

export const ProcessOrder = ({ orderId }) => {
	const [reload, setReload] = useState(false);
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const sendOrder = async (id) => {
		try {
			await Axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/order/send/${id}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
					"content-Type": "Multiple/form-data",
				}
			);
			toast.success("Order confirmed", {
				position: "top-center",
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
		} catch (error) {
			console.log(error);
		}
	};
	const cancelOrder = async (id) => {
		try {
			await Axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/order/cancel-by-admin/${id}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
					"content-Type": "Multiple/form-data",
				}
			);
			toast.error("Order canclled", {
				position: "top-center",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			// setReload(!reload);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Button
				my={"auto"}
				backgroundColor={"green"}
				color={"white"}
				mr={"10px"}
				_hover={{
					textColor: "#0A0A0B",
					bg: "green.300",
					_before: {
						bg: "inherit",
					},
					_after: {
						bg: "inherit",
					},
				}}
				onClick={onOpen}
			>
				Send Order
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Are you sure want to confirm this order</ModalHeader>
					<ModalCloseButton />
					<ModalFooter>
						<Button mr={3} colorScheme="green" onClick={() => sendOrder(orderId)}>
							Send Order
						</Button>
						<Button colorScheme="red" onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
