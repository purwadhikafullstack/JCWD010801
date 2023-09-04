import Axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { setValue } from "../../../redux/userSlice";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { BsFillPersonFill, BsFillLockFill } from 'react-icons/bs';
import { Box, Button, Flex, Heading, Input, InputGroup, InputRightElement, Text, VStack } from "@chakra-ui/react"
import { toast } from "react-toastify";

export const UserLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState();
    const loginSchema = Yup.object().shape({
        data: Yup.string()
            .required("Email or Username is required"),
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
            toast.success("Welcome", {
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
            toast.error(err.response.data.error.message, {
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
    }
    return (
        <>
            <Formik initialValues={{ data: "", password: "" }}
                validationSchema={loginSchema} onSubmit={(value, action) => {
                    handleSubmit(value);
                    if (success) action.resetForm();
                }}>
                {(props) => {
                    return (
                        <Box as={Form} mt={["0px", "0px", "100px"]}>
                            <Heading w={"200px"} mr={["0px", "150px", "150px"]} mb={"20px"}
                                fontSize={"30px"} fontFamily={"monospace"}>Shop Now.</Heading>
                            <Flex justifyContent={"center"}>
                                <Box mt={"10px"} mr={"10px"}>
                                    <BsFillPersonFill size={22} />
                                </Box>
                                <VStack>
                                    <Field as={Input} name="data" placeholder="E-mail or Username"
                                        w={["200px", "270px"]} borderRadius={"20px"} focusBorderColor='#373433' />
                                    <ErrorMessage component="box" name="data"
                                        style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
                                </VStack>
                            </Flex>
                            <InputGroup mt={"15px"} justifyContent={"center"}>
                                <Box mt={"10px"} mr={"10px"}>
                                    <BsFillLockFill size={22} />
                                </Box>
                                <VStack>
                                    <Field as={Input} name="password" w={["200px", "270px"]} borderRadius={"20px"}
                                        focusBorderColor='#373433' placeholder="Password" type={show ? 'text' : 'password'} />
                                    <ErrorMessage component="box" name="password"
                                        style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
                                </VStack>
                                <InputRightElement>
                                    <Button right={"25px"} variant={"unstyled"} onClick={handleClick}>
                                        {show ? <FiEye /> : <FiEyeOff />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Flex justifyContent={"space-between"}>
                                <Text as={Link} to="/" mt={"5px"} ml={["0px", "25px", "80px"]} fontSize={"9px"} color={"blue.400"}
                                    _hover={{ color: "blue.200" }} >Forget Password</Text>
                                <Button isDisabled={!props.dirty} type="submit" mt={"10px"} mr={["0px", "25px", "35px"]}
                                    bg={"#373433"} color={"white"} borderRadius={"20px"}>
                                    <Text fontSize={"13px"}>Sign In ‎ </Text>
                                </Button>
                            </Flex>
                        </Box>
                    );
                }}
            </Formik>
        </>
    );
};