import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { VoucherTable } from "./voucher/voucherTable"
import { DiscountHistory } from "./discount/discountHistory"
import { OngoingDiscount } from "./discount/ongoingDiscount"
import { CreateVoucher } from "./voucher/createVoucher"
import { CreateDiscount } from "./discount/createDiscount"

export const DiscountOverview = () => {
    return (
        <Tabs colorScheme="black" w={"100%"} p={3}>
            <TabList>
                <Tab>Ongoing Discount</Tab>
                <Tab>Discount History</Tab>
                <Tab>Voucher</Tab>
                <Tab>Create Voucher</Tab>
                <Tab>Create Discount</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <OngoingDiscount/>
                </TabPanel>
                <TabPanel>
                    <DiscountHistory/>
                </TabPanel>
                <TabPanel>
                    <VoucherTable/>
                </TabPanel>
                <TabPanel>
                    <CreateVoucher/>
                </TabPanel>
                <TabPanel>
                    <CreateDiscount/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}