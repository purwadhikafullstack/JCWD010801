import React, { useState } from "react";
import Axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
	Box,
	Button,
	Input,
	Text,
	FormControl,
	InputRightElement,
	InputGroup,
	FormLabel,
	Heading,
	Flex,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RegisterFields = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const referralCode = queryParams.get("r") || "";
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleReferral = (e) => {
		const newSearchParams = new URLSearchParams();
		newSearchParams.set("r", e);
		navigate(`?${newSearchParams.toString()}`);
	}

	const registerSchema = Yup.object().shape({
		username: Yup.string().required("Username is required"),
		firstName: Yup.string().required("First Name is required"),
		lastName: Yup.string().required("Last Name is required"),
		email: Yup.string().email("Invalid email address format").required("Email is required"),
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
			data.referralCode = referralCode
			const response = await Axios.post(
				`${process.env.REACT_APP_API_BASE_URL}/user/`,
				data
			);
			navigate("/login");
			toast.success(response.data.message, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} catch (error) {
			toast.error(error?.response.data.error.message, {
				position: "top-right",
				autoClose: 5000,
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
					<Box>
						<Heading
							w={"200px"}
							mr={["0px", "150px", "150px"]}
							mt={"28px"}
							mb={"15px"}
							fontSize={"38px"}
							fontFamily={"monospace"}
						>
							Sign Up.
						</Heading>
						<Field name="username">
							{({ field }) => (
								<FormControl mb="3">
									<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
										Username
									</FormLabel>
									<Input
										{...field}
										id="username"
										borderRadius="20px"
										focusBorderColor="#373433"
										placeholder="johndoe"
									/>
									<ErrorMessage
										name="username"
										component="div"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginLeft: "8px",
											fontSize: "12px",
										}}
									/>
								</FormControl>
							)}
						</Field>
						<Field name="firstName">
							{({ field }) => (
								<FormControl mb="3">
									<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
										First Name
									</FormLabel>
									<Input
										{...field}
										id="firstName"
										borderRadius="20px"
										focusBorderColor="#373433"
										placeholder="John Doe"
									/>
									<ErrorMessage
										name="firstName"
										component="div"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginLeft: "8px",
											fontSize: "12px",
										}}
									/>
								</FormControl>
							)}
						</Field>
						<Field name="lastName">
							{({ field }) => (
								<FormControl mb="3">
									<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
										Last Name
									</FormLabel>
									<Input
										{...field}
										id="lastName"
										borderRadius="20px"
										focusBorderColor="#373433"
										placeholder="Last Name"
									/>
									<ErrorMessage
										name="lastName"
										component="div"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginLeft: "8px",
											fontSize: "12px",
										}}
									/>
								</FormControl>
							)}
						</Field>
						<Field name="email">
							{({ field }) => (
								<FormControl mb="3">
									<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
										E-mail
									</FormLabel>
									<Input
										{...field}
										id="email"
										borderRadius="20px"
										focusBorderColor="#373433"
										type="email"
										placeholder="Email"
									/>
									<ErrorMessage
										name="email"
										component="div"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginLeft: "8px",
											fontSize: "12px",
										}}
									/>
								</FormControl>
							)}
						</Field>
						<Field name="phone">
							{({ field }) => (
								<FormControl mb="3">
									<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
										Phone Number
									</FormLabel>
									<Input
										{...field}
										id="phone"
										borderRadius="20px"
										focusBorderColor="#373433"
										type="tel"
										placeholder="Phone Number"
									/>
									<ErrorMessage
										name="phone"
										component="div"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginLeft: "8px",
											fontSize: "12px",
										}}
									/>
								</FormControl>
							)}
						</Field>
						<FormControl mb="3">
							<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
								Password
							</FormLabel>
							<InputGroup>
								<Field name="password">
									{({ field }) => (
										<Input
											{...field}
											id="password"
											borderRadius="20px"
											focusBorderColor="#373433"
											type={showPassword ? "text" : "password"}
											placeholder="Password"
											pr="3rem"
										/>
									)}
								</Field>
								<InputRightElement width="3rem">
									<Box
										h="100%"
										display="flex"
										alignItems="center"
										justifyContent="center"
										onClick={() => setShowPassword(!showPassword)}
										cursor="pointer"
									>
										{showPassword ? <FiEye /> : <FiEyeOff />}
									</Box>
								</InputRightElement>
							</InputGroup>
							<ErrorMessage
								name="password"
								component="div"
								style={{
									color: "red",
									marginBottom: "-15px",
									marginLeft: "8px",
									fontSize: "12px",
								}}
							/>
						</FormControl>
						<FormControl mb="3">
							<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
								Confirm Password
							</FormLabel>
							<InputGroup>
								<Field name="confirmPassword">
									{({ field }) => (
										<Input
											{...field}
											id="confirmPassword"
											borderRadius="20px"
											focusBorderColor="#373433"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm Password"
											pr="3rem"
										/>
									)}
								</Field>
								<InputRightElement width="3rem">
									<Box
										h="100%"
										display="flex"
										alignItems="center"
										justifyContent="center"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										cursor="pointer"
									>
										{showConfirmPassword ? <FiEye /> : <FiEyeOff />}
									</Box>
								</InputRightElement>
							</InputGroup>
							<ErrorMessage
								name="confirmPassword"
								component="div"
								style={{
									color: "red",
									marginBottom: "-15px",
									marginLeft: "8px",
									fontSize: "12px",
								}}
							/>
						</FormControl>
						<FormControl mb="3">
							<FormLabel mb={"5px"} c7olor={"gray.00"} fontSize={"12px"} ml={"8px"}>
								Referral Code
							</FormLabel>
							<Input
								onChange={(e) => handleReferral(e.target.value)}
								borderRadius="20px"
								placeholder="Referral Code"
								focusBorderColor="#373433"
								defaultValue={referralCode}
							/>
						</FormControl>
						<Flex justifyContent={"end"}>
							<Flex mt={"20px"} fontSize={"12px"} justifyContent={"center"}>
								<Text>Already have an account? ‎</Text>
								<Text
									as={Link}
									to="/login"
									color={"gray"}
									transition="transform 0.3s ease-in-out"
									_hover={{ transform: "scale(1.1)" }}
								>
									Click Here
								</Text>
							</Flex>
							<Button
								isDisabled={!props.dirty || !props.isValid}
								type="submit"
								mt={"10px"}
								backgroundColor={"#000000"}
								color={"white"}
								ml={"25px"}
								_hover={{
									textColor: "#0A0A0B",
									bg: "#F0F0F0",
									_before: {
										bg: "inherit",
									},
									_after: {
										bg: "inherit",
									},
								}}
								transition="transform 0.3s ease-in-out"
								borderRadius={"20px"}
							>
								Sign Up
							</Button>
						</Flex>
					</Box>
				</Form>
			)}
		</Formik>
	);
};
