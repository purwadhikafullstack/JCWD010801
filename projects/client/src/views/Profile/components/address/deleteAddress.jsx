import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteAddressButton = ({ id, reload, setReload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const token = localStorage.getItem("token");

	const handleDelete = async (id) => {
		try {
			const response = await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/address/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setReload(!reload);
			onClose();
      toast.success(response.data.message, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} catch (error) {
			toast.error(error?.response.data.error.message, {
				position: "top-right",
				autoClose: 5000,
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
			<IconButton size={"md"} variant={"ghost"} icon={<DeleteIcon />} onClick={onOpen} color={"red"} />
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Delete Address</ModalHeader>
					<ModalCloseButton />
					<ModalBody>Are you sure you want to delete this address?</ModalBody>
					<ModalFooter>
						<Button colorScheme="red" onClick={() => handleDelete(id)}>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteAddressButton;
