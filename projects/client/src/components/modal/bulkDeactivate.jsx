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
	Select,
	useDisclosure,
	ModalFooter,
} from "@chakra-ui/react";
import { ButtonTemp } from "../button";

export const BulkDeactivate = ({ selectedPIDs, selectedProductNames, reload, setReload, setCheckboxState, initialCheckboxState }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleBulkDeactivate = () => {
		if (selectedPIDs.length === 0) {
			alert("There are no products to deactivate.");
			return;
		}

		axios
			.patch(`${process.env.REACT_APP_API_BASE_URL}/product/bulkdeactivate`, {
				PIDs: selectedPIDs,
			})
			.then((response) => {
				alert("Success.");
				setReload(!reload);
                setCheckboxState(initialCheckboxState)
				onClose();
			})
			.catch((error) => {
				alert("Failed.");
				console.error("Error updating products:", error);
			});
	};

	const handleClick = () => {
		onOpen();
	};

	return (
		<>
			<ButtonTemp content={"Deactivate"} onClick={handleClick} ml={'20px'} />
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
					<ModalFooter gap={3}>
						<Button onClick={onClose}>Cancel</Button>
						<ButtonTemp content={"Confirm"} onClick={handleBulkDeactivate} />
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
