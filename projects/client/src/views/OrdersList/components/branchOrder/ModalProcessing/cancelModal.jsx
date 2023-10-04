import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
	Button,
} from "@chakra-ui/react";

export const CancelProcessOrder = ({ reload, setReload, orderId }) => {
	const token = localStorage.getItem("token");
	const AID = useSelector((state) => state?.user?.value?.id);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const cancelOrder = async (id) => {
		try {
			await Axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/order/cancel-by-admin/${id}?AID=${AID}`,
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
			setReload(!reload);
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Button
				my={"auto"}
				backgroundColor={"red"}
				color={"white"}
				mr={"10px"}
				_hover={{
					textColor: "#0A0A0B",
					bg: "red.300",
					_before: {
						bg: "inherit",
					},
					_after: {
						bg: "inherit",
					},
				}}
				onClick={onOpen}
			>
				Cancel
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Are you sure want to cancel this order</ModalHeader>
					<ModalCloseButton />
					<ModalFooter>
						<Button mr={3} colorScheme="red" onClick={() => cancelOrder(orderId)}>
							Cancel Order
						</Button>
						<Button colorScheme="blue" onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
