import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ButtonTemp } from "../button";
import { FiEdit } from "react-icons/fi";

export const EditProduct = ({
	PID,
	productName,
	price,
	description,
	weight,
	image,
	CategoryId,
	categories,
	getCategoryLabel,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

    console.log(categories); // {label: food, value: 1, label: 'drinks', value: 1}
	const categoryList = categories.map((value) => {
		return value.label;
	});

    const currentCategory = categories.map((category, index) => {
        return category.index === CategoryId
    })

    console.log(categoryList);


	const productSchema = Yup.object().shape({
		productName: Yup.string().required("Product name cannot be empty."),
		price: Yup.string().required("Price cannot be empty."),
		description: Yup.string().required("Description cannot be empty."),
		CategoryId: Yup.string().required("Category name cannot be empty."),
		weight: Yup.string().required("Weight cannot be empty."),
		image: Yup.mixed().required("You must assign a product image."),
	});

	const handleSubmit = async (value) => {
		try {
			const { productName, price, description, CategoryId, weight, image } = value;
			const userInput = new FormData();
			userInput.append("productName", productName);
			userInput.append("price", price);
			userInput.append("description", description);
			userInput.append("CategoryId", CategoryId);
			userInput.append("weight", weight);
			userInput.append("image", image);

			await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/product/${PID}`, userInput, {
				"Content-type": "multipart/form-data",
			});

			toast.success(`${productName} successfully editted.`, {
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
			toast.error(`Failed to update ${productName}.`, {
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
			<FiEdit size={28} onClick={onOpen} cursor={"pointer"} />
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Edit Product
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<Formik
						initialValues={{ productName, price, description, CategoryId, weight, image }}
						validationSchema={productSchema}
						onSubmit={(value) => {
							handleSubmit(value);
							onClose();
						}}
					>
						{({ setFieldValue }) => {
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
														placeholder="Enter the updated product name here."
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
														placeholder="Enter the updated price here."
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
														placeholder="Enter the updated description here."
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
												<Text fontWeight={"semibold"}>Category ID</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="category"
														placeholder="Enter the updated category here."
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
												<Text fontWeight={"semibold"}>Weight</Text>
												<Stack>
													<Input
														as={Field}
														type={"text"}
														variant={"filled"}
														name="weight"
														placeholder="Enter the updated weight here."
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
												<Stack>
													<Input
														as={Field}
														type={"file"}
														name="image"
														placeholder="Insert a new product image."
														focusBorderColor="#373433"
														value={undefined}
														onChange={(e) => {
															setFieldValue("image", e.target.files[0]);
														}}
													/>
													<ErrorMessage
														component="box"
														name="image"
														style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
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
