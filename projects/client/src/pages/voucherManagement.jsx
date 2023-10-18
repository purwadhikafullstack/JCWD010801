import { Flex, Stack } from "@chakra-ui/react"
import { NavbarAdmin } from "../components/navigation/navbarAdmin"
import { VoucherManagementPageView } from "../views/DiscountManagement/voucher"
import { AdminSidebar } from "../components/navigation/adminSidebar"

const VoucherManagementPage = () => {
    return (
        <Flex w={"100%"} h={"100%"}>
			<AdminSidebar topProp={0} navPosProp={"sticky"}/>
            <Stack w={"100%"}>
                <NavbarAdmin />
                <VoucherManagementPageView/>
            </Stack>
        </Flex>
    )
}
export default VoucherManagementPage