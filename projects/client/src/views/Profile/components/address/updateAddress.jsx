import {
	Box,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Select,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";
import Axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ButtonTemp } from "../../../../components/button";
import { EditIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setValueAddress } from "../../../../redux/addressSlice";

const UpdateAddress = ({
	reload,
	setReload,
	id,
	label,
	address,
	city_id,
	city_name,
	province_id,
	province_name,
	postal_code,
	subdistrict,
	province,
	city,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const token = localStorage.getItem("token");
	const dispatch = useDispatch();
	const validationSchema = Yup.object().shape({
		label: Yup.string().required("Label is required"),
		address: Yup.string().required("Address is required"),
		city_id: Yup.string().required("City is required"),
		province_id: Yup.string().required("Province is required"),
		subdistrict: Yup.string().required("Subdistrict is required"),
		postal_code: Yup.string()
			.required("Postal code is required")
			.matches(/^\d{5}$/, "Postal code must be exactly 5 digits"),
	});

	const handleSubmit = async (data) => {
		try {
			const response = await Axios.patch(`${process.env.REACT_APP_API_BASE_URL}/address/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setReload(!reload);
			const updateAddress = response.data.isMainAddress
			dispatch(setValueAddress(updateAddress));
			onClose();
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
			enableReinitialize={true}
			initialValues={{
				label: label,
				address: address,
				city_id: city_id,
				city: city_name,
				province_id: province_id,
				province: province_name,
				postal_code: postal_code,
				subdistrict: subdistrict,
			}}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<Box>
					<IconButton size="md" variant="ghost" icon={<EditIcon />} onClick={onOpen} />
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Update Address</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Form>
									<Field name="label">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="label">Label</FormLabel>
												<Input {...field} type="text" id="label" focusBorderColor="#373433" />
												<ErrorMessage style={{ color: "red" }} name="label" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="address">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="address">Address</FormLabel>
												<Input {...field} type="text" id="address" focusBorderColor="#373433" />
												<ErrorMessage style={{ color: "red" }} name="address" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="province_id">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="province">Province</FormLabel>
												<Select
													{...field}
													id="province"
													placeholder="Select province"
													onChange={(e) => {
														const selectedProvince = province.find((item) => item.province_id === e.target.value);
														props.setFieldValue("province_id", e.target.value);
														props.setFieldValue("province", selectedProvince.province);
													}}
												>
													{province.map((item) => (
														<option key={item.province_id} value={item.province_id}>
															{item.province}
														</option>
													))}
												</Select>
												<ErrorMessage style={{ color: "red" }} name="province_id" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="city_id">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="city">City</FormLabel>
												<Select
													{...field}
													id="city"
													placeholder="Select city"
													onChange={(e) => {
														const selectedCity = city.find((item) => item.city_id === e.target.value);
														props.setFieldValue("city_id", e.target.value);
														props.setFieldValue("city", selectedCity.city_name);
													}}
												>
													{city
														.filter((item) => item.province_id === props.values.province_id)
														.map((item) => (
															<option key={item.city_id} value={item.city_id}>
																{item.type + " " + item.city_name}
															</option>
														))}
												</Select>
												<ErrorMessage style={{ color: "red" }} name="city_id" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="subdistrict">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="subdistrict">Subdistrict</FormLabel>
												<Input {...field} type="text" id="subdistrict" focusBorderColor="#373433" />
												<ErrorMessage style={{ color: "red" }} name="subdistrict" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="postal_code">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="postal_code">Postal Code</FormLabel>
												<Input {...field} type="text" id="postal_code" focusBorderColor="#373433" />
												<ErrorMessage style={{ color: "red" }} name="postal_code" component="div" />
											</FormControl>
										)}
									</Field>
									<ButtonTemp mt={4} type="submit" content={"Save"} />
								</Form>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Box>
			)}
		</Formik>
	);
};

export default UpdateAddress;
