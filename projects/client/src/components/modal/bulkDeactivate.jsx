import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
	Text,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Button,
	useDisclosure,
	ModalFooter,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { ButtonTemp } from "../button";
import { ConfirmPasswordBulkDeactivate } from "../modal/confirmPasswordBulkDeactivate";
import { useSelector } from "react-redux";

export const BulkDeactivate = ({
	selectedPIDs,
	selectedProductNames,
	reload2,
	setReload2,
	setCheckboxState,
	initialCheckboxState,
	isAllDeactivated,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { id } = useSelector((state) => state?.user?.value);

	const handleBulkDeactivate = () => {
		if (selectedPIDs.length === 0) {
			toast.error("There are no products to deactivate.", {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			return;
		}

		axios
			.patch(`${process.env.REACT_APP_API_BASE_URL}/product/bulkdeactivate`, {
				id: id,
				PIDs: selectedPIDs,
			})
			.then((response) => {
				toast.success(`${response.data.message}`, {
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
				setReload2(!reload2);
				setCheckboxState(initialCheckboxState);
				onClose();
			})
			.catch((error) => {
				toast.error(`${error.response.data.message}`, {
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
				console.error("Error deactivating products:", error);
			});
	};

	return (
		<>
			<ButtonTemp content={"Deactivate"} onClick={onOpen} ml={"15px"} isDisabled={isAllDeactivated} />
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Deactivate Selected Products
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<ModalBody>
						<Stack gap={4} p={3}>
							<Stack gap={1}>
								<Text mb={"10px"}>Confirm Deactivation Of :</Text>
								<ol>
									{selectedProductNames.map((productName) => (
										<li key={productName}>{productName}</li>
									))}
								</ol>
							</Stack>
						</Stack>
					</ModalBody>
					<ModalFooter gap={1}>
						<Button onClick={onClose}>Cancel</Button>
						<ConfirmPasswordBulkDeactivate
							isOpen={isOpen}
							onClose={onClose}
							handleBulkDeactivate={handleBulkDeactivate}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
