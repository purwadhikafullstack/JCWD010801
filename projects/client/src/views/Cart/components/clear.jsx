import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Stack, Icon, Heading, Text, Flex, Button, Textarea } from "@chakra-ui/react"
import { ButtonTemp } from "../../../components/button";
import { BsCartX } from "react-icons/bs"
import { RiFeedbackLine } from "react-icons/ri"
import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshCart } from "../../../redux/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const ClearCart = ({ isEmpty }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const token = localStorage.getItem("token");
    const [ step, setStep ] = useState(1);
    const dispatch = useDispatch();
    const feedbackRef = useRef();

    const handleClear = async() => {
        try {
            let description;
            if ( !feedbackRef.current.value ) description = null
            else description = feedbackRef.current.value;

            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear`, { description }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            dispatch(refreshCart());
            closeModal();

            toast.success("Your cart has been cleared", {
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
            closeModal();
            toast.error("Failed to clear your cart, please try again later.", {
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
    }

    const closeModal = () => {
        setStep(1);
        onClose();
    }

    return (
        <>
        <Button bgColor={'white'} isDisabled={isEmpty ? true : false} onClick={onOpen} cursor={'pointer'} color={'red.300'} _hover={{ color: 'red' }}>
            <Text fontSize={'light'}>
                Clear Cart
            </Text>
        </Button>
        {step === 1 ? (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton />
                <ModalBody p={5}>
                    <Stack p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon color={'red'} as={BsCartX} w='14' h='14' />
                        <Heading>
                            Abandon Cart ?
                        </Heading>
                        <Text textAlign={'center'} fontWeight={'light'}>
                            Are you sure you want to abandon your cart?
                        </Text>
                        <Flex w='100%' gap={5}>
                            <Button w={'50%'} onClick={closeModal}>
                                Cancel
                            </Button>
                            <ButtonTemp w={'50%'} content={'Confirm'} onClick={() => setStep(2)} />
                        </Flex>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        ) : (
        <Modal closeOnEsc={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay/>
            <ModalContent>
                <ModalBody p={5}>
                    <Stack p={3} gap={5} w='100%' h='100%' justifyContent={'center'} alignItems={'center'}>
                        <Icon color={'black'} as={RiFeedbackLine} w='14' h='14' />
                        <Heading>
                            Give us your feedback
                        </Heading>
                        <Text textAlign={'center'} fontWeight={'light'}>
                            Would you mind giving us some feedback on why you abandon your cart so we can boost your shopping experiece. It would be much appreciated.
                        </Text>
                        <Textarea 
                        w={'100%'} 
                        maxH={'40px'} 
                        ref={feedbackRef}
                        placeholder="Enter your feedback here" 
                        />
                        <Flex w='100%' gap={5}>
                            <Button w={'50%'} onClick={handleClear}>
                                Skip
                            </Button>
                            <ButtonTemp w={'50%'} content={'Confirm'} onClick={handleClear} />
                        </Flex>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        )}
        </>
    )
}