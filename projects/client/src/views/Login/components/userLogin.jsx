import Axios from "axios";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { setValue } from "../../../redux/userSlice";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { BsFillPersonFill, BsFillLockFill, BsArrowRight } from 'react-icons/bs';
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useToast } from "@chakra-ui/react"

export const UserLogin = () => {
    const toast = useToast();
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState();
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email addres format")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
    });
    const handleSubmit = async (datalogin) => {
        try {
            const response = await Axios.post("http://localhost:8000/api/user/userlogin", datalogin);
            dispatch(setValue(response.data.user));
            localStorage.setItem("token", response.data.token);
            setSuccess(true);
            navigate("/");
            toast({
                title: "Welcome!",
                description: "Login Success!",
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        } catch (err) {
            toast({
                title: "Access Denied!",
                description: err.response.data.error.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        }
    }
    useEffect(() => {
        // if (token) {
        //     navigate("/");
        // }
    }, []);
    return (
        <>
            <Formik initialValues={{ email: "", password: "" }}
                validationSchema={loginSchema} onSubmit={(value, action) => {
                    handleSubmit(value);
                    if (success) action.resetForm();
                }}>
                {(props) => {
                    return (
                        <Box as={Form}>
                            <Flex justifyContent={"center"}>

                                <Box mt={"10px"} mr={"10px"}>
                                    <BsFillPersonFill size={22} />
                                </Box>
                                <Box>
                                    <Field as={Input} name="email" placeholder="E-mail"
                                        w={["200px", "270px"]} borderRadius={"20px"} />
                                    <br />
                                    <ErrorMessage component="box" name="email" style={{ color: "red", fontSize: "12px" }} />
                                </Box>
                            </Flex>
                            <InputGroup mt={"10px"} justifyContent={"center"}>
                                <Box mt={"10px"} mr={"10px"}>
                                    <BsFillLockFill size={22} />
                                </Box>
                                <Box>
                                    <Field as={Input} name="password" w={["200px", "270px"]} borderRadius={"20px"}
                                        placeholder="Password" type={show ? 'text' : 'password'} />
                                    <br />
                                    <ErrorMessage component="box" name="password"
                                        style={{ color: "red", fontSize: "12px" }} />
                                </Box>
                                <InputRightElement>
                                    <Button right={"25px"} variant={"unstyled"} onClick={handleClick}>
                                        {show ? <FiEye /> : <FiEyeOff />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Flex justifyContent={"space-between"}>
                                <Text as={Link} to="/" mt={"5px"} ml={"80px"} fontSize={"9px"} color={"blue.400"}>Forget Password</Text>
                                <Button isDisabled={!props.dirty} type="submit" mt={"10px"} mr={"35px"}
                                    bg={"#373433"} color={"white"} borderRadius={"20px"}>
                                    <Text fontSize={"13px"}>Sign In ‎ </Text><BsArrowRight />
                                </Button>
                            </Flex>
                        </Box>
                    );
                }}
            </Formik>
        </>
    );
}