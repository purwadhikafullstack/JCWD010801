import { Flex, Stack } from "@chakra-ui/react"
import { NavbarAdmin } from "../components/navigation/navbarAdmin"
import LayoutSidebar from "./layoutSidebar"
import { VoucherManagementPageView } from "../views/DiscountManagement/voucher"

const VoucherManagementPage = () => {
    return (
        <Flex w={"100%"} h={"100%"}>
			<LayoutSidebar/>
            <Stack w={"100%"}>
                <NavbarAdmin />
                <VoucherManagementPageView/>
            </Stack>
        </Flex>
    )
}
export default VoucherManagementPage