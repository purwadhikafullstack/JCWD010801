import {
	Modal,
	ModalOverlay,
	ModalContent,
	// ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	Flex,
	Avatar,
	Box,
	Text,
	Badge,
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
	joinDate,
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
					{/* <ModalHeader>Admin's Data</ModalHeader> */}
					<ModalCloseButton />
					<ModalBody>
						<Flex justifyContent={"space-between"} mt={"10px"} mb={"10px"}>
							<Flex direction={"column"} justifyContent={"center"}>
								<Box>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										NAME
									</Text>
									<Text fontSize={"20px"} fontWeight={"semibold"}>
										{firstName} {lastName}
									</Text>
								</Box>
								<Box mt={"10px"}>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										USERNAME
									</Text>
									<Text fontSize={"20px"} fontWeight={"semibold"}>
										{username}
									</Text>
								</Box>
								<Box mt={"10px"}>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										E-MAIL
									</Text>
									<Text fontSize={"17px"} fontWeight={"light"} fontFamily={"serif"}>
										{email}
									</Text>
								</Box>
								<Box mt={"10px"}>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										PHONE NUMBER
									</Text>
									<Text fontSize={"17px"} fontWeight={"semibold"}>
										{phone}
									</Text>
								</Box>
								<Box mt={"10px"}>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										GENDER
									</Text>
									<Text fontSize={"20px"} fontWeight={"semibold"}>
										{gender}
									</Text>
								</Box>
								<Box mt={"10px"}>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										BIRTH DATE
									</Text>
									<Text fontSize={"17px"} fontWeight={"semibold"}>
										{new Date(`${birthDate}`).toLocaleDateString("us-us", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</Text>
								</Box>
								<Box mt={"10px"}>
									<Text fontSize={"10px"} fontWeight={"bold"} color={"gray.500"}>
										JOIN DATE
									</Text>
									<Text fontSize={"17px"} fontWeight={"semibold"}>
										{new Date(`${joinDate}`).toLocaleDateString("us-us", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</Text>
								</Box>
							</Flex>
							<Flex direction={"column"} justifyContent={"center"}>
								<Avatar
									src={`${process.env.REACT_APP_BASE_URL}/avatars/${avatar ? avatar : "default_not_set.png"}`}
									size={"2xl"}
								/>
								<Flex mt={"5px"} justifyContent={"center"}>
									<Badge colorScheme="yellow">{branch}'s Admin</Badge>
								</Flex>
							</Flex>
						</Flex>
					</ModalBody>
					{/* <ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter> */}
				</ModalContent>
			</Modal>
		</>
	);
}
