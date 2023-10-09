import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Flex } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { VoucherTable } from "./voucherTable"
import { CreateVoucher } from "./createVoucher"
import { useNavigate } from "react-router-dom"
import { ButtonTemp } from "../../../components/button"

export const VoucherManagementPageView = () => {
    const { BranchId, username, RoleId } = useSelector((state) => state.user.value);
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
                        VOUCHER MANAGEMENT
                    </Text>
                    <ButtonTemp content={"Manage Discounts"} onClick={() => navigate('/dashboard/discount-management')} />
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
                        {RoleId === 3 ? "You are currently managing Alphamart vouchers for all branches" : `You are currently managing Alphamart vouchers for the ... branch`}
                    </Text>
                </Flex>
            </Stack>
            <Tabs colorScheme="black" w={"100%"} p={3}>
                <TabList>
                    <Tab>All Vouchers</Tab>
                    <Tab>Create</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VoucherTable/>
                    </TabPanel>
                    <TabPanel>
                        <CreateVoucher/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    )
}