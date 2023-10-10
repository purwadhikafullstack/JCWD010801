import {
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
	Flex, 
	FormLabel, 
	Image, 
	Input, 
	InputGroup, 
	InputLeftAddon, 
	InputRightAddon, 
	Select,
	Spacer,
	Icon
} from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { ButtonTemp } from "../../../components/button";

export const UpdateDiscount = ({ prevNominal, prevAvailableFrom, prevValidUntil, ProductId, prevType, imgURL, productName, DiscountId, price, setReload }) => {
	const token = localStorage.getItem("token");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ showType, setShowType ] = useState(prevType);
    const typeRef = useRef();

    const fixedAmountSchema = Yup.object().shape({
        nominal: Yup.number().min(1).required("This field is required"),
        availableFrom: Yup.string().required("This field is required"),
        validUntil: Yup.string().required("This field is required")
    });

    const percentageSchema = Yup.object().shape({
        nominal: Yup.number().min(1).max(100).required("This field is required"),
        availableFrom: Yup.string().required("This field is required"),
        validUntil: Yup.string().required("This field is required")
    });

    const extraSchema = Yup.object().shape({
        availableFrom: Yup.string().required("This field is required"),
        validUntil: Yup.string().required("This field is required")
    });

    const handleTypeRef = () => {
        if (typeRef.current.value === "Numeric") setShowType("Numeric")
        else if (typeRef.current.value === "Percentage") setShowType("Percentage")
        else setShowType("Extra")
    }

	const handleSubmit = async (data) => {
		try {
			data.type = typeRef.current.value;
			data.id = DiscountId
			if (showType === "Extra") data.nominal = 1

			await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/discount/update`, data, {
				headers: {
					authorization: `Bearer ${token}`,
				}
			});
			setReload((reload) => !reload);
			onClose();
			toast.success(`New discount applied to product ${productName}`, {
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
			toast.error(`Failed to update discount for product ${productName}`, {
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

	const handleClose = () => {
		setShowType(prevType);
		onClose();
	}

	return (
		<>
			<Button borderRadius={"full"} bgColor={"inherit"} alignItems={'center'} p={0} color={'black'} gap={3} onClick={onOpen}>
				<Icon as={FiEdit} w='5' h='5' />
			</Button>
			<Modal size={{ base: "sm", sm: "md", md: "xl" }} isOpen={isOpen} onClose={handleClose}>
				<ModalOverlay />
				<ModalContent borderRadius={"10px"}>
					<ModalHeader borderTopRadius={"10px"} color={"white"} bg={"#373433"}>
						Update Discount
					</ModalHeader>
					<ModalCloseButton color={"white"} />
					<Formik
					initialValues={{ type: prevType, nominal: prevNominal, availableFrom: prevAvailableFrom, validUntil: prevValidUntil, ProductId }}
					validationSchema={showType === "Extra" ? extraSchema : showType === "Percentage" ? percentageSchema : fixedAmountSchema}
					onSubmit={(value) => {
						handleSubmit(value)
					}}>
						{({ dirty }) => {
							return (
								<Form>
									<ModalBody>
										<Stack gap={10} borderRadius={"10px"} p={6} >
											<Flex bgColor={"gray.100"} p={3} borderRadius={"10px"} gap={2} alignItems={"center"}>
												<Image
													src={`${process.env.REACT_APP_BASE_URL}/products/${imgURL}`}
													alt={productName}
													boxSize="75px"
													objectFit="cover"
													borderRadius={"5px"}
												/>
												<Text fontWeight={"semibold"}>
													{productName}
												</Text>
												<Spacer/>
												<Text fontWeight={"semibold"}>
													{`Rp. ${price?.toLocaleString("id-ID")}`}
												</Text>
											</Flex>
											<Flex justifyContent={"space-between"}>
												<Stack gap={6}>
													<FormLabel htmlFor="type">Discount Type</FormLabel>
													{showType !== "Extra" && (<FormLabel htmlFor="nominal">Nominal</FormLabel>)}
													<FormLabel htmlFor="availableFrom">Available From</FormLabel>
													<FormLabel htmlFor="validUntil">Expiry Date</FormLabel>
												</Stack>
												<Stack gap={4}>
													<Stack>
														<Select name="type" ref={typeRef} onChange={handleTypeRef} defaultValue={prevType}>
															<option value={"Numeric"}>Fixed Amount</option>
															<option value={"Percentage"}>Percentage</option>
															<option value={"Extra"}>Buy 1 Get 1</option>
														</Select>
														<ErrorMessage
															component="box"
															name="type"
															style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
														/>
													</Stack>
													{showType !== "Extra" && (
														<Stack>
															<InputGroup>
																{showType === "Numeric" && (
																	<InputLeftAddon children={"Rp."} />
																)}
																<Input
																	as={Field}
																	type="number"
																	name="nominal"
																	placeholder="Enter voucher nominal"
																	focusBorderColor="gray.300"
																/>
																{showType === "Percentage" ? (
																	<InputRightAddon children={"%"} />
																) : null}
															</InputGroup>
															<ErrorMessage
																component="box"
																name="nominal"
																style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
															/>
														</Stack>
													)}
													<Stack>
														<Input
															as={Field}
															type="datetime-local"
															name="availableFrom"
															focusBorderColor="gray.300"
															defaultValue={prevAvailableFrom}
														/>
														<ErrorMessage
															component="box"
															name="availableFrom"
															style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
														/>
													</Stack>
													<Stack>
														<Input
															as={Field}
															type="datetime-local"
															name="validUntil"
															focusBorderColor="gray.300"
															defaultValue={prevValidUntil}
														/>
														<ErrorMessage
															component="box"
															name="validUntil"
															style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
														/>
													</Stack>
												</Stack>
											</Flex>
										</Stack>
									</ModalBody>
									<ModalFooter gap={3}>
										<Button onClick={handleClose}>Cancel</Button>
										<ButtonTemp isDisabled={ dirty ? false : true } content={"Confirm"} type={"submit"} />
									</ModalFooter>
								</Form>
							);
						}}
					</Formik>
				</ModalContent>
			</Modal>
		</>
	);
};
