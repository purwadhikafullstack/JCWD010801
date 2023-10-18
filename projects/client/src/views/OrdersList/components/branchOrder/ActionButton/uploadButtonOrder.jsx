import axios from "axios";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import {
	Flex,
	Text,
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
import { Formik, Form, ErrorMessage } from "formik";
import { BiUpload } from "react-icons/bi";
import { useEffect } from "react";
import { ButtonTemp } from "../../../../../components/button";

export const UploadProofButton = ({ orderId, date, branch, amount, reload, setReload }) => {
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();

	const paymentProofSchema = Yup.object().shape({
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
			const { image } = value;
			const data = new FormData();
			data.append("image", image);

			await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/order/proof/${orderId}`, data, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				"Content-type": "multipart/form-data",
			});

			toast.success("Payment proof uploaded", {
				position: "top-right",
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			setReload(!reload);
			onClose();
		} catch (err) {
			toast.error("Failed to upload payment proof. Please try again later.", {
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

	useEffect(() => {
		setReload(true);
		// eslint-disable-next-line
	}, [reload]);

	return (
		<>
			<Button size={["sm", "md"]} my={"auto"} mr={"10px"} onClick={onOpen} colorScheme="yellow" color={"red.600"}>
				<Flex mr={"5px"}>
					<BiUpload />
				</Flex>
				Upload Payment
			</Button>
			<Modal size={{ base: "xs", sm: "sm", md: "md" }} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"black"}>
						Upload Payment Proof Order
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<Formik
						initialValues={{ image: null }}
						validationSchema={paymentProofSchema}
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
												<Text fontWeight={"semibold"}>Date</Text>
												<Text>
													{new Date(date).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</Text>
											</Stack>
											<Flex>
												<Stack mr={40} gap={1}>
													<Text fontWeight={"semibold"}>Branch</Text>
													<Text>{branch}</Text>
												</Stack>
												<Stack gap={1}>
													<Text fontWeight={"semibold"}>Total Amount</Text>
													<Text>{`Rp. ${amount?.toLocaleString("id-ID")}`}</Text>
												</Stack>
											</Flex>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Payment proof</Text>
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
