import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { VoucherTable } from "./voucherTable"
import { CreateVoucher } from "./createVoucher"

export const VoucherManagementPageView = () => {
    const { BranchId } = useSelector((state) => state.user.value)
    return (
        <Stack>
            <Text size={"30px"} fontWeight={"md"} mb={3}>
                VOUCHER MANAGEMENT
            </Text>
            <Text fontSize={"17px"} fontWeight={"light"} mb={10}>
                Branch {BranchId}
            </Text>
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