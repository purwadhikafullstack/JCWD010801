import { Flex, Icon, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { BsCalendar } from "react-icons/bs"
import { PiTruck, PiShoppingBagOpenBold } from "react-icons/pi"
import { GiConverseShoe } from "react-icons/gi"
import { ButtonTemp } from "../../../components/button"
import { setVoucherInfo, useLater } from "../../../redux/voucherSlice"
import { useDispatch, useSelector } from "react-redux"
import { VoucherDetails } from "./detail"

export const VoucherCard = ({ name, description, type, isPercentage, nominal, minPay, maxDisc, ProductId, BranchId, amount, validUntil, availableFrom, VoucherId }) => {
    const dispatch = useDispatch();
    const applyVoucher = ({ name, type, isPercentage, nominal, minPay, maxDisc, ProductId, amount, validUntil, availableFrom, VoucherId }) => {
        console.log({ name, type, isPercentage, nominal, minPay, maxDisc, ProductId, amount, validUntil, availableFrom, VoucherId })
        dispatch(setVoucherInfo({ name, type, isPercentage, nominal, minPay, maxDisc, ProductId, amount, validUntil, availableFrom, VoucherId }));
    };
    const appliedVoucherCheck = useSelector((state) => state.voucher.value.VoucherId);

    return (
        <>
        <Flex gap={3} p={3} boxShadow={"md"} w={"450px"}>
            <Stack bgColor={type === "Single item" ? "blackAlpha.900" : type === "Shipment" ? "yellow.500" : "red.600"} color={"white"} w={"60%"} px={3} py={1}>
                {isPercentage ? (
                    <Stack fontWeight={"light"} gap={0}>
                        <Text fontSize={"37px"}>
                            {`${nominal}% OFF`}
                        </Text>
                        <Text fontSize={"14px"}>
                            Up to {`Rp. ${maxDisc?.toLocaleString("id-ID")}`}
                        </Text>
                    </Stack>
                ) : (
                    <Text fontSize={"37px"} fontWeight={"light"}>
                        {`Rp. ${nominal?.toLocaleString("id-ID")}`}
                    </Text>
                )}
                <Text>
                    {name}
                </Text>
            </Stack>
            <Stack w={"40%"} p={3} border={"1px solid lightgray"} gap={0} alignItems={"center"}>
                <Text mb={0} fontWeight={"normal"} fontSize={"15px"}>
                    Valid until:
                </Text>
                <Text textAlign={"center"} mt={0} mb={2} fontWeight={"medium"} fontSize={"18px"}>
                    {new Date(validUntil).toLocaleDateString("us-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }).toUpperCase()}
                </Text>
                <ButtonTemp 
                borderRadius={0} 
                mb={2} 
                onClick={() => applyVoucher({ name, type, isPercentage, nominal, minPay, maxDisc, ProductId, amount, validUntil, availableFrom, VoucherId })} 
                isDisabled={appliedVoucherCheck === VoucherId && true} 
                content={(appliedVoucherCheck === VoucherId ? <Text fontSize={"16px"}>APPLIED</Text> : <Text fontSize={"16px"}>REDEEM</Text>)} 
                />
                <VoucherDetails
                name={name}
                />
                <Text fontSize={"16px"}>
                    {amount} vouchers
                </Text>
            </Stack>
        </Flex>
        </>
    )
}