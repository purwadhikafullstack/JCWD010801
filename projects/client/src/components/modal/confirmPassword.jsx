import React, { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Stack,
	Text,
	Input,
	Button,
	Flex,
} from "@chakra-ui/react";
import { ImEye, ImEyeBlocked } from "react-icons/im";

export const ConfirmPassword = ({
	inputPassword,
	setInputPassword,
	isOpen,
	onClose,
	onConfirm,
	validationError,
	setValidationError,
}) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};

	const handleSubmit = () => {
		if (inputPassword === "") {
			setValidationError("Password is required.");
		} else {
			setValidationError("");
			onConfirm();
		}
	};

	return (
		<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent borderRadius={"10px"}>
				<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
					Confirm Action
				</ModalHeader>
				<ModalCloseButton color={"white"} />
				<ModalBody>
					<Text>You need to enter your password to confirm this action.</Text>
					<Stack gap={4} p={3}>
						<Stack gap={1}>
							<Text fontWeight={"semibold"}>Password</Text>

							<Flex align="center">
								<Input
									type={isPasswordVisible ? "text" : "password"}
									variant="filled"
									placeholder="Enter your password"
									focusBorderColor="gray.300"
									borderTopRightRadius={"0px"}
									borderBottomRightRadius={"0px"}
									value={inputPassword}
									onChange={(e) => {
										setInputPassword(e.target.value);
										setValidationError("");
									}}
								/>
								<Button
									onClick={togglePasswordVisibility}
									border="none"
									focusBorderColor="gray.300"
									borderTopLeftRadius={"0px"}
									borderBottomLeftRadius={"0px"}
								>
									{isPasswordVisible ? <ImEyeBlocked size={30} color="#DA9100" /> : <ImEye size={30} color="#DA9100" />}
								</Button>
							</Flex>
							{validationError && (
								<Text color="red" fontSize="sm">
									{validationError}
								</Text>
							)}
						</Stack>
					</Stack>
				</ModalBody>
				<ModalFooter gap={3}>
					<Button onClick={onClose}>Cancel</Button>
					<Button onClick={handleSubmit} colorScheme="red" isDisabled={!!validationError} ml={"5px"}>
						Confirm
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
