import * as Yup from "yup";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {
	Flex,
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
import { BiUpload } from "react-icons/bi";
import { useEffect } from "react";
import { ButtonTemp } from "../../../../../components/button";

export const UploadProofButton = ({ orderId, date, branch, amount, reload, setReload }) => {
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();

	const paymentProofSchema = Yup.object().shape({
		image: Yup.mixed().required("This field must not be empty"),
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
						{({ setFieldValue }) => {
							return (
								<Form>
									<ModalBody>
										<Stack gap={4} p={3}>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Date</Text>
												<Text>{new Date(date).toLocaleDateString()}</Text>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Branch</Text>
												<Text>{branch}</Text>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Total Amount</Text>
												<Text>{amount}</Text>
											</Stack>
											<Stack gap={1}>
												<Text fontWeight={"semibold"}>Payment proof</Text>
												<Stack>
													<Input
														as={Field}
														type={"file"}
														name="image"
														placeholder="Insert the transaction proof here"
														focusBorderColor="#373433"
														value={undefined}
														accept="image/jpg, image/jpeg, image/png"
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
