import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Flex, Text, Icon, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, useDisclosure, Heading } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ButtonTemp } from "../../../components/button";

export const ClearNotifications = ({ setReload }) => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmit = async() => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/notification`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setReload((reload) => !reload);
            onClose();
            toast.success("Notifications cleared", {
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
            toast.error("Failed to clear your notifications. Please try again later.", {
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
        <Button bgColor={"inherit"} size={"lg"} onClick={onOpen} borderRadius={"full"} p={0}>
            <Icon as={BsTrash} w='7' h='7' />
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Stack p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon as={HiOutlineExclamationCircle} w='14' h='14' />
                        <Heading>
                            Clear Notifications?
                        </Heading>
                        <Text fontWeight={'light'}>
                            Are you sure you want to clear all of your notifications? This action is irreversible.
                        </Text>
                        <Flex w='100%' justifyContent={'center'} gap={3}>
                            <Button w={"50%"} onClick={onClose}>
                                Cancel
                            </Button>
                            <ButtonTemp w={"50%"} content={'Confirm'} onClick={handleSubmit} />
                        </Flex>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}