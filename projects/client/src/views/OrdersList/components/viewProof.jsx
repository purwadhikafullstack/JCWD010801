import {
    Flex,
	Text,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
    useDisclosure,
    Image
} from "@chakra-ui/react";
import { MdOutlineImage } from "react-icons/md";

export const ViewProof = ({ orderNumber = "INV/20230813/MPL/3400120239", imgURL = "O-IMG-1695099233591902251234.jpeg" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
        <Flex alignItems={'center'} color={'black'} gap={3} onClick={onOpen} w='100%'>
            <Icon as={MdOutlineImage} w='5' h='5' />
            <Text>View Payment Proof</Text>
        </Flex>
        <Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius={"10px"}>
                <ModalHeader borderTopRadius={"10px"} color={"white"} bg={"black"}>
                    Upload Payment Proof Order {orderNumber}
                </ModalHeader>
                <ModalCloseButton color={"white"} />
                <ModalBody p={7} justifyContent={"center"} alignItems={"center"}>
                    <Image
                    src={`${process.env.REACT_APP_BASE_URL}/orders/${imgURL}`}
                    alt={"Payment Proof"}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}