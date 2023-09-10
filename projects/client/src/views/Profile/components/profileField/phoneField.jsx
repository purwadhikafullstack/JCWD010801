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

const EditPhoneField = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const data = useSelector((state) => state.user.value);
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	const validationSchema = Yup.object().shape({
		currentPhone: Yup.string()
			.required("Current Phone is required")
			.min(10, "Phone number too short")
			.max(12, "Phone number too long")
			.matches(/^\d+$/, "Phone number must contain only digits"),
		phone: Yup.string()
			.required("New Phone is required")
			.min(10, "Phone number too short")
			.max(12, "Phone number too long")
			.matches(/^\d+$/, "Phone number must contain only digits"),
	});

	const handleSubmit = async (values) => {
		try {
			const response = await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/user/phone`, values, { headers });
			const updatedUser = { ...data, phone: values.phone };
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
			initialValues={{ currentPhone: data?.phone, phone: "" }}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<HStack spacing={2} alignItems="center">
					<Text flexBasis="125px" fontWeight="bold">
						Phone Number
					</Text>
					<Text flex={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
						{data?.phone}
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
							<ModalHeader>Edit Phone Numbers</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Form>
									<Field name="currentPhone">
										{({ field }) => (
											<FormControl id="currentPhone">
												<FormLabel htmlFor="currentPhone">Current Phone Number</FormLabel>
												<Input {...field} type="tel" />
												<ErrorMessage name="currentPhone" component="div" style={{ color: "red" }} />
											</FormControl>
										)}
									</Field>
									<Field name="phone">
										{({ field }) => (
											<FormControl id="phone">
												<FormLabel htmlFor="phone">New Phone Number</FormLabel>
												<Input {...field} type="tel" placeholder="New Phone number" />
												<ErrorMessage name="phone" component="div" style={{ color: "red" }} />
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

export default EditPhoneField;
