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
import { ConfirmPasswordBulkActivate } from "../modal/confirmPasswordBulkActivate";

export const BulkActivate = ({
	currentPagePIDs,
	currentPageProductNames,
	reload,
	setReload,
	setCheckboxState,
	initialCheckboxState,
    isAllActivated,
    isAllDeleted,
    selectedHasActive
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleBulkActivate = () => {
		if (currentPagePIDs.length === 0) {
			toast.error("There are no products to activate.", {
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
			.patch(`${process.env.REACT_APP_API_BASE_URL}/product/bulkactivate`, {
				PIDs: currentPagePIDs,
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
				setReload(!reload);
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
				console.error("Error activating products:", error);
			});
	};

	return (
		<>
			<ButtonTemp content={"Activate"} onClick={onOpen} ml={"15px"} isDisabled={isAllDeleted || isAllActivated || selectedHasActive} />
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Activate All Products On This Page
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<ModalBody>
						<Stack gap={4} p={3}>
							<Stack gap={1}>
								<Text mb={"10px"}>Confirm Activation Of :</Text>
								<ol>
									{currentPageProductNames.map((productName) => (
										<li key={productName}>{productName}</li>
									))}
								</ol>
							</Stack>
						</Stack>
					</ModalBody>
					<ModalFooter gap={1}>
						<Button onClick={onClose}>Cancel</Button>
						<ConfirmPasswordBulkActivate
							isOpen={isOpen}
							onClose={onClose}
							handleBulkActivate={handleBulkActivate}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
