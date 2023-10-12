import {
	Text,
	Icon,
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
} from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ButtonTemp } from "../button";
import { HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { refreshCategories } from "../../redux/categorySlice";

export const CreateCategory = ({ isText }) => {
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const reduxStore = useSelector((state) => state?.user);
	const RoleId = reduxStore?.value?.RoleId || 1;
	const dispatch = useDispatch();

	const categorySchema = Yup.object().shape({
		category: Yup.string().required("This field must not be empty"),
		image: Yup.mixed()
		.required("This field must not be empty")
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

	const handleSubmit = async (value) => {
		try {
			const { image, category } = value;
			const data = new FormData();
			data.append("category", category);
			data.append("image", image);

			await axios.post(`${process.env.REACT_APP_API_BASE_URL}/category`, data, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				"Content-type": "multipart/form-data",
			});
			dispatch(refreshCategories());
			toast.success("New category added.", {
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
			toast.error("Failed to add new category.", {
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

	return (
		<>
			{RoleId > 1 && (
				<ButtonTemp
					content={!isText ? <Icon as={HiPlus} w="10" h="10" /> : "Add Category"}
					w={!isText ? { base: "40px", md: "none" } : "135px"}
					borderRadius={!isText ? { base: "full", md: "10px" } : "6px"}
					onClick={onOpen}
				/>
			)}
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Add Category
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<Formik
						initialValues={{ category: "", image: null }}
						validationSchema={categorySchema}
						onSubmit={(value) => {
							handleSubmit(value);
							onClose();
						}}
					>
						{({ setFieldValue, values }) => {
							return (
								<Form>
									<ModalBody>
										<Stack gap={4} p={3}>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Category Name</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="category"
														placeholder="Enter the category name here"
														focusBorderColor="gray.300"
													/>
													<ErrorMessage
														component="box"
														name="category"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
													/>
												</Stack>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Category Image</Text>
												<Stack align={"center"}>
													<img
														id="previewImage"
														src={values.image ? URL.createObjectURL(values.image) : ""}
														alt="Loading Preview.."
														style={{
															display: values.image ? "block" : "none",
															width: "250px",
															height: "250px",
															maxWidth: "300px",
															maxHeight: "500px",
														}}
													/>
													<input
														type="file"
														id="image"
														name="image"
														style={{ display: "none" }}
														accept="image/jpg, image/jpeg, image/png"
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
														Select Image
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
