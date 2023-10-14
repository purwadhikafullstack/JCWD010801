import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Flex, Text, Icon, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, useDisclosure, Heading } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { BiTrashAlt } from "react-icons/bi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ButtonTemp } from "../../../components/button";

export const DeleteNotification = ({ setReload, id, onDetail = false }) => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmit = async() => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/notification/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setReload((reload) => !reload);
            onClose();
            toast.success("Notification deleted", {
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
            toast.error("Failed to delete notification. Please try again later.", {
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
        <Button display={onDetail ? "flex" : { base: "none", md: "flex" }} zIndex={10} bgColor={"inherit"} color={"red.700"} size={"lg"} onClick={onOpen} borderRadius={"full"} p={0}>
            <Icon as={BiTrashAlt} w='6' h='6' />
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Stack p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon as={HiOutlineExclamationCircle} w='14' h='14' />
                        <Heading>
                            Delete Notification?
                        </Heading>
                        <Text fontWeight={'light'}>
                            Are you sure you want to delete this notification? This action is irreversible.
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