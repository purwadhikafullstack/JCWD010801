import { useEffect, useState } from "react";
import {
	Box,
	Button,
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
	useDisclosure,
} from "@chakra-ui/react";
import Axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ButtonTemp } from "../../../../components/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAddress = ({ reload, setReload }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [city, setCity] = useState([]);
	const [province, setProvince] = useState([]);
	const token = localStorage.getItem("token");
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

	const getCity = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/city`);
			setCity(response.data.data.rajaongkir.results);
		} catch (error) {
			toast.error("Key Raja Ongkir is expired", {
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

	const getProvince = async () => {
		try {
			const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/address/province`);
			setProvince(response.data.data.rajaongkir.results);
		} catch (error) {
			toast.error("Key Raja Ongkir is expired", {
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

	const handleSubmit = async (data) => {
		try {
			const response = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/address/`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setReload(!reload);
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
	useEffect(() => {
		getCity();
		getProvince();
	}, []);
	return (
		<Formik
			initialValues={{ label: "", address: "", city_id: "", city: "", province_id: "", province: "" }}
			validationSchema={validationSchema}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				actions.resetForm();
			}}
		>
			{(props) => (
				<Box mb={4}>
					<Button
						bgColor={"#000000"}
						color={"white"}
						_hover={{
							color: "#0A0A0B",
							bg: "#F0F0F0",
							_before: { bg: "inherit" },
							_after: { bg: "inherit" },
						}}
						onClick={onOpen}
					>
						New Address
					</Button>
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>New Address</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Form>
									<Field name="label">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="label">Label</FormLabel>
												<Input {...field} type="text" id="label" />
												<ErrorMessage style={{ color: "red" }} name="label" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="address">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="address">Address</FormLabel>
												<Input {...field} type="text" id="address" />
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
														props.setFieldValue("type", selectedCity.type);
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
												<Input {...field} type="text" id="subdistrict" />
												<ErrorMessage style={{ color: "red" }} name="subdistrict" component="div" />
											</FormControl>
										)}
									</Field>
									<Field name="postal_code">
										{({ field }) => (
											<FormControl>
												<FormLabel htmlFor="postal_code">Postal Code</FormLabel>
												<Input {...field} type="text" id="postal_code" />
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

export default AddAddress;
