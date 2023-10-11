import {
	Modal,
	ModalOverlay,
	ModalContent,
	// ModalHeader,
	ModalFooter,
	ModalBody,
	// ModalCloseButton,
	useDisclosure,
	Button,
} from "@chakra-ui/react";

import { FiAlertCircle } from "react-icons/fi";

export default function DetailAdmin({
	avatar,
	firstName,
	lastName,
	username,
	branch,
	email,
	phone,
	gender,
	birthDate,
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Button variant={"unstyled"} onClick={onOpen}>
				<FiAlertCircle size={20} />
			</Button>

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					{/* <ModalHeader>Admin's Data</ModalHeader>
					<ModalCloseButton /> */}
					<ModalBody>{username}</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
