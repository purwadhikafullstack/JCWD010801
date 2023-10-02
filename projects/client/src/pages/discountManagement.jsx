import { Box } from "@chakra-ui/react"
import { DiscountManagementPageView } from "../views/DiscountManagement"
import { AdminSidebar } from "../components/navigation/adminSidebar"
import { NavbarAdmin } from "../components/navigation/navbarAdmin"

const DiscountManagementPage = () => {
    return (
        <Box w={"100%"} h={"100%"} align={"center"} justify={"center"}>
			<AdminSidebar navSizeProp="large" navPosProp="fixed" />
			<NavbarAdmin />
            <DiscountManagementPageView/>
        </Box>
    )
}
export default DiscountManagementPage