import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text, useDisclosure, Icon, Heading, DrawerBody, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

export const VoucherDetails = ({ name, description, type, isPercentage, nominal, minPay, maxDisc, ProductId, BranchId, amount, validUntil, availableFrom, VoucherId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [productName, setProductName] = useState("");

    const fetchData = async() => {
        try {
            if (type === "Single item") {
                const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${ProductId}`);
                setProductName(data.productName);
            }

        } catch (err) {
            console.log(err);
        }
    }

    const terms = [
        "This voucher can be redeemed until the date stated on this voucher, or as long as the voucher quota is still available"
    ];

    const setTerms = () => {
        if (isPercentage && maxDisc && minPay) terms.push(`Get a ${nominal}% discount up to Rp. ${maxDisc.toLocaleString("id-ID")} with a minimum transaction of Rp. ${minPay.toLocaleString("id-ID")}`)
        else if (isPercentage && maxDisc) terms.push(`Get a ${nominal}% discount up to Rp. ${maxDisc.toLocaleString("id-ID")}`)
    
        if (ProductId) terms.push(`This voucher is only redeemable if you buy ${productName}`);

    }


    useEffect(() => {
        fetchData()
        setTerms()
    }, [])

    console.log(productName)

    return (
        <>
        <Text cursor={"pointer"} onClick={onOpen} fontWeight={"light"}>
            SEE DETAILS
        </Text>
        <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay>
                <DrawerContent w={"100vw"} h={"100vh"} overflowY={"auto"} p={{base: 1, md: 4}}>
                    <DrawerHeader>
                        <Flex gap={5} mb={5} alignItems={"center"}>
                            <Icon cursor={"pointer"} w={10} h={10} as={RxCross1} onClick={onClose}/>
                            <Heading fontWeight={"semibold"}>
                                {name}
                            </Heading>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack>
                            {terms.map((item, idx) => {
                                return (
                                    <Text key={idx}>
                                        {idx + 1}. {item}
                                    </Text>
                                )
                            })}
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
        </>
    )
}