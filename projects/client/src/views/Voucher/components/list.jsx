import axios from "axios";
import { Flex, Stack, Tab, TabList, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { VoucherCard } from "./card";
import { useSelector } from "react-redux";
import { GiOpenTreasureChest } from "react-icons/gi";

export const VoucherList = () => {
    const token = localStorage.getItem("token");
    const [ vouchers, setVouchers ] = useState([]);
    const reload = useSelector((state) => state?.voucher?.value)
    const fetchData = async(type) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/voucher/user?type=${type}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setVouchers(data.result);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchData("")
        // eslint-disable-next-line
    }, [reload]);

    return (
        <Tabs draggable={true} defaultIndex={0} variant={{ base: "solid-rounded", md: "soft-rounded" }} size={{ base: "sm", md: "md" }}>
            <TabList  
            mb={5} 
            overflowY={"hidden"} 
            gap={2}
            sx={{
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
                <Tab flexShrink={0} border={"2px solid black"} color={"gray"} onClick={() => fetchData("")}  _hover={{ bgColor: "black", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>All types</Tab>
                <Tab flexShrink={0} border={"2px solid black"} color={"black"} onClick={() => fetchData("Single item")} _hover={{ bgColor: "blackAlpha.500", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>Single item</Tab>
                <Tab flexShrink={0} border={"2px solid black"} color={"red"} onClick={() => fetchData("Total purchase")} _hover={{ bgColor: "red.600", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>Total purchase</Tab>
                <Tab flexShrink={0} border={"2px solid black"} color={"yellow"} onClick={() => fetchData("Shipment")} _hover={{ bgColor: "yellow.500", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>Shipment</Tab>
            </TabList>
            <TabPanels>
                {vouchers.length > 0 ? (
                    <Flex justifyContent={"center"} alignItems={"center"} gap={5} w={"100%"} wrap={"wrap"}>
                        {vouchers.map(( { amount, Voucher, VoucherId }, idx ) => {
                            return (
                                <VoucherCard 
                                key={idx}
                                VoucherId={VoucherId}
                                name={Voucher?.name}
                                imgURL={Voucher?.Product?.imgURL}
                                amount={amount}
                                isPercentage={Voucher?.isPercentage}
                                nominal={Voucher?.nominal}
                                type={Voucher?.type}
                                minPay={Voucher?.minimumPayment}
                                maxDisc={Voucher?.maximumDiscount}
                                availableFrom={Voucher?.availableFrom}
                                validUntil={Voucher?.validUntil}
                                Product={Voucher?.Product}
                                Branch={Voucher?.Branch}
                                BranchId={Voucher?.BranchId}
                                />
                            )
                        })}
                    </Flex>
                ) : (
                    <Stack w={"100%"} my={5} justifyContent={"center"} alignItems={"center"}>
                        {/* <Text fontSize={"80px"} fontWeight={"bold"} textAlign={"center"}>:(</Text> */}
                        <GiOpenTreasureChest size={"100px"} />
                        <Text mt={3} fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
                            Sorry, you don't have any vouchers. 
                        </Text>
                    </Stack>
                )}
            </TabPanels>
        </Tabs>
    )
}