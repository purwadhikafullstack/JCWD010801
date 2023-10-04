import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Image,
	Button,
} from "@chakra-ui/react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { NoPaymentProof } from "./noPaymentProof";

export const PaymentProofAdmin = ({ imgURL, orderId, reload, setReload }) => {
	const hasImage = !!imgURL;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const token = localStorage.getItem("token");
	const confirmOrder = async (id) => {
		try {
			await Axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/order/payment-confirm/${id}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
					"content-Type": "Multiple/form-data",
				}
			);
			setReload(!reload);
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
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Button
				my={"auto"}
				backgroundColor={"darkblue"}
				color={"white"}
				mr={"10px"}
				_hover={{
					textColor: "white",
					bg: "blue.800",
					_before: {
						bg: "inherit",
					},
					_after: {
						bg: "inherit",
					},
				}}
				onClick={onOpen}
			>
				Payment proof ‎
				<HiOutlinePhotograph />
			</Button>
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"black"}>
						Payment Proof Order
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<ModalBody p={7} justifyContent={"center"} alignItems={"center"}>
						{hasImage && <Image src={`${process.env.REACT_APP_BASE_URL}/orders/${imgURL}`} alt={"Payment Proof"} />}
						{!hasImage && <NoPaymentProof />}
					</ModalBody>
					<Flex mb={"20px"} mt={"10px"} mr={"10px"} justifyContent={"end"} alignItems={"center"}>
						<Button
							my={"auto"}
							backgroundColor={"blue"}
							color={"white"}
							mr={"5px"}
							_hover={{
								textColor: "#0A0A0B",
								bg: "blue.300",
								_before: {
									bg: "inherit",
								},
								_after: {
									bg: "inherit",
								},
							}}
							isDisabled={!hasImage}
							onClick={() => confirmOrder(orderId)}
						>
							Process Order
						</Button>
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
							onClick={onClose}
						>
							Reject Order
						</Button>
					</Flex>
				</ModalContent>
			</Modal>
		</>
	);
};
