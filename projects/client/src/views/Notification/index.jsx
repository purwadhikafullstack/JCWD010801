import axios from "axios";
import { useState, useEffect } from "react";
import { Flex, Stack, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { ClearNotifications } from "./components/clear";
import { NotificationCard } from "./components/card";
import { PiBellZ } from "react-icons/pi";

export const NotificationPageView = () => {
    const token = localStorage.getItem("token");
    const [ notifications, setNotifications ] = useState([]);
    const [ reload, setReload ] = useState(false);

    const fetchData = async(value) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification?type=${value}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setNotifications(data.result);
        } catch (err) {
            console.log(err)
        }
    };

     useEffect(() => {
        fetchData("")
     }, [ reload ]);

     return (
        <Stack mx={{ base: "20px", md: "50px" }} my={{ base: "30px" }} gap={5}>
            <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
                <Heading fontWeight={"semibold"}>
                    Notifications
                </Heading>
                <ClearNotifications setReload={setReload}/>
            </Flex>
            <Tabs defaultIndex={0} size={"lg"} variant={"line"} >
                <TabList gap={4} alignItems={"start"} justifyContent={"start"} mb={10}>
                    <Tab color={"gray"} _selected={{ color: "black", borderBottom: "2px solid black" }} onClick={() => fetchData("")}>All Types</Tab>
                    <Tab color={"gray"} _selected={{ color: "black", borderBottom: "2px solid black" }} onClick={() => fetchData("Transaction")}>Orders</Tab>
                    <Tab color={"gray"} _selected={{ color: "black", borderBottom: "2px solid black" }} onClick={() => fetchData("Discount")}>Offers</Tab>
                </TabList>
                <TabPanels>
                    {notifications.length > 0 ? (
                        <Stack borderRadius={"10px"} p={{ base: 1, sm: 3, md: 5 }} boxShadow={"lg"}>
                            {notifications.map((item, idx) => {
                                return (
                                    <NotificationCard 
                                    item={item} 
                                    key={idx} 
                                    isLast={notifications.length - 1 === idx ? true : false}
                                    setReload={setReload}
                                    />
                                )
                            })}
                        </Stack>
                    ) : (
                        <Stack w={"100%"} my={5} justifyContent={"center"} alignItems={"center"}>
                            <PiBellZ size={'80px'} />
                            <Text mt={3} fontWeight={"semibold"} color={"gray"} fontSize={"xl"} textAlign={"center"}>
                                You have no new notification.
                            </Text>
                        </Stack>
                    )}
                </TabPanels>
            </Tabs>
        </Stack>
     )
}