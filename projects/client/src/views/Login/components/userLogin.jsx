import Axios from "axios";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BsFillPersonFill, BsFillLockFill } from "react-icons/bs";
import { Box, Button, Flex, Heading, Input, InputGroup, InputRightElement, Text, VStack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setValue } from "../../../redux/userSlice";
import { setValueAddress } from "../../../redux/addressSlice";

export const UserLogin = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleClick = () => setShow(!show);
	const [show, setShow] = useState(false);
	const loginSchema = Yup.object().shape({
		data: Yup.string().required("Email or Username is required"),
		password: Yup.string().required("Password is required"),
	});
	const handleSubmit = async (dataLogin) => {
		try {
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/login`, dataLogin);
			localStorage.setItem("token", response.data.token);
			const token = localStorage.getItem("token");
			const data = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			dispatch(setValue(response.data.checkLogin));
			dispatch(setValueAddress(data.data.result[0]))
			navigate("/");
			toast.success(`Welcome ${response.data.checkLogin.username}`, {
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
		<>
			<Formik
				initialValues={{ data: "", password: "" }}
				validationSchema={loginSchema}
				onSubmit={(value, action) => {
					handleSubmit(value);
				}}
			>
				{(props) => {
					return (
						<Box as={Form} mt={["0px", "0px", "100px"]}>
							<Heading
								w={"200px"}
								mr={["0px", "150px", "150px"]}
								mb={"20px"}
								fontSize={"30px"}
								fontFamily={"monospace"}
							>
								Shop Now.
							</Heading>
							<Flex justifyContent={"center"}>
								<Box mt={"10px"} mr={"10px"}>
									<BsFillPersonFill size={22} />
								</Box>
								<VStack>
									<Field
										as={Input}
										name="data"
										placeholder="E-mail or Username"
										w={["200px", "270px"]}
										borderRadius={"20px"}
										focusBorderColor="#373433"
									/>
									<ErrorMessage
										component="box"
										name="data"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginTop: "-8px",
											fontSize: "10px",
										}}
									/>
								</VStack>
							</Flex>
							<InputGroup mt={"15px"} justifyContent={"center"}>
								<Box mt={"10px"} mr={"10px"}>
									<BsFillLockFill size={22} />
								</Box>
								<VStack>
									<Field
										as={Input}
										name="password"
										w={["200px", "270px"]}
										borderRadius={"20px"}
										focusBorderColor="#373433"
										placeholder="Password"
										type={show ? "text" : "password"}
									/>
									<ErrorMessage
										component="box"
										name="password"
										style={{
											color: "red",
											marginBottom: "-15px",
											marginTop: "-8px",
											fontSize: "10px",
										}}
									/>
								</VStack>
								<InputRightElement>
									<Button right={"25px"} variant={"unstyled"} onClick={handleClick}>
										{show ? <FiEye /> : <FiEyeOff />}
									</Button>
								</InputRightElement>
							</InputGroup>
							<Flex justifyContent={"space-between"}>
								<Text
									as={Link}
									to="/forgot-password"
									mt={"5px"}
									ml={["0px", "25px", "80px"]}
									fontSize={"9px"}
									color={"blue.400"}
									_hover={{ color: "blue.200" }}
								>
									Forget Password
								</Text>
								<Button
									isDisabled={!props.dirty}
									type="submit"
									mt={"10px"}
									mr={["0px", "25px", "35px"]}
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
