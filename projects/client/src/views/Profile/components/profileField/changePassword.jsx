import { useState } from "react";
import {
	Text,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Box,
	IconButton,
	InputGroup,
	InputRightElement,
} from "@chakra-ui/react";
import Axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ButtonTemp } from "../../../../components/button";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const ChangePassword = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const validationSchema = Yup.object().shape({
		currentPassword: Yup.string()
			.required("Current password is required")
			.min(6, "Password too short")
			.matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
			.matches(/^(?=.*(\W|_))/, "Must contain at least one symbol")
			.matches(/.*[0-9].*/, "Password must contain at least one number"),
		password: Yup.string()
			.required("New password is required")
			.min(6, "Password too short")
			.matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
			.matches(/^(?=.*(\W|_))/, "Must contain at least one symbol")
			.matches(/.*[0-9].*/, "Password must contain at least one number"),
		confirmPassword: Yup.string()
			.required("Password confirmation is required")
			.oneOf([Yup.ref("password")], "Passwords must match"),
	});
	const handleSubmit = async (values) => {
		try {
			const response = await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/user/password`, values, { headers });
			setIsModalOpen(false);
			localStorage.removeItem("token");
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
			navigate("/login");
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
			initialValues={{ currentPassword: "", password: "", confirmPassword: "" }}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<Box>
					<Text w="max-content" color="#4A4A4A" fontWeight="bold" cursor="pointer" onClick={() => setIsModalOpen(true)}>
						Change Password
					</Text>
					<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Change Password</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Form>
									<Field name="currentPassword">
										{({ field }) => (
											<FormControl mt={4}>
												<FormLabel htmlFor="currentPassword">Current Password</FormLabel>
												<InputGroup>
													<Input
														{...field}
														type={showCurrentPassword ? "text" : "password"}
														id="currentPassword"
														focusBorderColor="#373433"
													/>
													<InputRightElement>
														<IconButton
															variant={"ghost"}
															onClick={() => setShowCurrentPassword(!showCurrentPassword)}
															icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
														/>
													</InputRightElement>
												</InputGroup>
												<ErrorMessage name="currentPassword" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
									<Field name="password">
										{({ field }) => (
											<FormControl mt={4}>
												<FormLabel htmlFor="password">New Password</FormLabel>
												<InputGroup>
													<Input
														{...field}
														type={showNewPassword ? "text" : "password"}
														id="password"
														focusBorderColor="#373433"
													/>
													<InputRightElement>
														<IconButton
															variant={"ghost"}
															onClick={() => setShowNewPassword(!showNewPassword)}
															icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
														/>
													</InputRightElement>
												</InputGroup>
												<ErrorMessage name="password" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
									<Field name="confirmPassword">
										{({ field }) => (
											<FormControl mt={4}>
												<FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
												<InputGroup>
													<Input
														{...field}
														type={showConfirmPassword ? "text" : "password"}
														id="confirmPassword"
														focusBorderColor="#373433"
													/>
													<InputRightElement>
														<IconButton
															variant={"ghost"}
															onClick={() => setShowConfirmPassword(!showConfirmPassword)}
															icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
														/>
													</InputRightElement>
												</InputGroup>
												<ErrorMessage name="confirmPassword" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
									<ButtonTemp mt={4} type="submit" isDisabled={!props.dirty} content={"Save"} />
								</Form>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Box>
			)}
		</Formik>
	);
};

export default ChangePassword;
