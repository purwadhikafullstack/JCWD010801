import * as Yup from "yup";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonTemp } from "../../../components/button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { FormLabel, Input, InputGroup, InputRightElement, Stack, Text, Box, FormControl } from "@chakra-ui/react";

export const ResetPasswordFields = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();
	const { token } = useParams();

	const passwordSchema = Yup.object().shape({
		password: Yup.string()
			.required("Password is required")
			.min(6, "Password too short")
			.matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase character")
			.matches(/^(?=.*(\W|_))/, "Password must contain at least one symbol")
			.matches(/.*[0-9].*/, "Password must contain at least one number"),
		confirmPassword: Yup.string()
			.required("Password confirmation is required")
			.oneOf([Yup.ref("password")], "Passwords must match"),
	});

	const handleSubmit = async (value) => {
		try {
			await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/user/reset`, value, {
				headers: { authorization: `Bearer ${token}` },
			});
			navigate("/login");
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
							<Stack w={"100%"}>
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
							</Stack>

							<ButtonTemp content={<Text>Reset Password</Text>} isDisabled={!dirty} type="submit" w="100%" />
						</Stack>
					</Form>
				);
			}}
		</Formik>
	);
};
