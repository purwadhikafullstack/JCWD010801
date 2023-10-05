import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { OngoingDiscount } from "./ongoingDiscount"
import { DiscountHistory } from "./discountHistory"
import { CreateDiscount } from "./createDiscount"
import { useSelector } from "react-redux"

export const DiscountManagementPageView = () => {
    const { BranchId } = useSelector((state) => state.user.value)
    return (
        <Stack>
            <Text size={"30px"} fontWeight={"md"} mb={3}>
                DISCOUNT MANAGEMENT
            </Text>
            <Text fontSize={"17px"} fontWeight={"light"} mb={10}>
                Branch {BranchId}
            </Text>
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