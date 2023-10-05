import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Flex, FormLabel, Icon, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, Radio, RadioGroup, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ButtonTemp } from "../../../components/button";
import { DiscountSelectProduct } from "../components/DiscountSelectProduct";
import { BsTrash } from "react-icons/bs";

export const CreateVoucher = () => {
    const token = localStorage.getItem("token");
    const [ useProduct, setUseProduct ] = useState(false);
    const [ isPercentage, setIsPercentage ] = useState(false);
    const [ selectedProduct, setSelectedProduct ] = useState([]);
    const useProductRef = useRef();
    const isPercentageRef = useRef();

    const voucherSchema = Yup.object().shape({
        name: Yup.string().required("This field is required"),
        code: Yup.string().required("This field is required"),
        nominal: Yup.number().min(0).required("This field is required"),
        minimumPayment: Yup.number().min(0).required("This field is required"),
        maximumDiscount: Yup.number().min(0).required("This field is required"),
        amountPerRedeem: Yup.number().min(0).required("This field is required"),
        availableFrom: Yup.string().required("This field is required"),
        validUntil: Yup.string().required("This field is required")
    });

    const handleUseProduct = () => {
        if (useProductRef.current.value === "Single item") setUseProduct(true)
        else setUseProduct(false)
    }

    const handleIsPercentage = () => {
        if (isPercentageRef.current.value === "true") setIsPercentage(true)
        else setIsPercentage(false)
    }

    const handleSubmit = async(value) => {
        value.type = useProductRef.current.value;
        if (isPercentageRef.current.value === "true") value.isPercentage = true;
        console.log(selectedProduct.id)
        if (useProductRef.current.value) value.ProductId = selectedProduct.id;
        console.log(value)
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/voucher`, value, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            toast.success("Voucher created", {
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
            toast.error(err.response.data.message, {
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
    }
    useEffect(() => {
        console.log(selectedProduct)
    }, [selectedProduct])

    const handleReset = () => {
        setSelectedProduct({})
        toast.success("Form Cleared", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "dark",
        });
    }

    return (
        <Formik
        initialValues={{ name: "", code: "", type: "", isPercentage: false, nominal: 0, minimumPayment: 0, maximumDiscount: 0, amountPerRedeem: 3, availableFrom: null, validUntil: null, ProductId: null }}
        validationSchema={voucherSchema}
        onSubmit={(value, action) => {
            handleSubmit(value)
            action.resetForm()
        }}>
            {() => {
                return (
                    <Form>
                        <Stack gap={8}>
                            <Stack borderRadius={"10px"}  boxShadow={"xl"} p={6} >
                                <Text fontWeight={"semibold"} fontSize={"2xl"} mb={7}>Voucher Settings</Text>
                                <Flex gap={10}>
                                    <Stack gap={6}>
                                        <FormLabel htmlFor="name">Voucher Name</FormLabel>
                                        <FormLabel htmlFor="code">Promo Code</FormLabel>
                                        <FormLabel htmlFor="type">Voucher Type</FormLabel>
                                        <FormLabel htmlFor="isPercentage">Deduction Type</FormLabel>
                                        <FormLabel htmlFor="nominal">Nominal</FormLabel>
                                        {isPercentage && (
                                        <FormLabel htmlFor="maximumDiscount">Maximum Discount Value</FormLabel>
                                        )}
                                        <FormLabel htmlFor="amountPerRedeem">Amount of Vouchers per Redeem</FormLabel>
                                        <FormLabel htmlFor="minimumPayment">Minimum Transaction</FormLabel>
                                        <FormLabel htmlFor="availableFrom">Available From</FormLabel>
                                        <FormLabel htmlFor="validUntil">Expiry Date</FormLabel>
                                    </Stack>
                                    <Stack gap={4}>
                                        <Stack>
                                            <Input
                                                as={Field}
                                                type="text"
                                                name="name"
                                                placeholder="Enter voucher name"
                                                focusBorderColor="gray.300"
                                            />
                                            <ErrorMessage
                                                component="box"
                                                name="name"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <Input
                                                as={Field}
                                                type="text"
                                                name="code"
                                                placeholder="Enter voucher promo code"
                                                focusBorderColor="gray.300"
                                            />
                                            <ErrorMessage
                                                component="box"
                                                name="code"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        <Stack>
                                            {/* <Field as={RadioGroup} name="type">
                                                <Flex gap={6}>
                                                    <Radio name="type" size={"md"} borderColor={"gray"} onChange={() => setUseProduct(false)} value={"Total purchase"}>Total Purchase</Radio>
                                                    <Radio name="type" size={"md"} borderColor={"gray"} onChange={() => setUseProduct(true)} value={"Single item"}>Single Item</Radio>
                                                    <Radio name="type" size={"md"} borderColor={"gray"} onChange={() => setUseProduct(false)} value={"Shipment"}>Shipment</Radio>
                                                </Flex>
                                            </Field> */}
                                            {/* <Flex gap={6}>
                                                <Field name="type" type="radio" onChange={() => setUseProduct(false)} value={"Total purchase"}>Total Purchase</Field>
                                                <Field name="type" type="radio" onChange={() => setUseProduct(true)} value={"Single item"}>Single Item</Field>
                                                <Field name="type" type="radio" onChange={() => setUseProduct(false)} value={"Shipment"}>Shipment</Field>
                                            </Flex> */}
                                            <Select name="type" ref={useProductRef} onChange={handleUseProduct} defaultValue={"Total purchase"}>
                                                <option value={"Total purchase"}>Total Purchase</option>
                                                <option value={"Single item"}>Single Item</option>
                                                <option value={"Shipment"}>Shipment</option>
                                            </Select>
                                            <ErrorMessage
                                                component="box"
                                                name="type"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        <Stack>
                                            {/* <Field as={RadioGroup} name="isPercentage">
                                                <Flex gap={6}>
                                                    <Radio size={"md"} onChange={() => setIsPercentage(false)} value={false}>Fixed Amount</Radio>
                                                    <Radio size={"md"} onChange={() => setIsPercentage(true)} value={true}>Percentage</Radio>
                                                </Flex>
                                            </Field> */}
                                            {/* <Flex gap={6}>
                                                <Field type="radio" name="isPercentage" onChange={() => setIsPercentage(false)} value={false}>Fixed Amount</Field>
                                                <Field type="radio" name="isPercentage" onChange={() => setIsPercentage(true)} value={true}>Percentage</Field>
                                            </Flex> */}
                                            <Select ref={isPercentageRef} onChange={handleIsPercentage} name="isPercentage" defaultValue={false}>
                                                <option value={false}>Fixed Amount</option>
                                                <option value={true}>Percentage</option>
                                            </Select>
                                            <ErrorMessage
                                                component="box"
                                                name="isPercentage"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <InputGroup>
                                                {isPercentage ? null : (
                                                    <InputLeftAddon children={"Rp."} />
                                                )}
                                                <Input
                                                    as={Field}
                                                    type="number"
                                                    name="nominal"
                                                    placeholder="Enter voucher nominal"
                                                    focusBorderColor="gray.300"
                                                />
                                                {isPercentage ? (
                                                    <InputRightAddon children={"%"} />
                                                ) : null}
                                            </InputGroup>
                                            <ErrorMessage
                                                component="box"
                                                name="nominal"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        {isPercentage && (
                                            <Stack>
                                                <InputGroup>
                                                    <InputLeftAddon children={"Rp."} />
                                                    <Input
                                                        as={Field}
                                                        type="number"
                                                        name="maximumDiscount"
                                                        defaultValue={0}
                                                        placeholder="Enter maximum discount value"
                                                        focusBorderColor="gray.300"
                                                    />
                                                </InputGroup>
                                                <ErrorMessage
                                                    component="box"
                                                    name="maximumDiscount"
                                                    style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                                />
                                            </Stack>
                                        )}
                                        <Stack>
                                            <Input
                                                as={Field}
                                                type="number"
                                                name="amountPerRedeem"
                                                defaultValue={3}
                                                placeholder="Enter the amount of voucher every redeem"
                                                focusBorderColor="gray.300"
                                            />
                                            <ErrorMessage
                                                component="box"
                                                name="amountPerRedeem"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <InputGroup>
                                                <InputLeftAddon children={"Rp."} />
                                                <Input
                                                    as={Field}
                                                    type="number"
                                                    name="minimumPayment"
                                                    defaultValue={0}
                                                    placeholder="Enter minimum transaction"
                                                    focusBorderColor="gray.300"
                                                />
                                            </InputGroup>
                                            <ErrorMessage
                                                component="box"
                                                name="minimumPayment"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
                                        <Stack>
                                            <Input
                                                as={Field}
                                                type="datetime-local"
                                                name="availableFrom"
                                                focusBorderColor="gray.300"
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
                            {useProduct ? (
                                <Stack borderRadius={"10px"} p={6} gap={4}  boxShadow={"xl"}>
                                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                                        <Text fontWeight={"semibold"} fontSize={"2xl"} mb={3}>Apply Voucher to</Text>
                                        <DiscountSelectProduct setSelectedProduct={setSelectedProduct} />
                                    </Flex>
                                    {selectedProduct.productName ? (
                                        <Table>
                                            <Thead>
                                                <Tr>
                                                    <Th textAlign={"left"}>Product</Th>
                                                    <Th textAlign={"left"}>Price</Th>
                                                    <Th textAlign={"left"}>Stock</Th>
                                                    <Th textAlign={"left"}>Statistic</Th>
                                                    <Th textAlign={"end"}></Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                <Tr>
                                                    <Td>
                                                        <Flex gap={2} alignItems={"center"}>
                                                            <Image
                                                                src={`${process.env.REACT_APP_BASE_URL}/products/${selectedProduct?.imgURL}`}
                                                                alt={selectedProduct?.productName}
                                                                boxSize="75px"
                                                                objectFit="cover"
                                                                borderRadius={"5px"}
                                                            />
                                                            <Text>
                                                                {selectedProduct?.productName}
                                                            </Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Text>{`Rp. ${selectedProduct?.price?.toLocaleString("id-ID")}`}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>{selectedProduct?.aggregateStock}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Text>See Report</Text>
                                                    </Td>
                                                    <Td>
                                                        <Button bgColor={"white"} p={0} borderRadius={"full"} onClick={() => setSelectedProduct({})}>
                                                            <Icon as={BsTrash} w={5} h={5} />
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    ) : null}
                                </Stack>
                            ) : null}
                            <Flex borderRadius={"10px"} p={3} gap={3} boxShadow={"xl"} justifyContent={"end"} alignItems={"center"}>
                                <Button border={"1px solid black"} bgColor={"white"} _hover={{ bgColor: "white", color: "red.500", borderColor: "red.500" }} onClick={handleReset} type="reset">Reset</Button>
                                <ButtonTemp type="submit" content={"Create Voucher"} />
                            </Flex>
                        </Stack>
                    </Form>
                )
            }}
        </Formik>
    )
}