import { Flex } from "@chakra-ui/react";
import { ErrorPageLayout } from "../../components/errorLayout";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navigation/navbar";
export const Error404PageView = () => {
	return (
		<Flex
			flexDirection="column"
			minHeight="100vh"
			justifyContent="space-between"
		>
			<Navbar />
			<ErrorPageLayout title={"404 - Page not found"} />
			<Footer />
		</Flex>
	);
};
