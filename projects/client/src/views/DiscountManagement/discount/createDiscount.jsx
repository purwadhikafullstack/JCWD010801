import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Flex, FormLabel, Icon, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, Radio, RadioGroup, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ButtonTemp } from "../../../components/button";
import { DiscountSelectProduct } from "../components/DiscountSelectProduct";
import { BsTrash } from "react-icons/bs";

export const CreateDiscount = () => {
    const token = localStorage.getItem("token");
    const [ showType, setShowType ] = useState("Numeric");
    const [ selectedProduct, setSelectedProduct ] = useState([]);
    const typeRef = useRef();

    const discountSchema = Yup.object().shape({
        nominal: Yup.number().min(1).required("This field is required"),
        availableFrom: Yup.string().required("This field is required"),
        validUntil: Yup.string().required("This field is required")
    });

    const handleTypeRef = () => {
        if (typeRef.current.value === "Numeric") setShowType("Numeric")
        else if (typeRef.current.value === "Percentage") setShowType("Percentage")
        else setShowType("Extra")
    }

    const handleSubmit = async(value) => {
        value.type = typeRef.current.value;
        value.PIDs = selectedProduct
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/discount`, value, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            toast.success("New Discount Applied", {
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
    const handleRemoveItem = (ProductId) => {
        setSelectedProduct(selectedProduct.filter((item) => item.id !== ProductId));
    }

    const handleReset = () => {
        setSelectedProduct([])
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
        initialValues={{ type: "", nominal: 0, availableFrom: "", validUntil: "", PIDs: [] }}
        validationSchema={discountSchema}
        onSubmit={(value) => {
            handleSubmit(value)
        }}>
            {() => {
                return (
                    <Form>
                        <Stack gap={8}>
                            <Stack borderRadius={"10px"}  boxShadow={"xl"} p={6} >
                                <Text fontWeight={"semibold"} fontSize={"2xl"} mb={7}>Discount Information</Text>
                                <Flex gap={10}>
                                    <Stack gap={6}>
                                        <FormLabel htmlFor="type">Discount Type</FormLabel>
                                        <FormLabel htmlFor="nominal">Nominal</FormLabel>
                                        <FormLabel htmlFor="availableFrom">Available From</FormLabel>
                                        <FormLabel htmlFor="validUntil">Expiry Date</FormLabel>
                                    </Stack>
                                    <Stack gap={4}>
                                        <Stack>
                                            {/* <Field as={RadioGroup} name="type">
                                                <Flex gap={6}>
                                                    <Radio name="type" size={"md"} borderColor={"gray"} onChange={() => setShowType(false)} value={"Total purchase"}>Total Purchase</Radio>
                                                    <Radio name="type" size={"md"} borderColor={"gray"} onChange={() => setShowType(true)} value={"Single item"}>Single Item</Radio>
                                                    <Radio name="type" size={"md"} borderColor={"gray"} onChange={() => setShowType(false)} value={"Shipment"}>Shipment</Radio>
                                                </Flex>
                                            </Field> */}
                                            {/* <Flex gap={6}>
                                                <Field name="type" type="radio" onChange={() => setShowType(false)} value={"Total purchase"}>Total Purchase</Field>
                                                <Field name="type" type="radio" onChange={() => setShowType(true)} value={"Single item"}>Single Item</Field>
                                                <Field name="type" type="radio" onChange={() => setShowType(false)} value={"Shipment"}>Shipment</Field>
                                            </Flex> */}
                                            <Select name="type" ref={typeRef} onChange={handleTypeRef} defaultValue={"Numeric"}>
                                                <option value={"Numeric"}>Fixed Amount</option>
                                                <option value={"Percentage"}>Percentage</option>
                                                <option value={"Extra"}>Buy 1 Get Extra</option>
                                            </Select>
                                            <ErrorMessage
                                                component="box"
                                                name="type"
                                                style={{ color: "red", marginBottom: "-15px", marginTop: "-8px", fontSize: "10px" }}
                                            />
                                        </Stack>
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
                                                ) : showType === "Extra" ? (
                                                    <InputRightAddon children={"Items"} />
                                                ) : null}
                                            </InputGroup>
                                            <ErrorMessage
                                                component="box"
                                                name="nominal"
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
                            <Stack borderRadius={"10px"} p={6} gap={4}  boxShadow={"xl"}>
                                <Flex alignItems={"center"} justifyContent={"space-between"}>
                                    <Text fontWeight={"semibold"} fontSize={"2xl"} mb={3}>Apply Discount to</Text>
                                    <DiscountSelectProduct selectedProduct={selectedProduct} isVoucher={false} setSelectedProduct={setSelectedProduct} />
                                </Flex>
                                {selectedProduct?.length > 0 ? (
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
                                            {selectedProduct.map((item, idx) => {
                                                return (
                                                    <Tr key={idx}>
                                                        <Td>
                                                            <Flex gap={2} alignItems={"center"}>
                                                                <Image
                                                                    src={`${process.env.REACT_APP_BASE_URL}/products/${item?.imgURL}`}
                                                                    alt={item?.productName}
                                                                    boxSize="75px"
                                                                    objectFit="cover"
                                                                    borderRadius={"5px"}
                                                                />
                                                                <Text>
                                                                    {item?.productName}
                                                                </Text>
                                                            </Flex>
                                                        </Td>
                                                        <Td>
                                                            <Text>{`Rp. ${item?.price?.toLocaleString("id-ID")}`}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text>{item?.aggregateStock}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text>See Report</Text>
                                                        </Td>
                                                        <Td>
                                                            <Button bgColor={"white"} p={0} borderRadius={"full"} onClick={() => handleRemoveItem(item?.id)}>
                                                                <Icon as={BsTrash} w={5} h={5} />
                                                            </Button>
                                                        </Td>
                                                    </Tr>
                                                )
                                            })}
                                        </Tbody>
                                    </Table>
                                ) : null}
                            </Stack>
                            <Flex borderRadius={"10px"} p={3} gap={3} boxShadow={"xl"} justifyContent={"end"} alignItems={"center"}>
                                <Button border={"1px solid black"} bgColor={"white"} _hover={{ bgColor: "white", color: "red.500", borderColor: "red.500" }} onClick={handleReset} type="reset">Reset</Button>
                                <ButtonTemp isDisabled={selectedProduct.length > 0 ? false : true} type="submit" content={"Create Discount"} />
                            </Flex>
                        </Stack>
                    </Form>
                )
            }}
        </Formik>
    )
}