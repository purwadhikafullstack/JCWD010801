import Axios from 'axios';
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input, FormControl, FormLabel, Flex, Box, useToast, } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function AddAdmin() {
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const toast = useToast();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleClick = () => setShow(!show);
    const Formschema = Yup.object().shape(({
        fullName: Yup.string()
            .required("Write your name"),
        email: Yup.string()
            .email("Invalid email addres format")
            .required("Write your Email"),
        phone: Yup.string()
            .required("Write your Phone"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password minimum 6 characters long")
            .matches(/^(?=.*[A-Z])/, "Password Must Contain 1 Capital")
            .matches(/^(?=.*(\W|_))/, "Password Must Contain 1 Symbol")
            .matches(/.*[0-9].*/, "Password Must Contain 1 number"),
        birthdate: Yup.date()
            .required("Pick your birthdate")
    }));
    const handleCreate = async (value) => {
        try {
            await Axios.post("http://localhost:8000/auth", value, {
                headers: { Authorization: `Bearer ${token}` },
                "content-Type": "Multiple/form-data"
            });
            toast({
                title: "New Employee!",
                description: "Your Employee Data uploaded!",
                status: 'success',
                duration: 1500,
                position: "top"
            });
            navigate("/");
        } catch (err) {
            toast({
                title: "Access Denied!",
                description: err.response.data.error.message,
                status: "error",
                duration: 2500,
                position: "top"
            });
        }
    }
    return (
        <>
            <Button onClick={onOpen} my={"auto"} mr={"40px"} bg={"#373433"} color={"white"}>Add Admin</Button> <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose} >
                <ModalOverlay />
                <ModalContent borderRadius={"10px"}>
                    <ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>Create a New Admin Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={{ fullName: "", email: "", phone: "", password: "", birthdate: "" }}
                            validationSchema={Formschema}
                            onSubmit={(value) => {
                                handleCreate(value);
                                console.log(value);
                            }}>
                            {() => {
                                return (
                                    <Form>
                                        <FormControl>
                                            <FormLabel>Fullname</FormLabel>
                                            <Field as={Input} ref={initialRef} variant={"flushed"} placeholder='Ex: John Doe' name="fullName"
                                                focusBorderColor='#373433' borderBottom={"1px solid"} borderColor={"#373433"} />
                                            <ErrorMessage component="Box" name="fullName" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Email</FormLabel>
                                            <Field as={Input} variant={"flushed"} placeholder='Ex: johndoe@gmail.com' name='email' borderBottom={"1px solid"} borderColor={"#373433"} />
                                            <ErrorMessage component="Box" name="email" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <ErrorMessage
                                                component="box"
                                                name="birthdate"
                                                style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Phone</FormLabel>
                                            <Field as={Input} variant={"flushed"} placeholder='Ex: 0872312345726' name='phone' borderBottom={"1px solid"} borderColor={"#373433"} />
                                            <ErrorMessage component="Box" name="phone" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Password</FormLabel>
                                            <Flex>
                                                <Box>
                                                    <Field as={Input} name="password" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Ex: /Johndoe12" size={"md"} type={show ? 'text' : 'password'} variant={"flushed"} color={"black"} borderBottom={"1px solid"} borderColor={"#373433"} />
                                                    <ErrorMessage
                                                        component="box"
                                                        name="password"
                                                        style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                                                </Box>
                                                <Button right={"30px"} variant={"unstyled"} size='sm' onClick={handleClick}>
                                                    {show ? <ViewIcon /> : <ViewOffIcon />}
                                                </Button>
                                            </Flex>
                                        </FormControl>
                                        <Button type='submit' bg='#373433' color={"white"} mt={"10px"} mr={3}>  Add Cashier  </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}