import "react-toastify/dist/ReactToastify.css";
import { Flex, Text, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure, Button, Image } from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ButtonTemp } from "../button";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { refreshCategories } from "../../redux/categorySlice";
import { useState } from "react";

export const EditCategory = ({ id, categoryName, categoryImage }) => {
    const token = localStorage.getItem('token');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imageChanged, setImageChanged] = useState(false);
    const dispatch = useDispatch();

    const categorySchema = Yup.object().shape({
        category: Yup.string().required("This field must not be empty"),
        image: Yup.mixed()
		.required("This field must not be empty")
		.test("fileSize", "Image size is too large (max 1MB)", (value) => {
			if (!value) return true;
			return value.size <= 1024 * 1024;
		})
		.test("fileType", "Only JPG, JPEG, PNG, WEBP, and GIF image types are supported.", (value) => {
			if (!value) return true;
			const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
			return acceptedTypes.includes(value.type);
		}),
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
                    {({ setFieldValue, values }) => {
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
                                        <Stack gap={1}>
                                            <Text fontWeight={"semibold"}>Category Image</Text>
                                            <Stack align={"center"}>
                                                <input type="hidden" name="originalImage" value={categoryImage} />
                                                {!imageChanged && (
                                                    <Image
                                                        src={categoryImage}
                                                        alt="Original"
                                                        boxSize={"250px"}
                                                        maxW={"250px"}
                                                        maxH={"250px"}
                                                    />
                                                )}
                                                {imageChanged && (
                                                    <img
                                                        id="previewImage"
                                                        src={values.image ? URL.createObjectURL(values.image) : ""}
                                                        alt="Loading Preview.."
                                                        style={{
                                                            display: values.image ? "block" : "none",
                                                            width: "250px",
                                                            height: "250px",
                                                            maxWidth: "250px",
                                                            maxHeight: "250px",
                                                        }}
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    style={{ display: "none" }}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setFieldValue("image", file);
                                                        setImageChanged(true);
                                                        const previewImage = document.getElementById("previewImage");
                                                        if (previewImage && file) {
                                                            previewImage.style.display = "block";
                                                            const reader = new FileReader();
                                                            reader.onload = (e) => {
                                                                previewImage.src = e.target.result;
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        document.getElementById("image").click();
                                                    }}
                                                >
                                                    Change Image
                                                </Button>
                                                <ErrorMessage
                                                    component="box"
                                                    name="image"
                                                    style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "12px" }}
                                                />
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