import "react-toastify/dist/ReactToastify.css";
import { Flex, Text, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure, Button } from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ButtonTemp } from "../button";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { refreshCategories } from "../../redux/categorySlice";

export const EditCategory = ({ id, categoryName, categoryImage }) => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

    const categorySchema = Yup.object().shape({
        category: Yup.string().required("This field must not be empty"),
        image: Yup.mixed()
        .required("This field must not be empty")
        .test(
            "fileSize",
            "File size is too large",
            (value) => value === null || (value && value.size <= 10000000)
        )
    })

    const handleSubmit = async(value) => {
        try {
            const { image, category } = value;
            const data = new FormData();
            data.append("category", category);
            data.append("image", image);

            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/category/${id}`, data, {
                headers: {
                    authorization: `Bearer ${token}`
                },
                "Content-type": "multipart/form-data"
            });
            dispatch(refreshCategories());
            toast.success("Category updated", {
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
            <Icon as={MdOutlineModeEdit} w='5' h='5' />
            <Text>Edit</Text>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent borderRadius={'10px'}>
                <ModalHeader borderTopRadius={"10px"} color={"white"} bg={"black"}>
                    Edit Category
                </ModalHeader>
                <ModalCloseButton color={'white'} />
                <Formik
                initialValues={{ category: '', image: '' }}
                validationSchema={categorySchema}
                onSubmit={( value ) => {
                    handleSubmit(value);
                    onClose();
                }}
                >
                    {({ setFieldValue }) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Stack gap={4} p={3} >
                                        <Stack
                                        gap={1}
                                        >
                                            <Text fontWeight={'semibold'}>
                                                Category Name
                                            </Text>
                                            <Stack>
                                                <Field
                                                as={Input}
                                                type={'text'}
                                                variant={'filled'}
                                                name="category"
                                                defaultValue={categoryName}
                                                placeholder="Enter the category name here"
                                                focusBorderColor="gray.300"
                                                />
                                                <ErrorMessage component="box" name="category" style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
                                            </Stack>
                                        </Stack>
                                        <Stack
                                        gap={1}
                                        >
                                            <Text fontWeight={'semibold'}>
                                                Category Image
                                            </Text>
                                            <Stack>
                                                <Input
                                                as={Field}
                                                type={'file'}
                                                name="image"
                                                placeholder="Insert the category image here"
                                                focusBorderColor="#373433"
                                                value={undefined}
                                                accept="image/jpg, image/jpeg, image/png"
                                                onChange={(e) => {
                                                    setFieldValue("image", e.target.files[0]);
                                                }}
                                                />
                                                <ErrorMessage component="box" name="image" style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <ModalFooter gap={3}>
                                        <Button onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <ButtonTemp content={'Confirm'} type={'submit'} />
                                    </ModalFooter>
                                </ModalBody>
                            </Form>
                        )
                    }}
                </Formik>
            </ModalContent>
        </Modal>
        </>
    )
}