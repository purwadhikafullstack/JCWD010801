import { Heading, Stack } from "@chakra-ui/react";
import { ResetPasswordFields } from "./components/field";

export const ResetPasswordView = () => {
	return (
		<Stack zIndex={10} w={{ base: "300px", md: "350px", lg: "400px" }} p={10} gap={10}>
			<Heading 
            w={"200px"} 
            mr={["0px", "150px", "150px"]} 
            mb={"20px"} 
            fontSize={"30px"} 
            fontFamily={"monospace"}>Reset Password</Heading>
			<ResetPasswordFields />
		</Stack>
	);
};
