import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
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
import { ConfirmPasswordBulkDelete } from "../modal/confirmPasswordBulkDelete";
import { TbTrashX } from "react-icons/tb";
import { PiWarningDuotone } from "react-icons/pi";
import { useSelector } from "react-redux";

export const BulkDelete = ({
	selectedPIDs,
	selectedProductNames,
	reload2,
	setReload2,
	setCheckboxState,
	initialCheckboxState,
	isAllDeleted,
	isAllDeactivated,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { id } = useSelector((state) => state?.user?.value);

	const handleBulkDelete = () => {
		if (selectedPIDs.length === 0) {
			toast.error("There are no products to delete.", {
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
			.patch(`${process.env.REACT_APP_API_BASE_URL}/product/bulkdelete`, {
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
				console.error("Error deleting products:", error);
			});
	};

	const handleClick = () => {
		if (isAllDeleted) {
			toast.error(
				"All products on this page has already been permanently deleted. Please contact a sysadmin for reactivation.",
				{
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				}
			);
		} else if (isAllDeactivated) {
			toast.warn(
				"You need to activate the products before proceeding with deletion. If you are sure you want to delete these products, you can proceed to delete them individually.",
				{
					position: "top-right",
					autoClose: 4000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				}
			);
		} else {
			onOpen();
		}
	};

	const DeleteButton = styled(TbTrashX)`
		font-size: 28px;
		cursor: ${(props) => (props.isdisabled === "true" ? "not-allowed" : "pointer")};
		color: ${(props) => (props.isdisabled === "true" ? "#B90E0A" : "#B90E0A")};
		&:hover {
			color: ${(props) => (props.isdisabled === "true" ? "#B90E0A" : "red")};
			filter: ${(props) => (props.isdisabled === "true" ? "blur(1px)" : "none")};
		}
	`;

	return (
		<>
			<DeleteButton size={40} onClick={handleClick} isdisabled={(isAllDeactivated || isAllDeleted).toString()} />
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Permanently Delete Selected Products
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<ModalBody>
						<Stack gap={4} p={3}>
							<Stack gap={1}>
								<Text mb={"10px"}>Confirm Deletion Of :</Text>
								<ol>
									{selectedProductNames.map((productName) => (
										<li key={productName}>{productName}</li>
									))}
								</ol>

								<Text mt={"10px"}>
									<PiWarningDuotone color="red" size={30} />
									Warning! This action is not revertible. Did you mean to deactivate selected products?
									<PiWarningDuotone color="red" size={30} />
								</Text>
							</Stack>
						</Stack>
					</ModalBody>
					<ModalFooter gap={1}>
						<Button onClick={onClose}>Cancel</Button>
						<ConfirmPasswordBulkDelete isOpen={isOpen} onClose={onClose} handleBulkDelete={handleBulkDelete} />
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
