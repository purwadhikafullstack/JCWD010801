import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import styled from "@emotion/styled";
import * as Yup from "yup";
import {
	Text,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
	Button,
	Select,
	Image,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { ButtonTemp } from "../button";

export const AddProduct = ({ categories, reload, setReload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const productSchema = Yup.object().shape({
		productName: Yup.string().required("Product name cannot be empty."),
		price: Yup.string().required("Price cannot be empty."),
		description: Yup.string().required("Description cannot be empty."),
		CategoryId: Yup.string().required("Category name cannot be empty."),
		weight: Yup.string().required("Weight cannot be empty."),
		image: Yup.mixed()
			.test("fileSize", "Image size is too large (max 1MB)", (value) => {
				if (!value) return true;
				return value.size <= 1024 * 1024;
			})
			.test("fileType", "Only JPG, JPEG, PNG, WEBP, and GIF image types are supported.", (value) => {
				if (!value) return true;
				const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
				return acceptedTypes.includes(value.type);
			}),
	});

	const handleSubmit = async (values) => {
		try {
			const { productName, price, description, CategoryId, weight, image: newImage } = values;

			const userInput = new FormData();
			userInput.append("productName", productName);
			userInput.append("price", price);
			userInput.append("description", description);
			userInput.append("CategoryId", CategoryId);
			userInput.append("weight", weight);
			userInput.append("image", newImage);

			const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/`, userInput, {
				"Content-type": "multipart/form-data",
			});

			setReload(!reload);
			toast.success(`${response.data.message}`, {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} catch (error) {
			toast.error(`${error.response.data.message}`, {
				position: "top-right",
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

	const EditButton = styled(FiEdit)`
		font-size: 28px;
		cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
		color: ${(props) => (props.isDisabled ? "#800808" : "black")};
		&:hover {
			color: ${(props) => (props.isDisabled ? "red" : "#006100")};
		}
	`;

	const handleClick = () => {
		onOpen();
	};

	return (
		<>
			<ButtonTemp content={"Add Product"} onClick={handleClick} />
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Add New Product
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<Formik
						initialValues={{}}
						validationSchema={productSchema}
						onSubmit={(value) => {
							handleSubmit(value);
							onClose();
						}}
					>
						{({ setFieldValue, handleChange, handleBlur, values }) => {
							return (
								<Form>
									<ModalBody>
										<Stack gap={4} p={3}>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Product Name</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="productName"
														placeholder="Enter a product name here."
														focusBorderColor="gray.300"
													/>
													<ErrorMessage
														component="box"
														name="productName"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
													/>
												</Stack>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Price</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="price"
														placeholder="Specify the product's price."
														focusBorderColor="gray.300"
													/>
													<ErrorMessage
														component="box"
														name="price"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
													/>
												</Stack>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Description</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="description"
														placeholder="Give a brief overview of the product."
														focusBorderColor="gray.300"
													/>
													<ErrorMessage
														component="box"
														name="description"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
													/>
												</Stack>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Category</Text>
												<Select
													variant="filled"
													name="CategoryId"
													placeholder="Select a Category"
													focusBorderColor="gray.300"
													value={values.CategoryId}
													onChange={handleChange}
													onBlur={handleBlur}
												>
													{categories.map((category) => (
														<option key={category.value} value={category.value}>
															{category.label}
														</option>
													))}
												</Select>
												<ErrorMessage
													component="div"
													name="CategoryId"
													style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
												/>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Weight</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="weight"
														placeholder="Specify the product's weight."
														focusBorderColor="gray.300"
													/>
													<ErrorMessage
														component="box"
														name="weight"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
													/>
												</Stack>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Product Image</Text>
												<Stack align={"center"}>
													<img
														id="previewImage"
														src={values.image ? URL.createObjectURL(values.image) : ""}
														alt="Loading Preview.."
														style={{
															display: values.image ? "block" : "none",
															width: "250px",
															height: "250px",
															maxWidth: "250px",
															maxHeight: "250px",
														}}
													/>
													<input
														type="file"
														id="image"
														name="image"
														style={{ display: "none" }}
														onChange={(e) => {
															const file = e.target.files[0];
															setFieldValue("image", file);
															const previewImage = document.getElementById("previewImage");
															if (previewImage && file) {
																previewImage.style.display = "block";
																const reader = new FileReader();
																reader.onload = (e) => {
																	previewImage.src = e.target.result;
																};
																reader.readAsDataURL(file);
															}
														}}
													/>
													<Button
														onClick={() => {
															document.getElementById("image").click();
														}}
													>
														Add Image
													</Button>
													<ErrorMessage
														component="box"
														name="image"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "12px" }}
													/>
												</Stack>
											</Stack>
										</Stack>
										<ModalFooter gap={3}>
											<Button onClick={onClose}>Cancel</Button>
											<ButtonTemp content={"Confirm"} type={"submit"} />
										</ModalFooter>
									</ModalBody>
								</Form>
							);
						}}
					</Formik>
				</ModalContent>
			</Modal>
		</>
	);
};
