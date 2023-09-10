import { Flex, Text, Icon, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Stack, useDisclosure, Heading } from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { ButtonTemp } from "../button";
import { BsExclamationCircle } from "react-icons/bs";
import { LuArchiveRestore } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { refreshCategories } from "../../redux/categorySlice";

export const RestoreCategory = ({ id, categoryName }) => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

    const handleSubmit = async() => {
        try {
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/category/${id}`, {}, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            dispatch(refreshCategories());
            onClose();
            toast.success("Category restored", {
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
            toast.error(err.response.data.message, {
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
        <Flex alignItems={'center'} color={'blue'} gap={3} onClick={onOpen} w='100%'>
            <Icon as={LuArchiveRestore} w='5' h='5' />
            <Text>Restore</Text>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Stack p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon as={BsExclamationCircle} w='14' h='14' />
                        <Heading>
                            Enable {categoryName}?
                        </Heading>
                        <Text fontWeight={'light'}>
                            Are you sure you want to restore {categoryName}?
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