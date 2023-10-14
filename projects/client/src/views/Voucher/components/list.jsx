import axios from "axios";
import { Flex, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { VoucherCard } from "./card";

export const VoucherList = () => {
    const token = localStorage.getItem("token");
    const [ vouchers, setVouchers ] = useState([]);
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
    }, []);

    return (
        <Tabs defaultIndex={0} variant={{ base: "solid-rounded", md: "soft-rounded" }} size={{ base: "sm", md: "md" }}>
            <TabList mb={5} minW={"454px"} overflowX={"auto"} justifyContent={"space-evenly"}>
                <Tab border={"2px solid black"} color={"gray"} onClick={() => fetchData("")}  _hover={{ bgColor: "black", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>All types</Tab>
                <Tab border={"2px solid black"} color={"black"} onClick={() => fetchData("Single item")} _hover={{ bgColor: "blackAlpha.500", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>Single item</Tab>
                <Tab border={"2px solid black"} color={"red"} onClick={() => fetchData("Total purchase")} _hover={{ bgColor: "red.600", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>Total purchase</Tab>
                <Tab border={"2px solid black"} color={"yellow"} onClick={() => fetchData("Shipment")} _hover={{ bgColor: "yellow.500", color:"white" }} _selected={{ bgColor: "black", color:"white" }}>Shipment</Tab>
            </TabList>
            <TabPanels>
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
                            />
                        )
                    })}
                </Flex>
            </TabPanels>
        </Tabs>
    )
}