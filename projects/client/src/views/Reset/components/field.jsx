import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { ButtonTemp } from "../../../components/button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Button
} from "@chakra-ui/react";

export const ResetPasswordFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password too short")
      .matches(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase character"
      )
      .matches(/^(?=.*(\W|_))/, "Password must contain at least one symbol")
      .matches(/.*[0-9].*/, "Password must contain at least one number"),
    confirmPassword: Yup.string()
      .required("Password confirmation is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const handleSubmit = async (value) => {
    try {
        console.log(`${process.env.REACT_APP_API_BASE_URL}/user/reset`)
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/reset`,
        value, {
            headers: { authorization: `Bearer ${token}` }
        }
      );
      navigate('/login')
      toast.success("Password Reset Successful", {
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
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={passwordSchema}
      onSubmit={(value) => {
        handleSubmit(value);
      }}
    >
      {({ dirty }) => {
        return (
          <Form>
            <Stack w="100%" gap={5}>
              <Stack w={'100%'}>
                <FormLabel className="password">New Password</FormLabel>
                <InputGroup>
                  <Input
                    as={Field}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    focusBorderColor="gray.300"
                  />
                  <InputRightElement>
                    <Button
                      right={"25px"}
                      variant={"unstyled"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <ErrorMessage component="box" name="password" style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
              </Stack>
              <Stack w={'100%'}>
                <FormLabel className="confirmPassword">Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    as={Field}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    focusBorderColor="gray.300"
                  />
                  <InputRightElement>
                    <Button
                      right={"25px"}
                      variant={"unstyled"}
                      onClick={() => setShowConfirmPassword(!showPassword)}
                    >
                      {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <ErrorMessage component="box" name="confirmPassword" style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }} />
              </Stack>

              <ButtonTemp
                content={<Text>Reset Password</Text>}
                isDisabled={!dirty}
                type="submit"
                w="100%"
              />
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};
