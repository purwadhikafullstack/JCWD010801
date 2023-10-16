import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text, useDisclosure, Icon, Heading, DrawerBody, Stack, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, DrawerFooter } from "@chakra-ui/react"
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsFillCalendar2Fill } from "react-icons/bs";
import { PiMoneyBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { ButtonTemp } from "../../../components/button";
import { setVoucherInfo } from "../../../redux/voucherSlice";

export const VoucherDetails = ({ name, type, isPercentage, nominal, minPay, maxDisc, Product, BranchId, amount, validUntil, availableFrom, VoucherId, branchName }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const dispatch = useDispatch();
    const applyVoucher = async({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId, branchName }) => {
        dispatch(setVoucherInfo({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId }));
        console.log({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId })
        closeModal();
    };
    const voucher = useSelector((state) => state?.voucher?.value);

    const initialTerms = [
        "Voucher cannot be used together with other vouchers",
        "This voucher can be redeemed until the date stated on this voucher, or as long as the voucher quota is still available",
        "Voucher cannot be exchanged with cash under any circumstances"
    ];

    const [terms, setTerms] = useState(initialTerms);
    const currentBranch = localStorage.getItem("BranchId")

    const handleSetTerms = () => {
        if ( BranchId ) setTerms(currentTerms => [...currentTerms, `This voucher is only applicable on Alphamart ${branchName}`]);
        else setTerms(currentTerms => [...currentTerms, `This voucher is applicable on all branches`]);
        if (isPercentage && maxDisc && minPay) setTerms(currentTerms => [...currentTerms, `Get a ${nominal}% discount up to Rp. ${maxDisc.toLocaleString("id-ID")} with a minimum transaction of Rp. ${minPay.toLocaleString("id-ID")}`])
        else if (isPercentage && maxDisc) setTerms(currentTerms => [...currentTerms, `Get a ${nominal}% discount up to Rp. ${maxDisc.toLocaleString("id-ID")}`])
    
        if (Product) setTerms(currentTerms => [...currentTerms, `This voucher is only redeemable if you have ${Product?.productName} on your cart`]);
        
    }

    const closeModal = () => {
        setTerms(initialTerms);
        onClose();
    };

    const removeVoucher = () => {
        dispatch(setVoucherInfo({}))
        closeModal()
    }

    const useOrRemove = () => {
        voucher.VoucherId === VoucherId ? removeVoucher() : applyVoucher({ name, type, isPercentage, nominal, minPay, maxDisc, Product, amount, validUntil, availableFrom, VoucherId })
    };

    const openModal = () => {
        handleSetTerms();
        onOpen();
    }

    return (
        <>
        <Text cursor={"pointer"} onClick={openModal} fontWeight={"light"}>
            SEE DETAILS
        </Text>
        <Drawer placement="bottom" isOpen={isOpen} onClose={closeModal}>
            <DrawerOverlay>
                <DrawerContent w={"100vw"} h={"100vh"} overflowY={"auto"} p={{base: 1, md: 4}}>
                    <DrawerHeader>
                        <Flex gap={5} mb={5} alignItems={"center"}>
                            <Icon cursor={"pointer"} w={10} h={10} as={RxCross1} onClick={closeModal}/>
                            <Heading fontWeight={"semibold"}>
                                {name}
                            </Heading>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack gap={7}>
                            <Flex w={"100%"}  justifyContent={{ base: "space-between", sm: "left" }}>
                                <Stack mr={{ base: 0, sm: 14 }}>
                                    <Flex alignItems={"center"} gap={3}>
                                        <Icon as={BsFillCalendar2Fill} w={5} h={5} />
                                        <Text fontSize={"14px"}>Valid Until</Text>
                                    </Flex>
                                    <Text fontWeight={"medium"}>
                                        {new Date(validUntil).toLocaleDateString("us-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }).toUpperCase()}
                                    </Text>
                                </Stack>
                                <Stack>
                                    <Flex alignItems={"center"} gap={3}>
                                        <Icon as={PiMoneyBold} color={"green.600"} w={5} h={5} />
                                        <Text fontSize={"14px"}>Minimum Transaction</Text>
                                    </Flex>
                                    <Text fontWeight={"medium"}>
                                        {minPay ? `Rp. ${minPay?.toLocaleString("id-ID")}` : "---"}
                                    </Text>
                                </Stack>
                            </Flex>
                            <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton justifyContent={"space-between"}>
                                        <Text fontWeight={"medium"} fontSize={"18px"}>Terms & Conditions</Text>
                                        <AccordionIcon/>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <Stack gap={1}>
                                            {terms.map((item, idx) => {
                                                return (
                                                    <Flex gap={3} key={idx}>
                                                        <Text fontWeight={"semibold"}> {idx + 1}. </Text>
                                                        <Text>{item}</Text>
                                                    </Flex>
                                                )
                                            })}
                                        </Stack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter>
                    <ButtonTemp 
                    borderRadius={"10px"}
                    w={{ base: "100%", sm: "inherit" }}
                    onClick={useOrRemove}
                    isDisabled={BranchId === +currentBranch || BranchId === null ? false : true}
                    // bgColor={voucher.VoucherId === VoucherId ? "white" : "inherit"}
                    // border={voucher.VoucherId === VoucherId ? "1px solid black" : "inherit"}
                    content={(voucher.VoucherId === VoucherId ? <Text fontSize={"16px"}>USE LATER</Text> : <Text fontSize={"16px"}>REDEEM</Text>)} 
                    />
                    </DrawerFooter>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
        </>
    )
}