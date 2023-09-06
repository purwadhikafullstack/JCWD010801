import { Flex, Text, Stack, Input, Box } from "@chakra-ui/react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { ButtonTemp } from "../../../components/button";
import { toast } from "react-toastify";
import { HiOutlineMail } from "react-icons/hi";

export const ForgotPasswordField = () => {
    const emailSchema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid e-mail format.")
          .required("Please enter your e-mail."),
    });

    const handleSubmit = async( value ) => {
        try {
            await axios.put( `${process.env.REACT_APP_API_BASE_URL}/user`, value );
            toast.success("Check your email for instructions to reset your password", {
                position: "top-right",
                autoClose: 7000,
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
        <Formik
        initialValues={{ email: '' }}
        validationSchema={ emailSchema }
        onSubmit={( value ) => {
            handleSubmit(value)
        }}
        >
            {( { dirty } ) => {
                return (
                    <Form>
                        <Stack
                        w='100%'
                        justifyContent={'center'}
                        alignItems={'center'}
                        >
                            <Flex justifyContent={"center"}>
                                <Box mt={"10px"} mr={"10px"}>
                                    <HiOutlineMail size={22} />
                                </Box>
                                <Stack alignItems={'center'}>
                                    <Input
                                    as={Field}
                                    w={["200px", "270px"]}
                                    name="email"
                                    borderRadius={"20px"} 
                                    focusBorderColor='#373433'
                                    placeholder="Enter your e-mail here"
                                    />
                                    <ErrorMessage component="box" name="email" style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
                                </Stack>
                            </Flex>
                            <Flex
                                mt={["30px", "35px", "45px"]}
                                fontSize={"12px"}
                                justifyContent={"center"}
                            >
                                <Text>Just remembered? ‎</Text>
                                <Text
                                as={Link}
                                to="/login"
                                color={"gray"}
                                transition="transform 0.3s ease-in-out"
                                _hover={{ transform: "scale(1.1)" }}
                                >
                                Sign in
                                </Text>
                            </Flex>

                            <ButtonTemp 
                            content={(<Text>Send Link</Text>)}
                            isDisabled={!dirty}
                            type="submit"
                            w='100%'
                            />
                        </Stack>
                    </Form>
                )
            }}
        </Formik>
    )
}