import { Box, Flex } from "@chakra-ui/react";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navigation/navbar";
import { ProfileLayout } from "./components/profileLayout";

export const ProfilePageView = () => {
	return (
		<Flex flexDirection="column" minHeight="100vh" justifyContent="space-between">
			<Box>
				<Navbar />
				<ProfileLayout />
			</Box>
			<Footer />
		</Flex>
	);
};
