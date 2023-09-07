import Axios from "axios";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	Input,
	FormControl,
	FormLabel,
	Flex,
	Box,
	Select,
} from "@chakra-ui/react";

export default function AddAdmin({reload, setReload}) {
	const initialRef = useRef(null);
	const finalRef = useRef(null);
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [branch, setBranch] = useState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleClick = () => setShow(!show);
	const Formschema = Yup.object().shape({
		username: Yup.string().required("Write admin's username"),
		firstName: Yup.string().required("Write admin's first name"),
		lastName: Yup.string().required("Write admin's last name"),
		email: Yup.string().email("Invalid email addres format").required("Write admin's Email"),
		phone: Yup.string().required("Write admin's Phone"),
		password: Yup.string()
			.required("Password is required")
			.min(6, "Password minimum 6 characters long")
			.matches(/^(?=.*[A-Z])/, "Password Must Contain 1 Capital")
			.matches(/^(?=.*(\W|_))/, "Password Must Contain 1 Symbol")
			.matches(/.*[0-9].*/, "Password Must Contain 1 number"),
		BranchId: Yup.string().required("Choose admin's branch"),
	});
	const handleCreate = async (value) => {
		try {
			await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/register`, value, {});
			toast.success("New admin created", {
				position: "top-center",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			navigate("/adminslist");
			setReload(!reload)
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
	const getBranches = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/getbranches`);
			setBranch(response.data);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getBranches();
	}, []);
	return (
		<>
			<Button
				onClick={onOpen}
				my={"auto"}
				mr={"40px"}
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
			>
				Add Admin
			</Button>
			<Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Create a New Admin Account
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Formik
							initialValues={{
								username: "",
								firstName: "",
								lastName: "",
								email: "",
								phone: "",
								password: "",
								BranchId: "",
							}}
							validationSchema={Formschema}
							onSubmit={(value, action) => {
								handleCreate(value);
								action.resetForm();
							}}
						>
							{(props) => {
								return (
									<Form>
										<FormControl>
											<FormLabel>Username</FormLabel>
											<Field
												as={Input}
												ref={initialRef}
												variant={"flushed"}
												placeholder="Ex: johndoe"
												name="username"
												focusBorderColor="#373433"
												borderBottom={"1px solid"}
												borderColor={"#373433"}
											/>
											<ErrorMessage
												component="Box"
												name="username"
												style={{
													color: "red",
													marginBottom: "-20px",
													marginLeft: "3px",
													marginTop: "-9px",
												}}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>First Name</FormLabel>
											<Field
												as={Input}
												ref={initialRef}
												variant={"flushed"}
												placeholder="Ex: John"
												name="firstName"
												focusBorderColor="#373433"
												borderBottom={"1px solid"}
												borderColor={"#373433"}
											/>
											<ErrorMessage
												component="Box"
												name="firstName"
												style={{
													color: "red",
													marginBottom: "-20px",
													marginLeft: "3px",
													marginTop: "-9px",
												}}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Last Name</FormLabel>
											<Field
												as={Input}
												ref={initialRef}
												variant={"flushed"}
												placeholder="Ex: Doe"
												name="lastName"
												focusBorderColor="#373433"
												borderBottom={"1px solid"}
												borderColor={"#373433"}
											/>
											<ErrorMessage
												component="Box"
												name="lastName"
												style={{
													color: "red",
													marginBottom: "-20px",
													marginLeft: "3px",
													marginTop: "-9px",
												}}
											/>
										</FormControl>
										<FormControl mt={4}>
											<FormLabel>Email</FormLabel>
											<Field
												as={Input}
												variant={"flushed"}
												placeholder="Ex: johndoe@gmail.com"
												name="email"
												borderBottom={"1px solid"}
												borderColor={"#373433"}
											/>
											<ErrorMessage
												component="Box"
												name="email"
												style={{
													color: "red",
													marginBottom: "-20px",
													marginLeft: "3px",
													marginTop: "-9px",
												}}
											/>
										</FormControl>
										<FormControl mt={4}>
											<FormLabel>Phone</FormLabel>
											<Field
												as={Input}
												variant={"flushed"}
												placeholder="Ex: 0872312345726"
												name="phone"
												borderBottom={"1px solid"}
												borderColor={"#373433"}
											/>
											<ErrorMessage
												component="Box"
												name="phone"
												style={{
													color: "red",
													marginBottom: "-20px",
													marginLeft: "3px",
													marginTop: "-9px",
												}}
											/>
										</FormControl>
										<FormControl mt={4}>
											<FormLabel>Password</FormLabel>
											<Flex>
												<Box>
													<Field
														as={Input}
														name="password"
														w={{ base: "180px", md: "400px", lg: "400px" }}
														placeholder="Ex: /Johndoe12"
														size={"md"}
														type={show ? "text" : "password"}
														variant={"flushed"}
														color={"black"}
														borderBottom={"1px solid"}
														borderColor={"#373433"}
													/>
													<ErrorMessage
														component="box"
														name="password"
														style={{
															color: "red",
															marginBottom: "-18px",
															marginTop: "-8px",
														}}
													/>
												</Box>
												<Button right={"30px"} variant={"unstyled"} size="sm" onClick={handleClick}>
													{show ? <ViewIcon /> : <ViewOffIcon />}
												</Button>
											</Flex>
										</FormControl>
										<FormControl mt={4}>
											<FormLabel>Branch</FormLabel>
											<Field
												as={Select}
												variant={"flushed"}
												placeholder="Choose Admin's branches"
												name="BranchId"
												borderBottom={"1px solid"}
												borderColor={"#373433"}
											>
												{branch?.map((item, index) => {
													return (
														<option key={index} value={item.id}>
															{item.name}
														</option>
													);
												})}
											</Field>
											<ErrorMessage
												component="Box"
												name="BranchId"
												style={{
													color: "red",
													marginBottom: "-20px",
													marginLeft: "3px",
													marginTop: "-9px",
												}}
											/>
										</FormControl>
										<Button
											type="submit"
											backgroundColor={"#000000"}
											color={"white"}
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
											mt={"10px"}
											mr={3}
										isDisabled={!props.dirty}
										>
											Add Admin
										</Button>
										<Button mt={"10px"} onClick={onClose}>
											Cancel
										</Button>
									</Form>
								);
							}}
						</Formik>
					</ModalBody>
					<ModalFooter></ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
