import { Flex, Text, Stack, Image, Icon, Input, Button, Link } from "@chakra-ui/react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const ForgotPasswordField = () => {
    const emailSchema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid e-mail format.")
          .required("Please enter your e-mail."),
    });

    const navigate = useNavigate();

    const handleSubmit = async( value ) => {
        try {
            await axios.put( `${REACT_APP_API_BASE_URL}/user`, value );
        } catch (err) {
            console.log(err);
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
                            <Input
                            color={"gray.500"}
                            bgColor={"gray.100"}
                            name="email"
                            as={Field}
                            borderRadius={"20px"} 
                            focusBorderColor='#373433'
                            placeholder="Enter your e-mail here"
                            />
                            <ErrorMessage name="email" style={{ color: "red" }} />
                            <Text fontSize={'sm'}>
                                Just remembered? <Link fontWeight={'semibold'} fontSize={'sm'} onClick={() => navigate('/login')}>Sign in</Link>
                            </Text>

                            <Button isDisabled={!dirty} alignSelf={'flex-end'} type="submit" bgColor={'black'}>
                                <Text fontWeight={"light"} color={"white"}>
                                    Send Link
                                </Text>
                            </Button>
                        </Stack>
                    </Form>
                )
            }}
        </Formik>
    )
}