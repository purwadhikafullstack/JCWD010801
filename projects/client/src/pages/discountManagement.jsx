import { Flex, Stack } from "@chakra-ui/react"
import { NavbarAdmin } from "../components/navigation/navbarAdmin"
import { DiscountManagementPageView } from "../views/DiscountManagement/discount"
import { AdminSidebar } from "../components/navigation/adminSidebar"

const DiscountManagementPage = () => {
    return (
        <Flex w={"100%"} h={"100%"}>
			<AdminSidebar topProp={0} navPosProp={"sticky"}/>
            <Stack w={"100%"}>
                <NavbarAdmin />
                <DiscountManagementPageView/>
            </Stack>
        </Flex>
    )
}
export default DiscountManagementPage