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
	Select,
	FormControl,
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

const EditGenderField = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const data = useSelector((state) => state.user.value);
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	const validationSchema = Yup.object().shape({
		gender: Yup.string().required("Gender is required"),
	});

	const handleSubmit = async (values) => {
		try {
			const response = await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/user/profile`, values, { headers });
			const updatedUser = { ...data, gender: values.gender };
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
			toast.error(error?.response.data.message, {
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
			initialValues={{ gender: data?.gender }}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<HStack spacing={2} alignItems="center">
					<Text flexBasis="125px" fontWeight="bold">
						Gender
					</Text>
					<Text flex={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
						{data?.gender || "Please choice your gender"}
					</Text>
					<IconButton size="sm" variant="ghost" icon={<EditIcon />} onClick={() => setIsModalOpen(true)} />

					<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Edit Gender</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Form>
									<Field name="gender">
										{({ field }) => (
											<FormControl id="gender">
												<Select {...field} placeholder="Select your gender">
													<option value="Male">Male</option>
													<option value="Female">Female</option>
												</Select>
												<ErrorMessage name="gender" component="div" style={{ color: "red" }} />
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

export default EditGenderField;
