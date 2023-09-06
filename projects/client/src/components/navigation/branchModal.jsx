import {
	Box,
	Text,
	Modal,
	ModalBody,
	ModalContent,
	ModalCloseButton,
	ModalOverlay,
	ModalHeader,
	useDisclosure,
	Button,
	Divider,
} from "@chakra-ui/react";
// import { useLocation, useNavigate } from "react-router-dom";

export const BranchModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	// const location = useLocation();
	// const params = new URLSearchParams(location.search);
	// const branch_id = params.get('branch_id') || '';
	// const navigate = useNavigate();

	const branches = ["branch 1", "branch 2", "branch 3", "branch 4"];

	const changeBranch = (branchId) => {
		// navigate(`?branch_id=${branchId}`)
		onClose();
	};
	return (
		<>
			<Button onClick={onOpen}>branch 1</Button>
			<Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay>
					<ModalContent>
						<ModalHeader justifyContent={"center"} w="100%">
							<Text textAlign={"center"} fontWeight={"medium"} fontSize={"lg"}>
								Select Branch Location
							</Text>
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{branches.map((item, index) => {
								return (
									<>
										<Text
											textAlign={"center"}
											as={Box}
											key={index}
											role={"group"}
											borderRadius={"md"}
											p={2}
											fontWeight={400}
											color={"gray.500"}
											_hover={{
												bgColor: "blackAlpha.100",
												color: "black",
												fontWeight: 500,
											}}
										>
											{item}
										</Text>
										{index + 1 !== branches.length && (
											<Divider size={"100px"} colorScheme="blue" />
										)}
									</>
								);
							})}
						</ModalBody>
					</ModalContent>
				</ModalOverlay>
			</Modal>
		</>
	);
};
