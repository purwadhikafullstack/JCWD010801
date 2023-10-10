import { Input, Flex, Text } from "@chakra-ui/react"
import { ButtonTemp } from "../../../components/button"
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const RedeemCode = () => {
    const token = localStorage.getItem("token");

    const codeSchema = Yup.object().shape({
        code: Yup.string().required()
    });

    const handleSubmit = async(value) => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/voucher/redeem`, value, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            toast.success(`Voucher "${result.data.voucher}" redeemed`, {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    return (
        <Formik
        initialValues={{code: ""}}
        validationSchema={codeSchema}
        onSubmit={(value, action) => {
            handleSubmit(value);
            action.resetForm();
        }}>
            {({ dirty }) => {
                return (
                    <Form>
                    <Flex mb={2} w={'100%'} gap={2}>
                        <Input
                            as={Field}
                            color={"gray.500"}
                            bgColor={"gray.100"}
                            name="code"
                            focusBorderColor="gray.300"
                            placeholder="Promo Code"
                        />
                        <ErrorMessage name="code"/>
                        <ButtonTemp isDisabled={!dirty} type="submit" content={<Text fontWeight={"light"}>Submit</Text>} />
                    </Flex>
                    </Form>
                )
            }}
        </Formik>
    )
}