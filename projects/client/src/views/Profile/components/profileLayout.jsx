import { useState } from "react";
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ProfileTab from "./profileTab";
import AddressesTab from "./addressesTab";
import { Navigate } from "react-router-dom";
import { OrdersList } from "../../OrdersList/components/ordersList";


export const ProfileLayout = () => {
	const token = localStorage.getItem("token")

	const [addresses] = useState([
		{
			street: "123 Main St",
			city: "Cityville",
			state: "Stateville",
			zipCode: "12345",
		},
		
	]);

	return token ? (
        <Flex justifyContent={"center"} pt={{base:"none", md:"10"}}>
		<Tabs isFitted variant="enclosed" colorScheme="gray" w={{base:"100%", md:"75%"}} >
			<TabList>
				<Tab>Profile</Tab>
				<Tab>Addresses</Tab>
				<Tab>Orders</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					<ProfileTab/>
				</TabPanel>
				<TabPanel>
					<AddressesTab addresses={addresses} />
				</TabPanel>
				<TabPanel>
					<OrdersList/>
				</TabPanel>
			</TabPanels>
		</Tabs>
        </Flex>
	) : ( <Navigate to="*"/>);
};
