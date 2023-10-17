import { Heading, Box } from "@chakra-ui/react";
import { ResetPasswordFields } from "./components/field";

export const ResetPasswordView = () => {
	return (
		<Box mt={["0px", "0px", "100px"]} mx={'30px'}>
			<Heading 
            w={"200px"} 
            mr={["0px", "150px", "150px"]} 
            mb={"20px"} 
            fontSize={"30px"} 
            fontFamily={"monospace"}>Reset Password</Heading>
			<ResetPasswordFields />
		</Box>
	);
};
