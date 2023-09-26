import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Flex, Box } from "@chakra-ui/react";
import { AdminSidebar } from "../../../components/navigation/adminSidebar";
import { NavbarAdmin } from "../../../components/navigation/navbarAdmin";
import { WaitingOrders } from "./branchOrder/waiting";
import { ProcessingOrders } from "./branchOrder/processing";
import { PendingOrders } from "./branchOrder/pending";
import { SentOrders } from "./branchOrder/sent";
import { ConfirmedOrders } from "./branchOrder/confirm";
import { CanceledOrders } from "./branchOrder/cancel";

export const BranchAdminOrdersList = () => {
	return (
		<Flex>
			<AdminSidebar />
			<Box w={"full"}>
				<NavbarAdmin />
				<Box w={"full"}>
					<Tabs align="center" position="relative" variant="unstyled">
						<TabList>
							<Tab>All orders</Tab>
							<Tab>Pending payment confirmation</Tab>
							<Tab>Processing</Tab>
							<Tab>Sent</Tab>
							<Tab>Confirmed</Tab>
							<Tab>Cancelled</Tab>
						</TabList>
						<TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
						<TabPanels>
							<TabPanel>
								<WaitingOrders />
							</TabPanel>
							<TabPanel>
								<PendingOrders />
							</TabPanel>
							<TabPanel>
								<ProcessingOrders />
							</TabPanel>
							<TabPanel>
								<SentOrders />
							</TabPanel>
							<TabPanel>
								<ConfirmedOrders />
							</TabPanel>
							<TabPanel>
								<CanceledOrders />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Box>
		</Flex>
	);
};
