import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Flex, Text, Icon, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, useDisclosure, Heading } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { RxCrossCircled } from "react-icons/rx";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ButtonTemp } from "../../../components/button";

export const DeactivateDiscount = ({ id, setReload, productName }) => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmit = async() => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/discount/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReload((reload) => !reload);
            onClose();
            toast.success(`Discount for ${productName} has been deactivated`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            toast.error("Failed to deactivate discount. Please try again later", {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    return (
        <>
        <Button bgColor={"inherit"} borderRadius={"full"} alignItems={'center'} p={0} color={'red.500'} gap={3} onClick={onOpen}>
            <Icon as={RxCrossCircled} w='7' h='7' />
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Stack textAlign={"center"} p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon as={HiOutlineExclamationCircle} w='14' h='14' />
                        <Heading>
                            Deactivate Discount for {productName}?
                        </Heading>
                        <Text fontWeight={'light'}>
                            Are you sure you want to deactivate discount for {productName}? This action is irreversible.
                        </Text>
                        <Flex w='100%' justifyContent={'center'} gap={3}>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                            <ButtonTemp content={'Confirm'} onClick={handleSubmit} />
                        </Flex>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}