import { Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { OngoingDiscount } from "./ongoingDiscount"
import { DiscountHistory } from "./discountHistory"
import { CreateDiscount } from "./createDiscount"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ButtonTemp } from "../../../components/button"

export const DiscountManagementPageView = () => {
    const { username, BranchId, RoleId } = useSelector((state) => state.user.value);
    const navigate = useNavigate();
    
    return (
        <Stack>
            <Stack mx={"5"}>
                <Flex h={"100px"} alignItems={"center"} justifyContent={"space-between"}>
                    <Text
                        className="pm-h"
                        textAlign={"left"}
                        h={"50px"}
                        w={"700px"}
                        alignSelf={"center"}
                    >
                        DISCOUNT MANAGEMENT
                    </Text>
                    <ButtonTemp content={"Manage Vouchers"} onClick={() => navigate('/dashboard/voucher-management')} />
                </Flex>
                <Flex h={"25px"}>
                    <Text
                        className="pm-d"
                        textAlign={"left"}
                        h={"25px"}
                        w={"700px"}
                        alignSelf={"center"}
                    >
                        Welcome {username}.
                    </Text>
                </Flex>
                <Flex h={"25px"}>
                    <Text
                        className="pm-d"
                        textAlign={"left"}
                        h={"25px"}
                        w={"800px"}
                        alignSelf={"center"}
                    >
                        {RoleId === 3 ? "You are currently managing Alphamart discounts for all branches" : `You are currently managing Alphamart discounts for the ... branch`}
                    </Text>
                </Flex>
            </Stack>
            <Tabs colorScheme="black" w={"100%"} p={3}>
                <TabList>
                    <Tab>Active</Tab>
                    <Tab>History</Tab>
                    <Tab>Create</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <OngoingDiscount/>
                    </TabPanel>
                    <TabPanel>
                        <DiscountHistory/>
                    </TabPanel>
                    <TabPanel>
                        <CreateDiscount/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    )
}