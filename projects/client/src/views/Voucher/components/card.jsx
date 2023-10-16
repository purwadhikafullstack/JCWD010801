import { Flex, Icon, Spacer, Stack, Text } from "@chakra-ui/react"
import { ButtonTemp } from "../../../components/button"
import { setVoucherInfo } from "../../../redux/voucherSlice"
import { useDispatch, useSelector } from "react-redux"
import { VoucherDetails } from "./detail"
import { PiTruckThin } from "react-icons/pi"
import { RiMenu3Line } from "react-icons/ri"

export const VoucherCard = ({ name, imgURL, type, isPercentage, nominal, minPay, maxDisc, Product, BranchId, amount, validUntil, availableFrom, VoucherId, Branch }) => {
    const dispatch = useDispatch();
    const applyVoucher = ({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId }) => {
        dispatch(setVoucherInfo({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId }));
    };
    const appliedVoucherCheck = useSelector((state) => state?.voucher?.value?.VoucherId);

    const currentBranch = localStorage.getItem("BranchId");

    return (
        <>
        <Flex gap={3} p={3} boxShadow={"md"} w={"470px"}>
            <Stack 
            bgColor={type === "Single item" ? "blackAlpha.900" : type === "Shipment" ? "yellow.500" : "red.600"} 
            bgImage={type === "Single item" && `${process.env.REACT_APP_BASE_URL}/products/${imgURL}`}
            bgSize={type === "Single item" && 'cover'}
            bgPosition={type === "Single item" && 'center'}
            bgRepeat={type === "Single item" && 'no-repeat'}
            color={"white"} 
            w={"55%"}>
                {type === "Shipment" ? (
                    <Flex py={5} position={"absolute"} overflow={"hidden"}>
                        <Icon as={RiMenu3Line} mr={2} mt={{ base: 24, sm: 12 }} ml={{ base: 3, sm: 1 }} p={0} color={"yellow.600"} w={{ base: 9, sm: 16 }} h={{ base: 9, sm: 16 }} />
                        <Icon as={PiTruckThin} p={0} mt={{ base: 20, sm: 0 }} color={"yellow.600"} w={{ base: 20, sm: 40 }} h={{ base: 20, sm: 40 }} />
                    </Flex>
                ) : null}
                <Stack px={3} zIndex={10} py={1} w={"100%"} h={"100%"} bgColor={type === "Single item" && "blackAlpha.700"}>
                    {isPercentage ? (
                        <Stack fontWeight={"light"} gap={0}>
                            <Text fontSize={{ base: "30px", md: "37px" }}>
                                {`${nominal}% OFF`}
                            </Text>
                            <Text fontSize={"14px"}>
                                Up to {`Rp. ${maxDisc?.toLocaleString("id-ID")}`}
                            </Text>
                        </Stack>
                    ) : (
                        <Text fontSize={{ base: "30px", md: "37px" }} fontWeight={"light"}>
                            {`Rp. ${nominal?.toLocaleString("id-ID")}`}
                        </Text>
                    )}
                    <Text>
                        {name}
                    </Text>
                    <Spacer/>
                    {minPay && (
                        <Text fontWeight={"light"} fontSize={"12px"}>
                            Minimal Transaction {`Rp. ${minPay?.toLocaleString("id-ID")}`}
                        </Text>
                    )}
                </Stack>
            </Stack>
            <Stack w={"45%"} p={3} border={"1px solid lightgray"} gap={0} alignItems={"center"}>
                <Text mb={0} fontWeight={"normal"} fontSize={"14px"}>
                    Valid until:
                </Text>
                <Text textAlign={"center"} mt={0} mb={2} fontWeight={"medium"} fontSize={"16px"}>
                    {new Date(validUntil).toLocaleDateString("us-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }).toUpperCase()}
                </Text>
                <ButtonTemp 
                borderRadius={0} 
                mb={2} 
                onClick={() => applyVoucher({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId })} 
                isDisabled={BranchId === +currentBranch || BranchId === null ? appliedVoucherCheck === VoucherId ? true : false : true}
                content={(appliedVoucherCheck === VoucherId ? <Text fontSize={"16px"}>APPLIED</Text> : <Text fontSize={"16px"}>REDEEM</Text>)} 
                />
                <VoucherDetails
                VoucherId={VoucherId}
                name={name}
                BranchId={BranchId}
                nominal={nominal}
                type={type}
                isPercentage={isPercentage}
                minPay={minPay}
                maxDisc={maxDisc}
                amount={amount}
                Product={Product}
                availableFrom={availableFrom}
                validUntil={validUntil}
                branchName={Branch?.name}
                />
                <Text fontSize={"16px"}>
                    {amount} vouchers
                </Text>
            </Stack>
        </Flex>
        </>
    )
}