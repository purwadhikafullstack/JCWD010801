import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Icon, Button, useDisclosure, Modal, Stack, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Text, Heading, Flex } from "@chakra-ui/react";
import { BsCartDash } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { refreshCart } from "../../../redux/cartSlice";
import { ButtonTemp } from "../../../components/button";

export const RemoveItem = ({ name, ProductId, ...props }) => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const token = localStorage.getItem("token");

    const handleRemove = async() => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/cart/${ProductId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            dispatch(refreshCart());
            onClose();
            toast.success(`${name} has been removed from your cart.`, {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            toast.error(`Failed to remove ${name} from your cart, please try again later.`, {
                position: "top-center",
                autoClose: 2500,
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
        <Button onClick={onOpen} bgColor={'inherit'} borderRadius={'full'} p={0} { ...props }>
            <Icon as={RxCross2} w={'5'} h={'5'} color={'blackAlpha.700'} />
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalBody p={5}>
                    <Stack p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon as={BsCartDash} w='14' h='14' />
                        <Heading mt={0}>
                            Remove {name}?
                        </Heading>
                        <Text textAlign={'center'} fontWeight={'light'}>
                            Are you sure you want to remove {name} from your cart?
                        </Text>
                        <Flex w='100%' justifyContent={'center'} gap={3}>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                            <ButtonTemp content={'Confirm'} onClick={handleRemove} />
                        </Flex>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}