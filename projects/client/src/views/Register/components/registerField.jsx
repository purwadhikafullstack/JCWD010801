import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { Box, Button, Input, Text, FormControl } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const RegisterFields = () => {
  const navigate = useNavigate();
  const registerSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number too short")
      .max(12, "Phone number too long")
      .matches(/^\d+$/, "Phone number must contain only digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password too short")
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
      .matches(/^(?=.*(\W|_))/, "Must contain at least one symbol")
      .matches(/.*[0-9].*/, "Password must contain at least one number"),
    confirmPassword: Yup.string()
      .required("Password confirmation is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const handleSubmit = async (data) => {
    try {
      const response = await Axios.post(
        "http://localhost:8000/api/users/register",
        data
      );
      console.log(response);
      navigate("/login");
      
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
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
      initialValues={{
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={registerSchema}
      onSubmit={(values, actions) => {
        handleSubmit(values);
        actions.resetForm();
      }}
    >
      {(props) => (
        <Form>
          <Box >
            <Text mb="4" mt={"4"} color="gray.600" textAlign="center" fontSize="2xl">
              Sign Up
            </Text>
            <Field name="username">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="username"
                    borderRadius="20px"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="firstName">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="firstName"
                    borderRadius="20px"
                    placeholder="First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="lastName">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="lastName"
                    borderRadius="20px"
                    placeholder="Last Name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="email">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="email"
                    borderRadius="20px"
                    type="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="phone">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="phone"
                    borderRadius="20px"
                    type="tel"
                    placeholder="Phone Number"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="password"
                    borderRadius="20px"
                    type="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Field name="confirmPassword">
              {({ field }) => (
                <FormControl mb="3">
                  <Input
                    {...field}
                    id="confirmPassword"
                    borderRadius="20px"
                    type="password"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
              )}
            </Field>
            <Button
              type="submit"
              bgColor={"#373433"}
              size="md"
              mb="3"
              color={"white"}
              isDisabled={!props.dirty || !props.isValid}
              _hover={{ bgColor: "white", color: "#373433" }}
            >
              Sign Up
            </Button>
            <Text>
              Already have an account? <Link to="/login">Log in</Link>
            </Text>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
