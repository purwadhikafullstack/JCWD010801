import { Text, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure, Button } from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ButtonTemp } from "../button";
import { HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { refreshCategories } from "../../redux/categorySlice";

export const CreateCategory = () => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { RoleId } = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const categorySchema = Yup.object().shape({
        category: Yup.string().required("This field must not be empty"),
        image: Yup.mixed()
        .required("This field must not be empty")
    })

    const handleSubmit = async(value) => {
        try {
            const { image, category } = value;
            const data = new FormData();
            data.append("category", category);
            data.append("image", image);

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/category`, data, {
                headers: {
                    authorization: `Bearer ${token}`
                },
                "Content-type": "multipart/form-data"
            });
            dispatch(refreshCategories());
            toast.success("New Category Added", {
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
        {RoleId > 1 && (
        <ButtonTemp 
        content={(<Icon as={HiPlus} w='10' h='10' />)} 
        w={{ base: '40px', md: 'none' }} 
        borderRadius={{ base: 'full', md: '10px' }} 
        onClick={onOpen} 
        />)}
        <Modal size={{ base: 'xs', sm: 'sm', md: 'md' }} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent borderRadius={'10px'}>
                <ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
                    Add Category
                </ModalHeader>
                <ModalCloseButton color={'white'} />
                <Formik
                initialValues={{ category: '', image: null }}
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
                                                <Input
                                                as={Field}
                                                type={'text'}
                                                variant={'filled'}
                                                name="category"
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