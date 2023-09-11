import { useState } from "react";
import {
	HStack,
	Text,
	IconButton,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	FormControl,
	Input,
	FormLabel,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../../../redux/userSlice";
import { ButtonTemp } from "../../../../components/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const EditEmailField = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const data = useSelector((state) => state.user.value);
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const navigate = useNavigate();
	const validationSchema = Yup.object().shape({
		currentEmail: Yup.string().email("Invalid email format").required("Current Email is required"),
		email: Yup.string().email("Invalid email format").required("New Email is required"),
	});

	const handleSubmit = async (values) => {
		try {
			const response = await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/user/email`, values, { headers });
			const updatedUser = { ...data, email: values.email };
			localStorage.removeItem("token")
			dispatch(setValue(updatedUser));
			setIsModalOpen(false);
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
			navigate("/login")
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
			initialValues={{ currentEmail: data?.email, email: "" }}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<HStack spacing={2} alignItems="center">
					<Text flexBasis="125px" fontWeight="bold">
						Email
					</Text>
					<Text flex={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
						{data?.email}
					</Text>
					<IconButton
						size="sm"
						variant="ghost"
						icon={<EditIcon />}
						onClick={() => setIsModalOpen(true)}
					/>

					<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Edit Email Address</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Form>
									<Field name="currentEmail">
										{({ field }) => (
											<FormControl id="currentEmail">
												<FormLabel htmlFor="currentEmail">Current Email Address</FormLabel>
												<Input {...field} type="email" />
												<ErrorMessage name="currentEmail" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
									<Field name="email">
										{({ field }) => (
											<FormControl id="email">
												<FormLabel htmlFor="email">New Email Address</FormLabel>
												<Input {...field} type="email" placeholder="New Email address" />
												<ErrorMessage name="email" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
									<ButtonTemp mt={4} type="submit" isDisabled={!props.dirty} content={"Save"} />
								</Form>
							</ModalBody>
						</ModalContent>
					</Modal>
				</HStack>
			)}
		</Formik>
	);
};

export default EditEmailField;
