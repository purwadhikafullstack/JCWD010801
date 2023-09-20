import {
    Flex,
	Text,
	Icon,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
	Button,
} from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BiUpload } from "react-icons/bi";
import { ButtonTemp } from "../../../components/button";

export const UploadProof = ({ id, orderNumber = "INV/20230813/MPL/3400120239", date, branch, amount }) => {
    const token = localStorage.getItem("token");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const paymentProofSchema = Yup.object().shape({
		image: Yup.mixed().required("This field must not be empty"),
	});

    const handleSubmit = async( value ) => {
        try {
            const { image } = value;
			const data = new FormData();
			data.append("image", image);

			await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/order/proof/${id}`, data, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				"Content-type": "multipart/form-data",
			});

            toast.success("Payment proof uploaded", {
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
        <Flex alignItems={'center'} color={'black'} gap={3} onClick={onOpen} w='100%'>
            <Icon as={BiUpload} w='5' h='5' />
            <Text>Upload Payment Proof</Text>
        </Flex>
        <Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius={"10px"}>
                <ModalHeader borderTopRadius={"10px"} color={"white"} bg={"black"}>
                    Upload Payment Proof Order {orderNumber}
                </ModalHeader>
                <ModalCloseButton color={"white"} />
                <Formik
                    initialValues={{ image: null }}
                    validationSchema={paymentProofSchema}
                    onSubmit={(value) => {
                        handleSubmit(value);
                        onClose();
                    }}
                >
                    {({ setFieldValue }) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Stack gap={4} p={3}>
                                        <Stack gap={1}>
                                            <Text fontWeight={"semibold"}>Date</Text>
                                            <Text>{new Date(date).toLocaleDateString()}</Text>
                                        </Stack>
                                        <Stack gap={1}>
                                            <Text fontWeight={"semibold"}>Branch</Text>
                                            <Text>{branch}</Text>
                                        </Stack>
                                        <Stack gap={1}>
                                            <Text fontWeight={"semibold"}>Total Amount</Text>
                                            <Text>{amount}</Text>
                                        </Stack>
                                        <Stack gap={1}>
                                            <Text fontWeight={"semibold"}>Payment proof</Text>
                                            <Stack>
                                                <Input
                                                    as={Field}
                                                    type={"file"}
                                                    name="image"
                                                    placeholder="Insert the transaction proof here"
                                                    focusBorderColor="#373433"
                                                    value={undefined}
                                                    accept="image/jpg, image/jpeg, image/png"
                                                    onChange={(e) => {
                                                        setFieldValue("image", e.target.files[0]);
                                                    }}
                                                />
                                                <ErrorMessage
                                                    component="box"
                                                    name="image"
                                                    style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <ModalFooter gap={3}>
                                        <Button onClick={onClose}>Cancel</Button>
                                        <ButtonTemp content={"Confirm"} type={"submit"} />
                                    </ModalFooter>
                                </ModalBody>
                            </Form>
                        );
                    }}
                </Formik>
            </ModalContent>
        </Modal>
        </>
    )
}