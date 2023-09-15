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
import { useState } from "react";
import { ButtonTemp } from "../button";

export const MoveCategories = ({ selectedPIDs, selectedProductNames, categories, reload, setReload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [newCategory, setNewCategory] = useState("");
	const [newCategoryLabel, setNewCategoryLabel] = useState("New Category");

	const handleCategorySelect = (e) => {
		const selectedIndex = e.target.selectedIndex;
		const label = e.target.options[selectedIndex].text;
		setNewCategory(e.target.value);
		setNewCategoryLabel(label);
	};

	const handleMoveCategories = () => {
		if (!newCategory) {
			alert("Please select a category before moving.");
			return;
		}
		if (selectedPIDs.length === 0) {
			alert("There are no products to move.");
			return;
		}

		axios
			.patch(`${process.env.REACT_APP_API_BASE_URL}/product/bulkcategory`, {
				PIDs: selectedPIDs,
				newCategoryId: newCategory,
			})
			.then((response) => {
				alert("Success.");
				setReload(!reload);
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
			<ButtonTemp content={"Move Categories"} onClick={handleClick} />
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Move Categories
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<ModalBody>
						<Stack gap={4} p={3}>
							<Stack gap={1}>
								<Text mb={"10px"}>Confirm Migration Of :</Text>
								<ol>
									{selectedProductNames.map((productName) => (
										<li key={productName}>{productName}</li>
									))}
								</ol>
								<Text mt={'10px'} mb={"35px"}>Into : {newCategoryLabel}</Text>
								<Text fontWeight={"semibold"}>Select New Category</Text>
								<Select
									variant="filled"
									name="newCategory"
									placeholder="New Category"
									focusBorderColor="gray.300"
									value={newCategory}
									onChange={handleCategorySelect}
								>
									{categories.map((category) => (
										<option key={category.value} value={category.value}>
											{category.label}
										</option>
									))}
								</Select>
							</Stack>
						</Stack>
					</ModalBody>
					<ModalFooter gap={3}>
						<Button onClick={onClose}>Cancel</Button>
						<ButtonTemp content={"Confirm"} onClick={handleMoveCategories} />
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
