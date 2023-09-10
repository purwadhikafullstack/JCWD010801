import { useState } from "react";
import {
	Avatar,
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Flex,
	Center,
} from "@chakra-ui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { EditIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../../redux/userSlice";
import { ButtonTemp } from "../../../components/button";
const EditAvatar = () => {
	const data = useSelector((state) => state.user.value);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();
	const [file, setFile] = useState(null);
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const validationSchema = Yup.object().shape({
		avatar: Yup.mixed().required("Image is required"),
	});
	const handleSubmit = async (values) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			const response = await Axios.post("http://localhost:8000/api/user/avatar", formData, { headers });
			const updatedUser = { ...data, avatar: response.data.data.avatar };

			dispatch(setValue(updatedUser));
			console.log(response);

			setIsModalOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Formik
			initialValues={{
				avatar: "",
			}}
			validationSchema={validationSchema}
			onSubmit={(value, actions) => {
				handleSubmit(value);
				actions.resetForm();
			}}
		>
			{(props) => {
				return (
					<Flex flexDirection="column" alignItems="center" textAlign="center">
						<Avatar size="2xl" src={`${process.env.REACT_APP_BASE_URL}/avatars/${data?.avatar}`} />
						<Center mt={4}>
							<Button
							border={"1px"}
								bgColor={"white"}
								leftIcon={<EditIcon />}
								onClick={() => setIsModalOpen(true)}
							>
								Edit Profile Image
							</Button>
						</Center>
						<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
							<ModalOverlay />
							<ModalContent>
								<ModalHeader>Edit Profile Image</ModalHeader>
								<ModalCloseButton />
								<ModalBody>
									<Form>
										<Field name="avatar">
											{({ field }) => (
												<FormControl>
													<FormLabel htmlFor="avatar">Select an image</FormLabel>
													<Input
														{...field}
														onChange={(e) => {
															field.onChange(e);
															setFile(e.target.files[0]);
														}}
														type="file"
														id="avatar"
													/>
												</FormControl>
											)}
										</Field>
										<ErrorMessage style={{ color: "red" }} name="avatar" component="div" />
										<ButtonTemp mt={4} type="submit" isDisabled={!props.dirty} content={"Save"} />
									</Form>
								</ModalBody>
							</ModalContent>
						</Modal>
					</Flex>
				);
			}}
		</Formik>
	);
};

export default EditAvatar;
