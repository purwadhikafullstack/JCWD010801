import { useState } from "react";
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import ProfileTab from "./profileTab";
import AddressesTab from "./addressesTab";
import { Navigate } from "react-router-dom";

export const ProfileLayout = () => {
	const token = localStorage.getItem("token");
	return token ? (
		<Flex justifyContent={"center"} pt={{ base: "none", md: "10" }}>
			<Tabs isFitted variant="enclosed" colorScheme="gray" w={{ base: "100%", md: "75%" }}>
				<TabList>
					<Tab>Profile</Tab>
					<Tab>Addresses</Tab>
					<Tab>Orders</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<ProfileTab />
					</TabPanel>
					<TabPanel>
						<AddressesTab />
					</TabPanel>
					<TabPanel>
						<Text>maybe remove</Text>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	) : (
		<Navigate to="*" />
	);
};
