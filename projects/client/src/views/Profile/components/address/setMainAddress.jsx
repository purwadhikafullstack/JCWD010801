import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	IconButton,
} from "@chakra-ui/react";
import { MdAddLocationAlt } from "react-icons/md";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ButtonTemp } from "../../../../components/button";

const MainAddressButton = ({ id, reload, setReload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const token = localStorage.getItem("token");

	
	const handleSubmit = async (id) => {
		try {
			const response = await Axios.patch(
				`${process.env.REACT_APP_API_BASE_URL}/address/main/${id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
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
			toast.error(error?.response?.data?.error.message, {
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
			<IconButton size={"md"} variant={"ghost"} icon={<MdAddLocationAlt />} onClick={onOpen} />
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Main Address</ModalHeader>
					<ModalCloseButton />
					<ModalBody>Are you sure you want to set this address as main address?</ModalBody>
					<ButtonTemp m={4} onClick={() => handleSubmit(id)} content={"Save"} w="max-content" />
				</ModalContent>
			</Modal>
		</>
	);
};

export default MainAddressButton;
