import { Flex, Stack } from "@chakra-ui/react"
import { NavbarAdmin } from "../components/navigation/navbarAdmin"
import LayoutSidebar from "./layoutSidebar"
import { DiscountManagementPageView } from "../views/DiscountManagement/discount"

const DiscountManagementPage = () => {
    return (
        <Flex w={"100%"} h={"100%"}>
			<LayoutSidebar/>
            <Stack w={"100%"}>
                <NavbarAdmin />
                <DiscountManagementPageView/>
            </Stack>
        </Flex>
    )
}
export default DiscountManagementPage