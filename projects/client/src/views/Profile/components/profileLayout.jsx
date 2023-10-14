import ProfileTab from "./profileTab";
import AddressesTab from "./addressesTab";
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserOrdersList } from "../../OrdersList/components/userOrdersList";

export const ProfileLayout = () => {
	const token = localStorage.getItem("token");
	const location = useLocation();
	const { hash } = location;
	const navigate = useNavigate();

	const getTabFromHash = (hash) => {
		switch (hash) {
			case "#addresses":
				return 1;
			case "#orders":
				return 2;
			default:
				return 0;
		}
	};

	const activeTab = getTabFromHash(hash);
	return token ? (
		<Flex justifyContent={"center"} pt={{ base: "none", md: "10" }}>
			<Tabs isFitted variant="enclosed" colorScheme="gray" w={{ base: "100%", md: "75%" }} index={activeTab}>
				<TabList>
					<Tab onClick={() => navigate("/profile")}>Profile</Tab>
					<Tab onClick={() => navigate("/profile#addresses")}>Addresses</Tab>
					<Tab onClick={() => navigate("/profile#orders")}>Orders</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<ProfileTab />
					</TabPanel>
					<TabPanel>
						<AddressesTab />
					</TabPanel>
					<TabPanel>
						<UserOrdersList />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	) : (
		<Navigate to="*" />
	);
};
